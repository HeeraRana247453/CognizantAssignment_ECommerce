const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (!values.address.trim()) {
    errors.address = 'Please enter your delivery address.';
  } else if (values.address.trim().length < 10) {
    errors.address = 'Address looks too short. Add street, city and pin code.';
  }

  return errors;
}
