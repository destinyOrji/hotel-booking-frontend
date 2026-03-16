import { createContext, useContext, useState, useCallback } from 'react'

const BookingContext = createContext(null)

export const BookingProvider = ({ children }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    checkIn: null,
    checkOut: null,
    adults: 2,
    children: 0,
    roomType: ''
  })

  const [selectedRoom, setSelectedRoom] = useState(null)

  const [bookingDetails, setBookingDetails] = useState({
    guestInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: ''
    },
    promoCode: '',
    discount: 0
  })

  const updateSearchCriteria = useCallback((criteria) => {
    setSearchCriteria(prev => ({ ...prev, ...criteria }))
  }, [])

  const updateBookingDetails = useCallback((details) => {
    setBookingDetails(prev => ({ ...prev, ...details }))
  }, [])

  const updateGuestInfo = useCallback((guestInfo) => {
    setBookingDetails(prev => ({
      ...prev,
      guestInfo: { ...prev.guestInfo, ...guestInfo }
    }))
  }, [])

  const applyPromoCode = useCallback((code, discount) => {
    setBookingDetails(prev => ({
      ...prev,
      promoCode: code,
      discount
    }))
  }, [])

  const clearBooking = useCallback(() => {
    setSelectedRoom(null)
    setBookingDetails({
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: ''
      },
      promoCode: '',
      discount: 0
    })
  }, [])

  const calculateTotalPrice = useCallback(() => {
    if (!selectedRoom || !searchCriteria.checkIn || !searchCriteria.checkOut) {
      return 0
    }

    const checkIn = new Date(searchCriteria.checkIn)
    const checkOut = new Date(searchCriteria.checkOut)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

    const subtotal = selectedRoom.basePrice * nights
    const discountAmount = (subtotal * bookingDetails.discount) / 100
    const total = subtotal - discountAmount

    return {
      nights,
      subtotal,
      discountAmount,
      total
    }
  }, [selectedRoom, searchCriteria, bookingDetails.discount])

  const value = {
    searchCriteria,
    selectedRoom,
    bookingDetails,
    updateSearchCriteria,
    setSelectedRoom,
    updateBookingDetails,
    updateGuestInfo,
    applyPromoCode,
    clearBooking,
    calculateTotalPrice
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export default BookingContext
