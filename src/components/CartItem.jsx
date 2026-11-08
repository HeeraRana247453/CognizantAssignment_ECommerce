import { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <li className="cart-item">
      <img src={item.thumbnail} alt={item.title} className="cart-item-image" />

      <div className="cart-item-details">
        <Link to={`/products/${item.id}`} className="cart-item-title">
          {item.title}
        </Link>
        <span className="muted">{formatPrice(item.price)} each</span>
        <button className="link-button" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>

      <div className="quantity-control">
        <button onClick={() => onDecrease(item.id)} disabled={item.quantity === 1} aria-label="Decrease quantity">
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => onIncrease(item.id)} aria-label="Increase quantity">
          +
        </button>
      </div>

      <strong className="cart-item-total">{formatPrice(item.price * item.quantity)}</strong>
    </li>
  );
}

export default memo(CartItem);
