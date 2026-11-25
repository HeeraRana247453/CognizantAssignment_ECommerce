import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary: 'rounded-xl bg-teal-700 text-white shadow-sm hover:bg-teal-800',
  outline: 'rounded-xl border border-stone-300 bg-white text-stone-800 hover:bg-stone-100',
  danger: 'rounded-xl bg-rose-600 text-white shadow-sm hover:bg-rose-700',
  link: 'rounded text-teal-700 hover:text-teal-900 hover:underline',
};

const sizes = {
  small: 'px-3 py-1.5 text-xs',
  medium: 'px-5 py-2.5 text-sm',
};

// One button for the whole app. Pass `to` and it renders a router Link
// with the same styling, so we don't need separate link-buttons.
// variants: primary (default), outline, danger, link
function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  to,
  type = 'button', // so a button inside a form doesn't submit by accident
  className = '',
  ...rest
}) {
  const classes = [
    base,
    variants[variant],
    // link buttons are plain text, they don't get padding
    variant !== 'link' && sizes[size],
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
