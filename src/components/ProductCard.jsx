import { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatCategory } from '../utils/format';

// memo + useCallback in the parent means a card only re-renders when its own
// product (or its inCart flag) changes, not on every keystroke in the search box
function ProductCard({ product, inCart, onAddToCart }) {
  return (
    <article className="product-card">
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
          <button
            className={inCart ? 'btn btn-outline btn-small' : 'btn btn-small'}
            onClick={() => onAddToCart(product)}
          >
            {inCart ? 'Add another' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
