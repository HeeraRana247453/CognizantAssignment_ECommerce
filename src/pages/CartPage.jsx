import { useState } from 'react';

import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import Button from '../components/Button';
import CartItem from '../components/CartItem';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';

function CartPage() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    cartSavings,
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
        message="Add something from the shop and it will show up here."
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
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-semibold">Your cart</h1>
        <Button
          variant="link"
          className="text-sm text-rose-600 hover:text-rose-800"
          onClick={() => setShowClearModal(true)}
        >
          Clear cart
        </Button>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
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

        <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Summary</h2>

          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Items ({cartCount})</span>
              <span>{formatPrice(cartTotal + cartSavings)}</span>
            </div>
            {cartSavings > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discounts</span>
                <span>-{formatPrice(cartSavings)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-500">Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <Button to="/checkout" fullWidth className="mt-5">
            Go to checkout
          </Button>
        </aside>
      </div>

      <ConfirmModal
        isOpen={showClearModal}
        title="Clear your cart?"
        message={`This removes all ${cartCount} items from your cart.`}
        confirmLabel="Clear cart"
        cancelLabel="Keep items"
        danger
        onConfirm={confirmClear}
        onCancel={() => setShowClearModal(false)}
      />
    </section>
  );
}

export default CartPage;
