import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import cartReducer, { ACTIONS } from '../reducers/cartReducer';

const CartContext = createContext(null);
const STORAGE_KEY = 'shopease-cart';

// used as the lazy initializer for useReducer so we read localStorage only once
function loadSavedCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Could not read saved cart', error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, [], loadSavedCart);

  // keep localStorage in sync so the cart survives a page refresh
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // These handlers are passed down to memoized children (ProductCard, CartItem).
  // dispatch never changes, so useCallback with [] gives us the same function
  // reference on every render and React.memo can actually skip re-renders.
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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}
