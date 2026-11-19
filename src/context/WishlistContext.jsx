import { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useLocalStorage('shopease-wishlist', []);

  // one function for both add and remove, the heart button just toggles
  const toggleWishlist = useCallback(
    (product) => {
      setWishlistItems((prev) => {
        const alreadySaved = prev.some((item) => item.id === product.id);

        if (alreadySaved) {
          return prev.filter((item) => item.id !== product.id);
        }

        // keep only the fields a product card needs
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            category: product.category,
          },
        ];
      });
    },
    [setWishlistItems]
  );

  // a Set makes "is this product wishlisted?" a quick lookup for every card
  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item.id)),
    [wishlistItems]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistIds,
      wishlistCount: wishlistItems.length,
      toggleWishlist,
    }),
    [wishlistItems, wishlistIds, toggleWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
