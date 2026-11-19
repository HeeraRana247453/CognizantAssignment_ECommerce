import { useState, useMemo } from 'react';

import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/ProductCard';
import SearchFilterBar from '../components/SearchFilterBar';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

function ProductListPage() {
  const { products, loading, error, refetch } = useProducts();
  const { cartItems, handleAddToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ['all', ...unique];
  }, [products]);

  // ids of products already in the cart, so cards can show a different button
  const cartIds = useMemo(() => new Set(cartItems.map((item) => item.id)), [cartItems]);

  // Filtering + sorting runs again on every render unless we memoize it, and this
  // page re-renders when the cart or wishlist changes, not just when filters do.
  const visibleProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(term);
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortOrder === 'low-high') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchTerm, category, sortOrder]);

  function resetFilters() {
    setSearchTerm('');
    setCategory('all');
    setSortOrder('default');
  }

  if (loading) return <Loader text="Loading products..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <section>
      <div className="page-heading">
        <h1>All products</h1>
        <span className="muted">
          {visibleProducts.length} of {products.length} items
        </span>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        categories={categories}
        onCategoryChange={setCategory}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {visibleProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Nothing matches your search. Try a different name or category."
          actionLabel="Clear filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="product-grid">
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
