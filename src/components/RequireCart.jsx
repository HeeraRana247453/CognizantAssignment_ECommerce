import { Navigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

// Route guard: wrap a page in this and it only opens when the cart has items
function RequireCart({ children }) {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return children;
}

export default RequireCart;
