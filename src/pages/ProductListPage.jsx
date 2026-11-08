import { useState, useEffect, useMemo } from 'react';

import { getProducts } from '../api/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import SearchFilterBar from '../components/SearchFilterBar';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const { cartItems, handleAddToCart } = useCart();

  // bumping this number re-runs the fetch effect (used by the retry button)
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        const data = await getProducts();
        if (!ignore) setProducts(data);
      } catch (err) {
        if (!ignore) setError('Could not load products. Please check your connection.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();

    // if the component unmounts mid-request, don't set state on it
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ['all', ...unique];
  }, [products]);

  // ids of products already in the cart, so cards can show a different button
  const cartIds = useMemo(() => new Set(cartItems.map((item) => item.id)), [cartItems]);

  // Filtering and sorting on a list of 100 items is cheap, but this still runs on
  // every render (e.g. when the cart changes) unless we memoize it.
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

  if (loading) return <Spinner text="Loading products..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />;

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
        <div className="status-box">
          <p>No products match your search. Try a different name or category.</p>
        </div>
      ) : (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCart={cartIds.has(product.id)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductListPage;
