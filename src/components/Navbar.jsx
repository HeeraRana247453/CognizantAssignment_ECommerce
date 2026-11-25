import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlistProducts } from '../hooks/useWishlistProducts';
import Badge from './Badge';
import Button from './Button';
import { MenuIcon, CloseIcon } from './Icons';

function linkClass({ isActive }) {
  return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`;
}

function CountPill({ count }) {
  if (count === 0) return null;
  return (
    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-teal-600 px-1.5 text-[11px] font-bold text-white">
      {count}
    </span>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const wishlistProducts = useWishlistProducts();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate('/');
  }

  // the same links are used in the desktop bar and the mobile menu
  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={closeMenu}>
        Shop
      </NavLink>
      <NavLink to="/wishlist" className={linkClass} onClick={closeMenu}>
        Wishlist <CountPill count={wishlistProducts.length} />
      </NavLink>
      <NavLink to="/cart" className={linkClass} onClick={closeMenu}>
        Cart <CountPill count={cartCount} />
      </NavLink>
      {/* only admins ever see this link */}
      {isAdmin && (
        <NavLink to="/admin" className={linkClass} onClick={closeMenu}>
          Admin Panel
        </NavLink>
      )}
    </>
  );

  const account = isAuthenticated ? (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">
          {user.name.charAt(0)}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{user.name}</p>
          <Badge variant={isAdmin ? 'admin' : 'brand'} className="mt-0.5 px-2! py-0! text-[10px]! uppercase tracking-wide">
            {user.role}
          </Badge>
        </div>
      </div>
      <Button variant="outline" size="small" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  ) : (
    <Button to="/login" size="small" onClick={closeMenu}>
      Login
    </Button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
          ShopEase
        </Link>

        <nav className="hidden items-center gap-1 md:flex">{links}</nav>
        <div className="hidden md:block">{account}</div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-stone-700 hover:bg-stone-100 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">{links}</nav>
          <div className="mt-4 border-t border-stone-200 pt-4">{account}</div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
