import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice, formatCategory } from '../utils/format';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function ProductDetailsPage() {
  const { id } = useParams();
  const { product, loading, error, refetch } = useProduct(id);
  const { cartItems, handleAddToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);

  // going from one product to another reuses this component, so reset the gallery
  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  if (loading) return <Loader text="Loading product..." />;

  if (error || !product) {
    return (
      <>
        <ErrorMessage message={error || 'Product not found.'} onRetry={refetch} />
        <p className="center">
          <Link to="/">Back to products</Link>
        </p>
      </>
    );
  }

  const cartItem = cartItems.find((item) => item.id === product.id);
  const isWishlisted = wishlistIds.has(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <section>
      <Link to="/" className="back-link">
        &larr; Back to products
      </Link>

      <div className="details-layout">
        <div className="details-gallery">
          <div className="details-main-image">
            <img src={images[activeImage]} alt={product.title} />
          </div>

          {images.length > 1 && (
            <div className="details-thumbs">
              {images.map((img, index) => (
                <button
                  type="button"
                  key={img}
                  className={index === activeImage ? 'thumb active' : 'thumb'}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={img} alt={`${product.title} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="details-info">
          <span className="product-category">{formatCategory(product.category)}</span>
          <h1>{product.title}</h1>
          {product.brand && <p className="muted">by {product.brand}</p>}

          <p className="details-price">{formatPrice(product.price)}</p>

          <p className="details-meta">
            Rating {product.rating} / 5
            {product.stock > 0 ? (
              <span className="in-stock"> &middot; {product.stock} in stock</span>
            ) : (
              <span className="out-of-stock"> &middot; Out of stock</span>
            )}
          </p>

          <p className="details-description">{product.description}</p>

          <div className="details-actions">
            <Button onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
              {cartItem ? 'Add another' : 'Add to cart'}
            </Button>

            <Button variant="outline" onClick={() => toggleWishlist(product)}>
              {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            </Button>

            {cartItem && (
              <Button variant="outline" to="/cart">
                View cart ({cartItem.quantity})
              </Button>
            )}
          </div>

          {isWishlisted && <p className="muted wishlist-note">This product is in your wishlist.</p>}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
