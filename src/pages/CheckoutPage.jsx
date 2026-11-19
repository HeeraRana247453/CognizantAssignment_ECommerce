import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import { validateCheckoutForm } from '../utils/validation';
import Button from '../components/Button';
import Input from '../components/Input';

const emptyForm = { name: '', email: '', phone: '', address: '' };

// This page is wrapped in <RequireCart> in App.jsx, so cartItems is never empty here
function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, handleClearCart } = useCart();

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

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

    // No backend, so the order only lives in router state. We take a copy of the
    // items here because the cart is about to be emptied.
    const order = {
      id: Math.floor(100000 + Math.random() * 900000),
      customer: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      },
      items: cartItems,
      total: cartTotal,
    };

    navigate('/order-success', { replace: true, state: { order } });
    handleClearCart();
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Checkout</h1>
      </div>

      <div className="cart-layout">
        <form className="panel" onSubmit={handleSubmit} noValidate>
          <Input
            id="name"
            name="name"
            label="Full name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone"
            autoComplete="tel"
            placeholder="10 digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <Input
            id="address"
            name="address"
            label="Delivery address"
            multiline
            rows="4"
            autoComplete="street-address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />

          <Button type="submit" fullWidth>
            Place order
          </Button>
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

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
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
