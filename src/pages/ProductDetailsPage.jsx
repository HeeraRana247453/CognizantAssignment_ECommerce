import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getProductById } from '../api/products';
import { useCart } from '../context/CartContext';
import { formatPrice, formatCategory } from '../utils/format';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

function ProductDetailsPage() {
  const { id } = useParams();
  const { cartItems, handleAddToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError('');
      setActiveImage(0);
      try {
        const data = await getProductById(id);
        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) setError('We could not find this product.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <Spinner text="Loading product..." />;
  if (error || !product) {
    return (
      <>
        <ErrorMessage message={error || 'Product not found.'} />
        <p className="center">
          <Link to="/">Back to products</Link>
        </p>
      </>
    );
  }

  const cartItem = cartItems.find((item) => item.id === product.id);
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
            <button
              className="btn"
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
            >
              {cartItem ? 'Add another' : 'Add to cart'}
            </button>

            {cartItem && (
              <Link to="/cart" className="btn btn-outline">
                View cart ({cartItem.quantity})
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
