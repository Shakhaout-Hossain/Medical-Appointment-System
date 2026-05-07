import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; classes: string; bar: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />,
    classes: 'bg-white border border-success-200 shadow-lg',
    bar: 'bg-success-500',
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />,
    classes: 'bg-white border border-danger-200 shadow-lg',
    bar: 'bg-danger-500',
  },
  info: {
    icon: <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />,
    classes: 'bg-white border border-primary-200 shadow-lg',
    bar: 'bg-primary-500',
  },
};

const ToastItem = ({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) => {
  const [leaving, setLeaving] = useState(false);
  const config = variantConfig[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 250);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 250);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${config.classes} flex items-start gap-3 p-4 pr-10 ${
        leaving ? 'animate-toast-out' : 'animate-toast-in'
      }`}
      /* Full width on mobile, fixed 320px on sm+ */
      style={{ width: 'min(320px, calc(100vw - 2rem))' }}
    >
      {config.icon}
      <p className="text-sm font-medium text-slate-800 flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${config.bar} opacity-60`}
        style={{ animation: 'shimmer-bar 3.5s linear forwards' }}
      />
      <style>{`
        @keyframes shimmer-bar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export const Toast = ({ toasts, onRemove }: ToastProps) => {
  if (toasts.length === 0) return null;
  return (
    /* Safe inset on all sides — works on notched phones */
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
};

/* ── Hook ─────────────────────────────────────────────────── */
import { useState as useStateHook, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useStateHook<ToastMessage[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

export default Toast;
