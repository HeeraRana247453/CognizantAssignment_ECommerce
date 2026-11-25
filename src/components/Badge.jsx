const styles = {
  neutral: 'bg-stone-100 text-stone-700',
  brand: 'bg-teal-100 text-teal-800',
  sale: 'bg-rose-600 text-white',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-700',
  admin: 'bg-amber-100 text-amber-900',
};

function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
