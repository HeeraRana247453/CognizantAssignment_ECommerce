// Starting discounts so a fresh install already has some sale items to look at.
// After the first load everything lives in localStorage, and the admin can change it.
export const SEED_OVERRIDES = {
  1: { discount: 15 },
  5: { discount: 20 },
  12: { discount: 10 },
  21: { discount: 25 },
  33: { discount: 30 },
  47: { discount: 15 },
  62: { discount: 20 },
  78: { discount: 40 },
};

export function applyDiscount(price, percent) {
  const discounted = price * (1 - percent / 100);
  return Math.round(discounted * 100) / 100;
}

// Combines a product from the API (or one the admin created) with the admin's
// local changes for it: discount, stock, hidden, removed.
// The API sends its own discountPercentage, but we ignore it so the admin is in control.
export function buildProduct(raw, override = {}) {
  const discount = override.discount ?? 0;

  return {
    ...raw,
    discountPercentage: discount,
    finalPrice: applyDiscount(raw.price, discount),
    stock: override.stock ?? raw.stock,
    isActive: override.isActive ?? true,
    isRemoved: override.isRemoved ?? false,
    isCustom: Boolean(raw.isCustom),
  };
}

export function toSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Used when the admin doesn't give an image URL. It's an inline SVG, so no network needed.
export function makePlaceholderImage(label) {
  const first = (label.trim()[0] || '?').toUpperCase();
  const letter = /[A-Z0-9]/.test(first) ? first : '?';
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>` +
    `<rect width='600' height='600' fill='#e7e5e4'/>` +
    `<text x='50%' y='53%' font-family='Georgia, serif' font-size='240' fill='#a8a29e' ` +
    `text-anchor='middle' dominant-baseline='middle'>${letter}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
