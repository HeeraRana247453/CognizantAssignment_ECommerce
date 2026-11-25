import { createContext, useCallback, useMemo } from 'react';

import { useFetchProducts } from '../hooks/useFetchProducts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { buildProduct, makePlaceholderImage, toSlug, SEED_OVERRIDES } from '../utils/catalog';

export const ProductsContext = createContext(null);

// The single source of truth for the catalog. Three sources are merged here:
//   1. products from the API (never modified)
//   2. products the admin created (localStorage)
//   3. the admin's changes per product: discount, stock, hidden, removed (localStorage)
// Every page reads the merged list, so one admin change shows up everywhere.
export function ProductsProvider({ children }) {
  const { products: apiProducts, loading, error, refetch } = useFetchProducts();
  const [customProducts, setCustomProducts] = useLocalStorage('shopease-custom-products', []);
  const [overrides, setOverrides] = useLocalStorage('shopease-product-overrides', SEED_OVERRIDES);

  // everything, including hidden and removed (the admin panel needs all of it)
  const products = useMemo(
    () => [...customProducts, ...apiProducts].map((raw) => buildProduct(raw, overrides[raw.id])),
    [apiProducts, customProducts, overrides]
  );

  // what customers are allowed to see
  const storeProducts = useMemo(
    () => products.filter((product) => product.isActive && !product.isRemoved),
    [products]
  );

  const getProductById = useCallback(
    (id) => products.find((product) => String(product.id) === String(id)),
    [products]
  );

  // small helper: merge some changes into one product's override
  const updateOverride = useCallback(
    (id, changes) => {
      setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...changes } }));
    },
    [setOverrides]
  );

  // changes = { discount, stock }
  const updateProduct = useCallback(
    (id, changes) => updateOverride(id, changes),
    [updateOverride]
  );

  const toggleActive = useCallback(
    (id) => {
      setOverrides((prev) => {
        const isActive = prev[id]?.isActive ?? true;
        return { ...prev, [id]: { ...prev[id], isActive: !isActive } };
      });
    },
    [setOverrides]
  );

  const removeProduct = useCallback((id) => updateOverride(id, { isRemoved: true }), [updateOverride]);
  const restoreProduct = useCallback((id) => updateOverride(id, { isRemoved: false }), [updateOverride]);

  // values come from the admin form (already validated, still strings)
  const addProduct = useCallback(
    (values) => {
      const nextId = Math.max(1000, ...customProducts.map((p) => p.id)) + 1;
      const title = values.title.trim();
      const thumbnail = values.imageUrl.trim() || makePlaceholderImage(title);

      const newProduct = {
        id: nextId,
        title,
        description: values.description.trim(),
        category: toSlug(values.category),
        price: Number(values.price),
        stock: Number(values.stock),
        thumbnail,
        images: [thumbnail],
        rating: null,
        isCustom: true,
      };

      setCustomProducts((prev) => [newProduct, ...prev]);
      setOverrides((prev) => ({ ...prev, [nextId]: { discount: Number(values.discount) } }));
      return newProduct;
    },
    [customProducts, setCustomProducts, setOverrides]
  );

  const resetCatalog = useCallback(() => {
    setCustomProducts([]);
    setOverrides(SEED_OVERRIDES);
  }, [setCustomProducts, setOverrides]);

  const value = useMemo(
    () => ({
      products,
      storeProducts,
      loading,
      error,
      refetch,
      isReady: !loading && !error,
      getProductById,
      addProduct,
      updateProduct,
      toggleActive,
      removeProduct,
      restoreProduct,
      resetCatalog,
    }),
    [
      products,
      storeProducts,
      loading,
      error,
      refetch,
      getProductById,
      addProduct,
      updateProduct,
      toggleActive,
      removeProduct,
      restoreProduct,
      resetCatalog,
    ]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
