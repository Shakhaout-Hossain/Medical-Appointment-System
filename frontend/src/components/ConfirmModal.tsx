import { Loader2, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal — slides up from bottom on mobile, centered on sm+ */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm animate-scale-in overflow-hidden">
        {/* Top accent bar */}
        <div className={`h-1 w-full ${isDanger ? 'bg-danger-500' : 'bg-warning-500'}`} />

        <div className="p-5 sm:p-6">
          {/* Icon */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-4 ${
              isDanger ? 'bg-danger-50' : 'bg-warning-50'
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 sm:w-6 sm:h-6 ${isDanger ? 'text-danger-500' : 'text-warning-600'}`}
            />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 px-5 sm:px-6 pb-6 sm:pb-6 pb-safe">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${
              isDanger
                ? 'bg-danger-600 hover:bg-danger-700'
                : 'bg-warning-500 hover:bg-warning-600'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
