// Mapping of amenity names to their icon images
const amenityIconMap = {
  // Image-based amenities (from public/images/Amenities/)
  'Swimming Pool': '/images/Amenities/Swimming_Pool.jpg',
  'Pool': '/images/Amenities/Swimming_Pool.jpg',
  'Outdoor Pool': '/images/Amenities/Swimming_Pool.jpg',
  'Indoor Pool': '/images/Amenities/Swimming_Pool.jpg',
  'Spa': '/images/Amenities/Spa_Wellness.jpg',
  'Spa & Wellness': '/images/Amenities/Spa_Wellness.jpg',
  'Spa and Wellness': '/images/Amenities/Spa_Wellness.jpg',
  'Wellness': '/images/Amenities/Spa_Wellness.jpg',
  'Wellness Center': '/images/Amenities/Spa_Wellness.jpg',
  'Massage': '/images/Amenities/Spa_Wellness.jpg',
  'Fine Dining': '/images/Amenities/FineDining.jpg',
  'Restaurant': '/images/Amenities/FineDining.jpg',
  'Dining': '/images/Amenities/FineDining.jpg',
  'On-site Restaurant': '/images/Amenities/FineDining.jpg',
  'Valet Parking': '/images/Amenities/Valet_Parking.jpg',
  'Parking': '/images/Amenities/Valet_Parking.jpg',
  'Free Parking': '/images/Amenities/Valet_Parking.jpg',
  'Car Park': '/images/Amenities/Valet_Parking.jpg',
  
  // Common amenities with emoji fallbacks
  'WiFi': '📶',
  'Wi-Fi': '📶',
  'Internet': '📶',
  'TV': '📺',
  'Television': '📺',
  'Air Conditioning': '❄️',
  'AC': '❄️',
  'Heating': '🔥',
  'Mini Bar': '🍷',
  'Minibar': '🍷',
  'Room Service': '🛎️',
  'Gym': '💪',
  'Fitness Center': '💪',
  'Fitness': '💪',
  'Breakfast': '🍳',
  'Coffee Maker': '☕',
  'Coffee': '☕',
  'Safe': '🔒',
  'Balcony': '🏖️',
  'Ocean View': '🌊',
  'Sea View': '🌊',
  'City View': '🏙️',
  'Mountain View': '⛰️',
  'Garden View': '🌳',
  'Bathtub': '🛁',
  'Shower': '🚿',
  'Hair Dryer': '💨',
  'Iron': '👔',
  'Laundry': '👕',
  'Desk': '🖥️',
  'Work Desk': '🖥️',
  'Sofa': '🛋️',
  'Seating Area': '🛋️',
  'Kitchenette': '🍽️',
  'Kitchen': '🍽️',
  'Microwave': '🍽️',
  'Refrigerator': '🧊',
  'Fridge': '🧊',
  'Telephone': '☎️',
  'Phone': '☎️',
  'Alarm Clock': '⏰',
  'Soundproof': '🔇',
  'Non-Smoking': '🚭',
  'Pet Friendly': '🐕',
  'Pets Allowed': '🐕',
  'Wheelchair Accessible': '♿',
  'Accessible': '♿',
  'Concierge': '🎩',
  'Butler Service': '🎩',
  'Housekeeping': '🧹',
  'Daily Cleaning': '🧹',
  'Towels': '🧴',
  'Toiletries': '🧴',
  'Slippers': '🥿',
  'Robe': '🥋',
  'Bathrobe': '🥋'
};

/**
 * Get the icon for an amenity
 * @param {string} amenityName - The name of the amenity
 * @returns {object} - Object with type ('image' or 'emoji') and value (path or emoji)
 */
export const getAmenityIcon = (amenityName) => {
  if (!amenityName) {
    return { type: 'emoji', value: '✓' };
  }

  // Normalize the amenity name for better matching
  const normalizedAmenity = amenityName.trim();
  
  // Check for exact match first (case insensitive)
  for (const [key, value] of Object.entries(amenityIconMap)) {
    if (key.toLowerCase() === normalizedAmenity.toLowerCase()) {
      if (value.startsWith('/')) {
        return { type: 'image', value };
      }
      return { type: 'emoji', value };
    }
  }

  // Check for partial match (case insensitive)
  const lowerAmenity = normalizedAmenity.toLowerCase();
  for (const [key, value] of Object.entries(amenityIconMap)) {
    const lowerKey = key.toLowerCase();
    if (lowerAmenity.includes(lowerKey) || lowerKey.includes(lowerAmenity)) {
      if (value.startsWith('/')) {
        return { type: 'image', value };
      }
      return { type: 'emoji', value };
    }
  }

  // Default fallback
  return { type: 'emoji', value: '✓' };
};

export default amenityIconMap;
