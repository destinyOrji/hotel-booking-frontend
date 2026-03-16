// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (supports various formats)
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Password validation (minimum 8 characters)
export const validatePassword = (password) => {
  return password && password.length >= 8;
};

// Date range validation
export const validateDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return { valid: false, error: 'Both check-in and check-out dates are required' };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return { valid: false, error: 'Check-in date cannot be in the past' };
  }

  if (checkOutDate <= checkInDate) {
    return { valid: false, error: 'Check-out date must be after check-in date' };
  }

  return { valid: true };
};

// Form field validators for React Hook Form
export const formValidators = {
  email: {
    required: 'Email is required',
    validate: (value) => validateEmail(value) || 'Invalid email format',
  },
  phone: {
    required: 'Phone number is required',
    validate: (value) => validatePhone(value) || 'Invalid phone number format',
  },
  password: {
    required: 'Password is required',
    validate: (value) => validatePassword(value) || 'Password must be at least 8 characters',
  },
  required: (fieldName) => ({
    required: `${fieldName} is required`,
  }),
};
