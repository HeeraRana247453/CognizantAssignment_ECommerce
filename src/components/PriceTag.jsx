import { formatPrice } from '../utils/format';

// Shows the price people pay. When there is a discount it also shows the original
// price crossed out. Used on cards, the details page, the cart and the admin list.
function PriceTag({ price, finalPrice, discountPercentage = 0, size = 'md' }) {
  const hasDiscount = discountPercentage > 0;
  const large = size === 'lg';

  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span
        className={`font-bold ${large ? 'text-3xl' : 'text-base'} ${
          hasDiscount ? 'text-rose-600' : 'text-stone-900'
        }`}
      >
        {formatPrice(finalPrice)}
      </span>
      {hasDiscount && (
        <span className={`text-stone-400 line-through ${large ? 'text-lg' : 'text-sm'}`}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
}

export default PriceTag;
