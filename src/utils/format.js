export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// "mens-shirts" -> "Mens shirts"
export function formatCategory(slug) {
  if (!slug || slug === 'all') return 'All categories';
  const text = slug.replace(/-/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
