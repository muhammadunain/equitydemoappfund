import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <AlertCircle className="w-5 h-5 text-blue-500" />
};

const backgrounds = {
  success: 'bg-emerald-50 dark:bg-emerald-950/50',
  error: 'bg-red-50 dark:bg-red-950/50',
  info: 'bg-blue-50 dark:bg-blue-950/50'
};

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${backgrounds[type]}`}>
      {icons[type]}
      <p className="text-sm">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
} 