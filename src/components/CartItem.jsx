import { memo } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';
import { formatPrice } from '../utils/format';

// memo here means changing the quantity of one item doesn't re-render the others
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <li className="cart-item">
      <img src={item.thumbnail} alt={item.title} className="cart-item-image" />

      <div className="cart-item-details">
        <Link to={`/products/${item.id}`} className="cart-item-title">
          {item.title}
        </Link>
        <span className="muted">{formatPrice(item.price)} each</span>
        <Button variant="link" className="danger-text" onClick={() => onRemove(item.id)}>
          Remove
        </Button>
      </div>

      <div className="quantity-control">
        <button
          type="button"
          onClick={() => onDecrease(item.id)}
          disabled={item.quantity === 1}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => onIncrease(item.id)} aria-label="Increase quantity">
          +
        </button>
      </div>

      <strong className="cart-item-total">{formatPrice(item.price * item.quantity)}</strong>
    </li>
  );
}

export default memo(CartItem);
