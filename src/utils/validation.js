const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 10 digit Indian mobile number, optionally with +91 / 91 in front
const PHONE_REGEX = /^(\+?91)?[6-9]\d{9}$/;

export const MAX_DISCOUNT = 90;

export function validateLoginForm(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = 'Please enter your email.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'That email address does not look right.';
  }

  if (!values.password) {
    errors.password = 'Please enter your password.';
  }

  return errors;
}

export function validateCheckoutForm(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'That email address does not look right.';
  }

  // people type spaces and dashes in phone numbers, ignore those
  const phone = values.phone.replace(/[\s-]/g, '');
  if (!phone) {
    errors.phone = 'Please enter your phone number.';
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = 'Enter a valid 10 digit mobile number.';
  }

  if (!values.address.trim()) {
    errors.address = 'Please enter your delivery address.';
  } else if (values.address.trim().length < 10) {
    errors.address = 'Address looks too short. Add street, city and pin code.';
  }

  return errors;
}

// small helpers shared by the two admin forms
function checkDiscount(value) {
  if (String(value).trim() === '') return 'Enter a discount, use 0 for none.';
  const number = Number(value);
  if (!Number.isInteger(number)) return 'Discount must be a whole number.';
  if (number < 0 || number > MAX_DISCOUNT) return `Discount must be between 0 and ${MAX_DISCOUNT}.`;
  return '';
}

function checkStock(value) {
  if (String(value).trim() === '') return 'Enter the stock quantity.';
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) return 'Stock must be a whole number, 0 or more.';
  if (number > 10000) return 'Stock looks too high (max 10,000).';
  return '';
}

export function validateProductForm(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Please enter a product name.';
  } else if (values.title.trim().length < 3) {
    errors.title = 'Name must be at least 3 characters.';
  }

  if (values.price.trim() === '') {
    errors.price = 'Please enter a price.';
  } else if (Number.isNaN(Number(values.price)) || Number(values.price) <= 0) {
    errors.price = 'Price must be more than 0.';
  } else if (Number(values.price) > 1000000) {
    errors.price = 'Price looks too high.';
  }

  if (!values.category.trim()) {
    errors.category = 'Please choose or type a category.';
  } else if (values.category.trim().length < 2) {
    errors.category = 'Category is too short.';
  }

  const discountError = checkDiscount(values.discount);
  if (discountError) errors.discount = discountError;

  const stockError = checkStock(values.stock);
  if (stockError) errors.stock = stockError;

  if (!values.description.trim()) {
    errors.description = 'Please add a short description.';
  } else if (values.description.trim().length < 10) {
    errors.description = 'Description should be at least 10 characters.';
  }

  // image is optional, but if it's filled in it has to be a real http(s) link
  if (values.imageUrl.trim()) {
    try {
      const url = new URL(values.imageUrl.trim());
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        errors.imageUrl = 'Image URL must start with http:// or https://';
      }
    } catch (err) {
      errors.imageUrl = 'That does not look like a valid URL.';
    }
  }

  return errors;
}

export function validateEditProductForm(values) {
  const errors = {};

  const discountError = checkDiscount(values.discount);
  if (discountError) errors.discount = discountError;

  const stockError = checkStock(values.stock);
  if (stockError) errors.stock = stockError;

  return errors;
}
