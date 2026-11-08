import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { validateCheckoutForm } from '../utils/validation';

const emptyForm = { name: '', email: '', address: '' };

function CheckoutPage() {
  const { cartItems, cartTotal, handleClearCart } = useCart();

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [placedOrder, setPlacedOrder] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear the error for a field as soon as the user starts fixing it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateCheckoutForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    // no real backend here, so we just keep the order in state and empty the cart
    setPlacedOrder({
      customer: formData.name.trim(),
      email: formData.email.trim(),
      total: cartTotal,
      orderId: Math.floor(100000 + Math.random() * 900000),
    });
    handleClearCart();
  }

  if (placedOrder) {
    return (
      <div className="status-box">
        <h2>Thank you, {placedOrder.customer}!</h2>
        <p>
          Order #{placedOrder.orderId} for {formatPrice(placedOrder.total)} is confirmed.
          A receipt will be sent to {placedOrder.email}.
        </p>
        <Link to="/" className="btn">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="status-box">
        <h2>Nothing to check out</h2>
        <p>Your cart is empty.</p>
        <Link to="/" className="btn">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Checkout</h1>
      </div>

      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              className={errors.name ? 'input input-error' : 'input'}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={errors.email ? 'input input-error' : 'input'}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery address</label>
            <textarea
              id="address"
              name="address"
              rows="4"
              className={errors.address ? 'input input-error' : 'input'}
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <button type="submit" className="btn btn-full">
            Place order
          </button>
        </form>

        <aside className="summary-box">
          <h2>Order summary</h2>

          <ul className="summary-items">
            {cartItems.map((item) => (
              <li key={item.id} className="summary-row">
                <span>
                  {item.title} &times; {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
