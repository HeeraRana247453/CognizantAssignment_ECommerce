import Button from './Button';
import { BagIcon } from './Icons';

// shown when a list has nothing in it (empty cart, empty wishlist, no search results)
function EmptyState({ title, message, actionLabel, actionTo, onAction, icon }) {
  return (
    <div className="mx-auto my-12 max-w-md rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-stone-100 text-stone-500">
        {icon || <BagIcon className="h-6 w-6" />}
      </div>
      {title && <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>}
      <p className="mt-2 text-sm text-stone-500">{message}</p>
      {actionLabel && (actionTo || onAction) && (
        <Button to={actionTo} onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
