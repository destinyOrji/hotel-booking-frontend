import { format, parseISO, differenceInDays } from 'date-fns';

// Format date to readable string
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Format date range
export const formatDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '';
  
  const checkInFormatted = formatDate(checkIn, 'MMM dd');
  const checkOutFormatted = formatDate(checkOut, 'MMM dd, yyyy');
  
  return `${checkInFormatted} - ${checkOutFormatted}`;
};

// Calculate number of nights
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  
  try {
    const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
    const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
    return differenceInDays(checkOutDate, checkInDate);
  } catch (error) {
    console.error('Error calculating nights:', error);
    return 0;
  }
};

// Format price with currency
export const formatPrice = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format price breakdown
export const formatPriceBreakdown = (pricing) => {
  const { basePrice, taxes, fees, discount = 0 } = pricing;
  const subtotal = basePrice + taxes + fees;
  const total = subtotal - discount;
  
  return {
    basePrice: formatPrice(basePrice),
    taxes: formatPrice(taxes),
    fees: formatPrice(fees),
    discount: formatPrice(discount),
    subtotal: formatPrice(subtotal),
    total: formatPrice(total),
  };
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};
