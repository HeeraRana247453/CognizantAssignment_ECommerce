function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-box error-box">
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
