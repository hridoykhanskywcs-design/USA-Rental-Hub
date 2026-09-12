import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl p-4 flex items-start gap-3 transition-all transform translate-y-0"
          >
            <div className="mt-0.5 flex-shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              {toast.type === 'alert' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              {toast.type === 'info' && <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{toast.title}</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
