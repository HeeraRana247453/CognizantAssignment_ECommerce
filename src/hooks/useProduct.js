import { useState, useEffect, useCallback } from 'react';
import { getProductById } from '../api/products';

// fetches a single product by id (used by the details page)
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getProductById(id);
        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) {
          setProduct(null);
          setError(
            err.status === 404
              ? 'We could not find this product.'
              : 'Could not load this product. Please try again.'
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { product, loading, error, refetch };
}
