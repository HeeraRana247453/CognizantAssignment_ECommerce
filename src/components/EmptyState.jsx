import Button from './Button';

// shown when a list has nothing in it (empty cart, empty wishlist, no search results)
function EmptyState({ title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="status-box">
      {title && <h2>{title}</h2>}
      <p>{message}</p>
      {actionLabel && (actionTo || onAction) && (
        <Button to={actionTo} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
