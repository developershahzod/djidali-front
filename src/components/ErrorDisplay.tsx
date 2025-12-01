import React from 'react';
import { AlertTriangle, Wifi, Lock, Search, Server, RefreshCw, X } from 'lucide-react';
import { UserFacingError } from '../utils/error-handler';

export interface ErrorDisplayProps {
  error: UserFacingError;
  onDismiss?: () => void;
  className?: string;
  inline?: boolean;
}

const iconMap = {
  'Connection Error': Wifi,
  'Session Expired': Lock,
  'Access Denied': Lock,
  'Not Found': Search,
  'Server Error': Server,
  'Invalid Input': AlertTriangle,
  'Something Went Wrong': AlertTriangle
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  className = '',
  inline = false
}) => {
  const Icon = iconMap[error.title as keyof typeof iconMap] || AlertTriangle;

  if (inline) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl px-4 py-3 ${className}`}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-900">{error.title}</p>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
            {error.action && (
              <button
                onClick={error.action.handler}
                className="mt-3 text-sm font-semibold text-red-700 hover:text-red-800 underline"
              >
                {error.action.label}
              </button>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <Icon className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          {error.title}
        </h2>

        <p className="text-gray-600 text-center mb-6">
          {error.message}
        </p>

        <div className="flex gap-3 justify-center">
          {error.action && (
            <button
              onClick={error.action.handler}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              {error.action.label}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;

export function ErrorToast({ error, onDismiss }: {
  error: UserFacingError;
  onDismiss: () => void;
}) {
  const Icon = iconMap[error.title as keyof typeof iconMap] || AlertTriangle;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border-l-4 border-red-500 p-4">
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{error.title}</p>
            <p className="text-sm text-gray-600 mt-1">{error.message}</p>
            {error.action && (
              <button
                onClick={error.action.handler}
                className="mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {error.action.label}
              </button>
            )}
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
