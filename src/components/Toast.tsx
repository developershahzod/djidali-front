import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  { bg: string; border: string; icon: React.ReactNode }
> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-500",
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-500",
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-500",
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const style = toastStyles[type];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 50);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border-l-4 shadow-lg
        ${style.bg} ${style.border}
        transform transition-all duration-300 ease-in-out
        ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}
      `}
      role="alert"
    >
      <div className="p-4 pr-10">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            {message && (
              <p className="mt-1 text-sm text-gray-600 break-words">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className={`h-full transition-all duration-50 ease-linear ${
            type === "success"
              ? "bg-green-500"
              : type === "error"
                ? "bg-red-500"
                : type === "warning"
                  ? "bg-amber-500"
                  : "bg-blue-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

export default Toast;
