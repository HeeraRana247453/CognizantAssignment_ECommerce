import { CheckIcon, AlertIcon, CloseIcon } from './Icons';

const styles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

// inline banner for feedback after an action (saved, failed, heads up...)
function Alert({ variant = 'success', children, onClose }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {variant === 'success' ? (
        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" className="opacity-60 hover:opacity-100">
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
