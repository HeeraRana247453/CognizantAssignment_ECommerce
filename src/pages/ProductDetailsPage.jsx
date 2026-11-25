import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, formatCategory } from '../utils/format';
import Alert from '../components/Alert';
import Badge from '../components/Badge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import PriceTag from '../components/PriceTag';

function ProductDetailsPage() {
  const { id } = useParams();
  const { getProductById, loading, error, refetch } = useProducts();
  const { cartItems, handleAddToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { isAdmin } = useAuth();

  const [activeImage, setActiveImage] = useState(0);

  // going from one product to another reuses this component, so reset the gallery
  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  if (loading) return <Loader text="Loading product..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const product = getProductById(id);
  const hiddenFromStore = product && (!product.isActive || product.isRemoved);

  // customers can't open hidden or removed products, admins can (to preview them)
  if (!product || (hiddenFromStore && !isAdmin)) {
    return (
      <EmptyState
        title="Product not found"
        message="This product does not exist or is no longer available."
        actionLabel="Back to shop"
        actionTo="/"
      />
    );
  }

  const cartItem = cartItems.find((item) => item.id === product.id);
  const isWishlisted = wishlistIds.has(product.id);
  const outOfStock = product.stock < 1;
  const hasDiscount = product.discountPercentage > 0;
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <section>
      <Link to="/" className="mb-6 inline-block text-sm text-stone-500 hover:text-teal-700">
        &larr; Back to shop
      </Link>

      {hiddenFromStore && (
        <div className="mb-6">
          <Alert variant="warning">
            This product is {product.isRemoved ? 'removed' : 'hidden'}. Customers cannot see it.
            You can manage it in the <Link to="/admin" className="font-semibold underline">Admin Panel</Link>.
          </Alert>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-stone-200 bg-white">
            {hasDiscount && (
              <Badge variant="sale" className="absolute left-4 top-4 z-10 px-3! py-1! text-sm! shadow">
                -{product.discountPercentage}% OFF
              </Badge>
            )}
            <img
              src={images[activeImage]}
              alt={product.title}
              className="h-full w-full object-contain p-6"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((img, index) => (
                <button
                  type="button"
                  key={img}
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 bg-white p-1 transition ${
                    index === activeImage ? 'border-teal-600' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            {formatCategory(product.category)}
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {product.title}
          </h1>
          {product.brand && <p className="mt-1 text-stone-500">by {product.brand}</p>}

          <div className="mt-5">
            <PriceTag
              size="lg"
              price={product.price}
              finalPrice={product.finalPrice}
              discountPercentage={product.discountPercentage}
            />
            {hasDiscount && (
              <p className="mt-1 text-sm font-medium text-emerald-700">
                You save {formatPrice(product.price - product.finalPrice)}
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-500">
            <span>{product.rating ? `Rating ${product.rating} / 5` : 'New arrival'}</span>
            <span aria-hidden="true">&middot;</span>
            {outOfStock ? (
              <span className="font-medium text-rose-600">Out of stock</span>
            ) : (
              <span className="font-medium text-emerald-700">{product.stock} in stock</span>
            )}
          </div>

          <p className="mt-6 max-w-prose leading-relaxed text-stone-600">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button disabled={outOfStock} onClick={() => handleAddToCart(product)}>
              {cartItem ? 'Add another' : 'Add to cart'}
            </Button>

            <Button variant="outline" onClick={() => toggleWishlist(product.id)}>
              {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            </Button>

            {cartItem && (
              <Button variant="outline" to="/cart">
                View cart ({cartItem.quantity})
              </Button>
            )}
          </div>

          {isWishlisted && (
            <p className="mt-4 text-sm text-stone-500">This product is in your wishlist.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
