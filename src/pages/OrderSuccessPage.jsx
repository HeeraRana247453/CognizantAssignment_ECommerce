import { Navigate, useLocation } from 'react-router-dom';

import { formatPrice } from '../utils/format';
import Button from '../components/Button';

function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;

  // someone opened /order-success directly, there is no order to show
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <div className="success-heading">
        <h1>Thank you, {order.customer.name}!</h1>
        <p className="muted">
          Order #{order.id} is confirmed. A receipt will be sent to {order.customer.email}.
        </p>
      </div>

      <div className="cart-layout">
        <div className="panel">
          <h2>Delivery details</h2>
          <dl className="details-list">
            <dt>Name</dt>
            <dd>{order.customer.name}</dd>
            <dt>Phone</dt>
            <dd>{order.customer.phone}</dd>
            <dt>Address</dt>
            <dd>{order.customer.address}</dd>
          </dl>
        </div>

        <aside className="summary-box">
          <h2>Order summary</h2>

          <ul className="summary-items">
            {order.items.map((item) => (
              <li key={item.id} className="summary-row">
                <span>
                  {item.title} &times; {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="summary-row summary-total">
            <span>Total paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>

          <Button to="/" fullWidth>
            Continue shopping
          </Button>
        </aside>
      </div>
    </section>
  );
}

export default OrderSuccessPage;
