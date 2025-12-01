export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
  originalError?: Error;
}

export class ApplicationError extends Error implements AppError {
  type: ErrorType;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
  originalError?: Error;

  constructor(
    type: ErrorType,
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      details?: Record<string, any>;
      originalError?: Error;
    }
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.type = type;
    this.code = options?.code;
    this.statusCode = options?.statusCode;
    this.details = options?.details;
    this.originalError = options?.originalError;
  }
}

export function parseError(error: unknown): AppError {
  if (error instanceof ApplicationError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return new ApplicationError(
        ErrorType.NETWORK,
        'Unable to connect to the server. Please check your internet connection.',
        { originalError: error }
      );
    }

    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return new ApplicationError(
        ErrorType.AUTHENTICATION,
        'Your session has expired. Please log in again.',
        { statusCode: 401, originalError: error }
      );
    }

    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return new ApplicationError(
        ErrorType.AUTHORIZATION,
        'You do not have permission to perform this action.',
        { statusCode: 403, originalError: error }
      );
    }

    if (error.message.includes('404') || error.message.includes('Not Found')) {
      return new ApplicationError(
        ErrorType.NOT_FOUND,
        'The requested resource was not found.',
        { statusCode: 404, originalError: error }
      );
    }

    if (error.message.includes('500') || error.message.includes('Server Error')) {
      return new ApplicationError(
        ErrorType.SERVER,
        'A server error occurred. Please try again later.',
        { statusCode: 500, originalError: error }
      );
    }

    return new ApplicationError(
      ErrorType.UNKNOWN,
      error.message || 'An unexpected error occurred',
      { originalError: error }
    );
  }

  if (typeof error === 'string') {
    return new ApplicationError(ErrorType.UNKNOWN, error);
  }

  return new ApplicationError(
    ErrorType.UNKNOWN,
    'An unexpected error occurred. Please try again.'
  );
}

export interface UserFacingError {
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
  canRetry: boolean;
}

export function getUserFacingError(error: AppError, context?: {
  onRetry?: () => void;
  onLogin?: () => void;
}): UserFacingError {
  switch (error.type) {
    case ErrorType.NETWORK:
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        action: context?.onRetry ? {
          label: 'Retry',
          handler: context.onRetry
        } : undefined,
        canRetry: true
      };

    case ErrorType.AUTHENTICATION:
      return {
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again to continue.',
        action: context?.onLogin ? {
          label: 'Log In',
          handler: context.onLogin
        } : undefined,
        canRetry: false
      };

    case ErrorType.AUTHORIZATION:
      return {
        title: 'Access Denied',
        message: 'You do not have permission to perform this action. Please contact support if you believe this is an error.',
        canRetry: false
      };

    case ErrorType.VALIDATION:
      return {
        title: 'Invalid Input',
        message: error.message || 'Please check your input and try again.',
        canRetry: true
      };

    case ErrorType.NOT_FOUND:
      return {
        title: 'Not Found',
        message: 'The requested resource could not be found. It may have been moved or deleted.',
        canRetry: false
      };

    case ErrorType.SERVER:
      return {
        title: 'Server Error',
        message: 'A server error occurred. Our team has been notified. Please try again later.',
        action: context?.onRetry ? {
          label: 'Retry',
          handler: context.onRetry
        } : undefined,
        canRetry: true
      };

    case ErrorType.UNKNOWN:
    default:
      return {
        title: 'Something Went Wrong',
        message: error.message || 'An unexpected error occurred. Please try again.',
        action: context?.onRetry ? {
          label: 'Retry',
          handler: context.onRetry
        } : undefined,
        canRetry: true
      };
  }
}

export function logError(error: AppError, context?: Record<string, any>): void {
  const errorLog = {
    type: error.type,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    details: error.details,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  console.error('[AppError]', errorLog);

  if (process.env.NODE_ENV === 'production' && error.type !== ErrorType.VALIDATION) {
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }
}

export function handleApiError(response: Response, data?: any): ApplicationError {
  const statusCode = response.status;

  if (statusCode === 401) {
    return new ApplicationError(
      ErrorType.AUTHENTICATION,
      data?.message || 'Authentication required',
      { statusCode, details: data }
    );
  }

  if (statusCode === 403) {
    return new ApplicationError(
      ErrorType.AUTHORIZATION,
      data?.message || 'Access forbidden',
      { statusCode, details: data }
    );
  }

  if (statusCode === 404) {
    return new ApplicationError(
      ErrorType.NOT_FOUND,
      data?.message || 'Resource not found',
      { statusCode, details: data }
    );
  }

  if (statusCode >= 400 && statusCode < 500) {
    return new ApplicationError(
      ErrorType.VALIDATION,
      data?.message || 'Invalid request',
      { statusCode, details: data }
    );
  }

  if (statusCode >= 500) {
    return new ApplicationError(
      ErrorType.SERVER,
      data?.message || 'Server error',
      { statusCode, details: data }
    );
  }

  return new ApplicationError(
    ErrorType.UNKNOWN,
    data?.message || 'Request failed',
    { statusCode, details: data }
  );
}
