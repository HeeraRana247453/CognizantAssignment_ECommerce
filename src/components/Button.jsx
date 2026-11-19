import { Link } from 'react-router-dom';

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
    variant === 'link' ? 'link-button' : `btn btn-${variant}`,
    size === 'small' && 'btn-small',
    fullWidth && 'btn-full',
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
