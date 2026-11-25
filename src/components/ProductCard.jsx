import { memo } from 'react';
import { Link } from 'react-router-dom';

import Badge from './Badge';
import Button from './Button';
import PriceTag from './PriceTag';
import WishlistButton from './WishlistButton';
import { formatCategory } from '../utils/format';

// The grid can show 100 of these. Because of memo, plus the stable handlers coming
// from the contexts, a card only re-renders when its own product, inCart or
// isWishlisted changes, not on every keystroke in the search box.
function ProductCard({ product, inCart, isWishlisted, onAddToCart, onToggleWishlist }) {
  const outOfStock = product.stock < 1;
  const hasDiscount = product.discountPercentage > 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10">
      {hasDiscount && (
        <Badge variant="sale" className="absolute left-3 top-3 z-10 shadow">
          -{product.discountPercentage}%
        </Badge>
      )}
      <WishlistButton active={isWishlisted} onClick={() => onToggleWishlist(product.id)} />

      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-stone-100"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className={`h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105 ${
            outOfStock ? 'opacity-40' : ''
          }`}
        />
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-teal-700">
          {formatCategory(product.category)}
        </span>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-stone-900">
          <Link to={`/products/${product.id}`} className="hover:text-teal-700">
            {product.title}
          </Link>
        </h3>

        {!outOfStock && product.stock <= 5 && (
          <p className="mt-1 text-xs font-medium text-amber-600">Only {product.stock} left</p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <PriceTag
            price={product.price}
            finalPrice={product.finalPrice}
            discountPercentage={product.discountPercentage}
          />
          <Button
            size="small"
            variant={inCart ? 'outline' : 'primary'}
            disabled={outOfStock}
            onClick={() => onAddToCart(product)}
          >
            {inCart ? 'Add another' : 'Add'}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
