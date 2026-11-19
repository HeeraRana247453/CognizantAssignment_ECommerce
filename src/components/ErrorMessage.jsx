import Button from './Button';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-box error-box" role="alert">
      <p>{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
