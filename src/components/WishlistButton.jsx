import { HeartIcon } from './Icons';

// heart icon button, filled when the product is already wishlisted
function WishlistButton({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow ring-1 ring-stone-200 backdrop-blur transition hover:scale-110 ${
        active ? 'text-rose-600' : 'text-stone-500 hover:text-rose-600'
      }`}
    >
      <HeartIcon filled={active} className="h-[18px] w-[18px]" />
    </button>
  );
}

export default WishlistButton;
