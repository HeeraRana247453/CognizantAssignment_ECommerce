const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 10 digit Indian mobile number, optionally with +91 / 91 in front
const PHONE_REGEX = /^(\+?91)?[6-9]\d{9}$/;

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
