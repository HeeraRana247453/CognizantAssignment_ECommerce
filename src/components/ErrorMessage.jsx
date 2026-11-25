import Button from './Button';
import { AlertIcon } from './Icons';

function ErrorMessage({ message, onRetry }) {
  return (
    <div
      className="mx-auto my-12 max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"
      role="alert"
    >
      <AlertIcon className="mx-auto h-9 w-9 text-rose-500" />
      <p className="mt-3 text-sm font-medium text-rose-800">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
