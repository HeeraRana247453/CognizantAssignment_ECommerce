import { useState } from 'react';

import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import Button from '../components/Button';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

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

  const [showClearModal, setShowClearModal] = useState(false);

  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add something from the product list and it will show up here."
        actionLabel="Browse products"
        actionTo="/"
      />
    );
  }

  function confirmClear() {
    handleClearCart();
    setShowClearModal(false);
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Your cart</h1>
        <Button variant="link" className="danger-text" onClick={() => setShowClearModal(true)}>
          Clear cart
        </Button>
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
          <Button to="/checkout" fullWidth>
            Go to checkout
          </Button>
        </aside>
      </div>

      <Modal
        isOpen={showClearModal}
        title="Clear your cart?"
        onClose={() => setShowClearModal(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowClearModal(false)}>
              Keep items
            </Button>
            <Button variant="danger" onClick={confirmClear}>
              Clear cart
            </Button>
          </>
        }
      >
        <p>This removes all {cartCount} items from your cart.</p>
      </Modal>
    </section>
  );
}

export default CartPage;
