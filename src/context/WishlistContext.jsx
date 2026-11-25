import { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const WishlistContext = createContext(null);

// Only product ids are stored. Prices and discounts are looked up from the
// catalog when needed (see useWishlistProducts), so they never go stale.
export function WishlistProvider({ children }) {
  const [wishlistIdList, setWishlistIdList] = useLocalStorage('shopease-wishlist-ids', []);

  // one function for both add and remove, the heart button just toggles
  const toggleWishlist = useCallback(
    (id) => {
      setWishlistIdList((prev) =>
        prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
      );
    },
    [setWishlistIdList]
  );

  // a Set makes "is this product wishlisted?" a quick lookup for every card
  const wishlistIds = useMemo(() => new Set(wishlistIdList), [wishlistIdList]);

  const value = useMemo(
    () => ({ wishlistIds, toggleWishlist }),
    [wishlistIds, toggleWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
