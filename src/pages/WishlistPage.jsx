import { useMemo } from 'react';

import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

function WishlistPage() {
  const { cartItems, handleAddToCart } = useCart();
  const { wishlistItems, wishlistIds, toggleWishlist } = useWishlist();

  const cartIds = useMemo(() => new Set(cartItems.map((item) => item.id)), [cartItems]);

  if (wishlistItems.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        message="Tap the heart on any product to save it here for later."
        actionLabel="Browse products"
        actionTo="/"
      />
    );
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Wishlist</h1>
        <span className="muted">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="product-grid">
        {wishlistItems.map((product) => (
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
