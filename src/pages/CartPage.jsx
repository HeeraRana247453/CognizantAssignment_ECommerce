import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import CartItem from '../components/CartItem';

function CartPage() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    handleIncrease,
    handleDecrease,
    handleRemoveFromCart,
    handleClearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="status-box">
        <h2>Your cart is empty</h2>
        <p>Add something from the product list and it will show up here.</p>
        <Link to="/" className="btn">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Your cart</h1>
        <button className="link-button" onClick={handleClearCart}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemoveFromCart}
            />
          ))}
        </ul>

        <aside className="summary-box">
          <h2>Summary</h2>
          <div className="summary-row">
            <span>Items ({cartCount})</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <Link to="/checkout" className="btn btn-full">
            Go to checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
