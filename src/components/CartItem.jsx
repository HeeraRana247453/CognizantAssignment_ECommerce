import { memo } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';
import PriceTag from './PriceTag';
import { formatPrice } from '../utils/format';

// memo here means changing the quantity of one item doesn't re-render the others
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const atMaxStock = item.quantity >= item.stock;

  return (
    <li className="grid grid-cols-[72px_1fr] items-center gap-x-4 gap-y-3 p-4 sm:grid-cols-[88px_1fr_auto_90px]">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="h-[72px] w-[72px] rounded-xl bg-stone-100 object-contain p-1 sm:h-[88px] sm:w-[88px]"
      />

      <div className="flex min-w-0 flex-col items-start gap-1">
        <Link to={`/products/${item.id}`} className="font-semibold hover:text-teal-700">
          {item.title}
        </Link>
        <PriceTag
          price={item.originalPrice ?? item.price}
          finalPrice={item.price}
          discountPercentage={item.discountPercentage ?? 0}
        />
        <Button
          variant="link"
          className="text-xs text-rose-600 hover:text-rose-800"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </Button>
      </div>

      <div className="col-start-2 flex flex-col items-start gap-1 sm:col-start-auto">
        <div className="inline-flex items-center rounded-full border border-stone-300 bg-white">
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            disabled={item.quantity === 1}
            aria-label="Decrease quantity"
            className="h-9 w-9 rounded-full text-lg text-stone-700 hover:bg-stone-100 disabled:text-stone-300 disabled:hover:bg-transparent"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onIncrease(item.id)}
            disabled={atMaxStock}
            aria-label="Increase quantity"
            className="h-9 w-9 rounded-full text-lg text-stone-700 hover:bg-stone-100 disabled:text-stone-300 disabled:hover:bg-transparent"
          >
            +
          </button>
        </div>
        {atMaxStock && <span className="text-xs text-amber-600">Max in stock</span>}
      </div>

      <strong className="col-start-2 text-left text-base sm:col-start-auto sm:text-right">
        {formatPrice(item.price * item.quantity)}
      </strong>
    </li>
  );
}

export default memo(CartItem);
