import { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';

import cartReducer, { ACTIONS } from '../reducers/cartReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  // useLocalStorage reads the saved cart on load and writes it back on every change
  const [savedCart, setSavedCart] = useLocalStorage('shopease-cart', []);

  // the reducer starts from whatever was saved, then owns all cart updates
  const [cartItems, dispatch] = useReducer(cartReducer, savedCart);

  // push every cart change into localStorage
  useEffect(() => {
    setSavedCart(cartItems);
  }, [cartItems, setSavedCart]);

  // These handlers go down to memoized children (ProductCard, CartItem).
  // dispatch never changes, so useCallback with [] keeps the same function
  // reference between renders and React.memo can actually skip re-renders.
  const handleAddToCart = useCallback((product) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
  }, []);

  const handleRemoveFromCart = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: id });
  }, []);

  const handleIncrease = useCallback((id) => {
    dispatch({ type: ACTIONS.INCREASE_QUANTITY, payload: id });
  }, []);

  const handleDecrease = useCallback((id) => {
    dispatch({ type: ACTIONS.DECREASE_QUANTITY, payload: id });
  }, []);

  const handleClearCart = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // memoized so consumers only re-render when something inside really changed
  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      handleAddToCart,
      handleRemoveFromCart,
      handleIncrease,
      handleDecrease,
      handleClearCart,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      handleAddToCart,
      handleRemoveFromCart,
      handleIncrease,
      handleDecrease,
      handleClearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
