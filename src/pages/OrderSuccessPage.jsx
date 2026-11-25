import { Navigate, useLocation } from 'react-router-dom';

import { formatPrice } from '../utils/format';
import Button from '../components/Button';
import { CheckIcon } from '../components/Icons';

function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;

  // someone opened /order-success directly, there is no order to show
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <div className="mb-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
          Thank you, {order.customer.name}!
        </h1>
        <p className="mt-2 text-stone-500">
          Order #{order.id} is confirmed. A receipt will be sent to {order.customer.email}.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl items-start gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Delivery details</h2>
          <dl className="mt-4 flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-stone-500">Name</dt>
              <dd className="font-medium">{order.customer.name}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Phone</dt>
              <dd className="font-medium">{order.customer.phone}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Address</dt>
              <dd className="whitespace-pre-line font-medium">{order.customer.address}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>

          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">
                  {item.title} <span className="text-stone-400">&times; {item.quantity}</span>
                </span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-stone-200 pt-4 text-sm">
            {order.savings > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>You saved</span>
                <span>{formatPrice(order.savings)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Total paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <Button to="/" fullWidth className="mt-5">
            Continue shopping
          </Button>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccessPage;
