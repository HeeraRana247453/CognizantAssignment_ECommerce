import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import { validateCheckoutForm } from '../utils/validation';
import Button from '../components/Button';
import Input from '../components/Input';

// This page is wrapped in <RequireCart> and <ProtectedRoute> in App.jsx,
// so there is always a logged in user and the cart is never empty here.
function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, cartSavings, handleClearCart } = useCart();

  // name and email are filled in from the account, the user can still change them
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: '',
    address: '',
  });
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
      savings: cartSavings,
    };

    navigate('/order-success', { replace: true, state: { order } });
    handleClearCart();
  }

  return (
    <section>
      <h1 className="mb-6 font-display text-3xl font-semibold">Checkout</h1>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold">Delivery details</h2>

          <div className="grid gap-5 sm:grid-cols-2">
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
          </div>

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
            Place order &middot; {formatPrice(cartTotal)}
          </Button>
        </form>

        <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>

          <ul className="mt-4 flex flex-col gap-3">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg bg-stone-100 object-contain p-1"
                />
                <span className="min-w-0 flex-1 truncate">
                  {item.title} <span className="text-stone-400">&times; {item.quantity}</span>
                </span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 border-t border-stone-200 pt-4 text-sm">
            {cartSavings > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>You saved</span>
                <span>{formatPrice(cartSavings)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-500">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
