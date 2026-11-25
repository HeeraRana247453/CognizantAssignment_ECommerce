import { useMemo } from 'react';
import { useProducts } from './useProducts';
import { useWishlist } from './useWishlist';

// The wishlist only stores product ids. This turns them into live products,
// so prices and discounts are always current and hidden products drop out.
export function useWishlistProducts() {
  const { storeProducts } = useProducts();
  const { wishlistIds } = useWishlist();

  return useMemo(
    () => storeProducts.filter((product) => wishlistIds.has(product.id)),
    [storeProducts, wishlistIds]
  );
}
