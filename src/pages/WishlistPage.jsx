import { useMemo } from 'react';

import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useWishlistProducts } from '../hooks/useWishlistProducts';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { HeartIcon } from '../components/Icons';

function WishlistPage() {
  const { loading, error, refetch } = useProducts();
  const { cartItems, handleAddToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const wishlistProducts = useWishlistProducts();

  const cartIds = useMemo(() => new Set(cartItems.map((item) => item.id)), [cartItems]);

  if (loading) return <Loader text="Loading your wishlist..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  if (wishlistProducts.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon className="h-6 w-6" />}
        title="Your wishlist is empty"
        message="Tap the heart on any product to save it here for later."
        actionLabel="Browse products"
        actionTo="/"
      />
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-semibold">Wishlist</h1>
        <span className="text-sm text-stone-500">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            inCart={cartIds.has(product.id)}
            isWishlisted={wishlistIds.has(product.id)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}

export default WishlistPage;
