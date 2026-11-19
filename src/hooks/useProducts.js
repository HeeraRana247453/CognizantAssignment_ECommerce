import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api/products';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // changing this number runs the effect again, that is how retry works
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
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

    load();

    // if the component unmounts mid-request, don't set state on it
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  // returned from a reusable hook, so keep the reference stable for whoever uses it
  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { products, loading, error, refetch };
}
