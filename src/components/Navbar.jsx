import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          ShopEase
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>
            Products
          </NavLink>
          <NavLink to="/wishlist">
            Wishlist
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </NavLink>
          <NavLink to="/cart">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
