import { memo } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';
import WishlistButton from './WishlistButton';
import { formatPrice, formatCategory } from '../utils/format';

// The grid can show 100 of these. Because of memo, plus the stable handlers coming
// from the context, a card only re-renders when its own product, inCart or
// isWishlisted changes, not on every keystroke in the search box.
function ProductCard({ product, inCart, isWishlisted, onAddToCart, onToggleWishlist }) {
  return (
    <article className="product-card">
      <WishlistButton active={isWishlisted} onClick={() => onToggleWishlist(product)} />

      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </Link>

      <div className="product-info">
        <span className="product-category">{formatCategory(product.category)}</span>
        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>

        <div className="product-bottom">
          <span className="product-price">{formatPrice(product.price)}</span>
          <Button
            size="small"
            variant={inCart ? 'outline' : 'primary'}
            onClick={() => onAddToCart(product)}
          >
            {inCart ? 'Add another' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
