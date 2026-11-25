import { useState, useMemo } from 'react';

import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import ProductCard from '../components/ProductCard';
import SearchFilterBar from '../components/SearchFilterBar';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

function ProductListPage() {
  const { storeProducts, loading, error, refetch } = useProducts();
  const { cartItems, handleAddToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const categories = useMemo(() => {
    const unique = new Set(storeProducts.map((p) => p.category));
    return ['all', ...unique];
  }, [storeProducts]);

  const saleCount = useMemo(
    () => storeProducts.filter((p) => p.discountPercentage > 0).length,
    [storeProducts]
  );

  // ids of products already in the cart, so cards can show a different button
  const cartIds = useMemo(() => new Set(cartItems.map((item) => item.id)), [cartItems]);

  // Filtering + sorting runs again on every render unless we memoize it, and this
  // page re-renders when the cart or wishlist changes, not just when filters do.
  // Sorting uses finalPrice, because that is what the customer actually pays.
  const visibleProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = storeProducts.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(term);
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSale = !onSaleOnly || product.discountPercentage > 0;
      return matchesSearch && matchesCategory && matchesSale;
    });

    if (sortOrder === 'low-high') {
      result = [...result].sort((a, b) => a.finalPrice - b.finalPrice);
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => b.finalPrice - a.finalPrice);
    }

    return result;
  }, [storeProducts, searchTerm, category, sortOrder, onSaleOnly]);

  function resetFilters() {
    setSearchTerm('');
    setCategory('all');
    setSortOrder('default');
    setOnSaleOnly(false);
  }

  if (loading) return <Loader text="Loading products..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <section>
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-stone-900 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-teal-500/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="relative max-w-xl">
          <p className="text-sm font-medium text-teal-300">
            {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'New season picks'}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Things worth having, priced fairly.
          </h1>
          <p className="mt-4 text-stone-300">
            {storeProducts.length} products across {categories.length - 1} categories,
            with {saleCount} on sale right now.
          </p>
          <button
            type="button"
            onClick={() => setOnSaleOnly(true)}
            className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-teal-50"
          >
            See what's on sale
          </button>
        </div>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        categories={categories}
        onCategoryChange={setCategory}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        onSaleOnly={onSaleOnly}
        onSaleOnlyChange={setOnSaleOnly}
      />

      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold">All products</h2>
        <span className="text-sm text-stone-500">
          {visibleProducts.length} of {storeProducts.length} items
        </span>
      </div>

      {visibleProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Nothing matches your search. Try a different name or category."
          actionLabel="Clear filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {visibleProducts.map((product) => (
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
      )}
    </section>
  );
}

export default ProductListPage;
