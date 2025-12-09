import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ToastContainer, ToastProps, ToastType } from "../components/Toast";

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (options: ToastOptions | string) => void;
    error: (options: ToastOptions | string) => void;
    warning: (options: ToastOptions | string) => void;
    info: (options: ToastOptions | string) => void;
  };
  showToast: (type: ToastType, options: ToastOptions | string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, options: ToastOptions | string) => {
      const id = `toast-${++toastId}`;
      const toastOptions =
        typeof options === "string" ? { title: options } : options;

      const newToast: ToastProps = {
        id,
        type,
        title: toastOptions.title,
        message: toastOptions.message,
        duration: toastOptions.duration || 5000,
        onClose: removeToast,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    [removeToast],
  );

  const toast = {
    success: (options: ToastOptions | string) => showToast("success", options),
    error: (options: ToastOptions | string) => showToast("error", options),
    warning: (options: ToastOptions | string) => showToast("warning", options),
    info: (options: ToastOptions | string) => showToast("info", options),
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;
