import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppError,
  UserFacingError,
  parseError,
  getUserFacingError,
  logError
} from '../utils/error-handler';

export interface UseErrorHandlerReturn {
  error: UserFacingError | null;
  hasError: boolean;
  handleError: (error: unknown, context?: Record<string, any>) => void;
  clearError: () => void;
  retry: () => void;
}

export function useErrorHandler(options?: {
  onRetry?: () => void | Promise<void>;
  logErrors?: boolean;
}): UseErrorHandlerReturn {
  const [error, setError] = useState<UserFacingError | null>(null);
  const navigate = useNavigate();
  const retryFnRef = useRef<(() => void | Promise<void>) | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    retryFnRef.current = null;
  }, []);

  const handleLogin = useCallback(() => {
    clearError();
    navigate('/login');
  }, [clearError, navigate]);

  const retry = useCallback(async () => {
    if (retryFnRef.current) {
      clearError();
      try {
        await retryFnRef.current();
      } catch (err) {
        handleError(err);
      }
    } else if (options?.onRetry) {
      clearError();
      try {
        await options.onRetry();
      } catch (err) {
        handleError(err);
      }
    }
  }, [clearError, options?.onRetry]);

  const handleError = useCallback((error: unknown, context?: Record<string, any>) => {
    const appError: AppError = parseError(error);

    if (options?.logErrors !== false) {
      logError(appError, context);
    }

    const userError = getUserFacingError(appError, {
      onRetry: options?.onRetry ? retry : undefined,
      onLogin: handleLogin
    });

    setError(userError);
    retryFnRef.current = options?.onRetry || null;
  }, [options?.logErrors, options?.onRetry, retry, handleLogin]);

  return {
    error,
    hasError: error !== null,
    handleError,
    clearError,
    retry
  };
}

export interface UseAsyncErrorReturn<T> {
  execute: (...args: any[]) => Promise<T | undefined>;
  loading: boolean;
  error: UserFacingError | null;
  clearError: () => void;
  retry: () => Promise<void>;
}

export function useAsyncError<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: UserFacingError) => void;
    logErrors?: boolean;
  }
): UseAsyncErrorReturn<T> {
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler({
    logErrors: options?.logErrors
  });
  const lastArgsRef = useRef<any[]>([]);

  const execute = useCallback(async (...args: any[]): Promise<T | undefined> => {
    lastArgsRef.current = args;
    setLoading(true);
    clearError();

    try {
      const result = await asyncFunction(...args);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      handleError(err);
      if (options?.onError && error) {
        options.onError(error);
      }
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, handleError, clearError, options?.onSuccess, options?.onError, error]);

  const retry = useCallback(async () => {
    await execute(...lastArgsRef.current);
  }, [execute]);

  return {
    execute,
    loading,
    error,
    clearError,
    retry
  };
}

export function useErrorToast(duration: number = 5000): {
  showError: (error: unknown) => void;
  error: UserFacingError | null;
  clearError: () => void;
} {
  const { error, handleError, clearError } = useErrorHandler();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showError = useCallback((err: unknown) => {
    handleError(err);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      clearError();
    }, duration);
  }, [handleError, clearError, duration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    showError,
    error,
    clearError
  };
}
