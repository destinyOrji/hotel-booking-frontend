import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from './DatePicker'
import Select from './Select'
import Button from '../common/Button'
import { validateDateRange } from '../../utils/validators'
import { ROOM_TYPES } from '../../utils/constants'
import './SearchForm.css'

const SearchForm = ({ initialValues = {} }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    checkIn: initialValues.checkIn || null,
    checkOut: initialValues.checkOut || null,
    guests: initialValues.guests || 1,
    roomType: initialValues.roomType || ''
  })
  const [errors, setErrors] = useState({})

  const roomTypeOptions = [
    { value: '', label: 'All Room Types' },
    { value: ROOM_TYPES.SINGLE, label: 'Single Room' },
    { value: ROOM_TYPES.DOUBLE, label: 'Double Room' },
    { value: ROOM_TYPES.SUITE, label: 'Suite' },
    { value: ROOM_TYPES.DELUXE, label: 'Deluxe Room' },
    { value: ROOM_TYPES.FAMILY, label: 'Family Room' }
  ]

  const guestOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Guest${i > 0 ? 's' : ''}`
  }))

  const handleDateChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user updates the field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSelectChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate check-in date
    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required'
    }

    // Validate check-out date
    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required'
    }

    // Validate date range
    if (formData.checkIn && formData.checkOut) {
      const dateValidation = validateDateRange(formData.checkIn, formData.checkOut)
      if (!dateValidation.valid) {
        newErrors.checkOut = dateValidation.error
      }
    }

    // Validate guests
    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = 'Please select number of guests'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Navigate to room listing page with search params
    const searchParams = new URLSearchParams({
      checkIn: formData.checkIn.toISOString(),
      checkOut: formData.checkOut.toISOString(),
      guests: formData.guests.toString(),
      ...(formData.roomType && { roomType: formData.roomType })
    })

    navigate(`/rooms?${searchParams.toString()}`)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form-grid">
        <DatePicker
          name="checkIn"
          label="Check-in"
          placeholder="Select check-in date"
          value={formData.checkIn}
          onChange={handleDateChange('checkIn')}
          minDate={today}
          error={errors.checkIn}
        />

        <DatePicker
          name="checkOut"
          label="Check-out"
          placeholder="Select check-out date"
          value={formData.checkOut}
          onChange={handleDateChange('checkOut')}
          minDate={formData.checkIn || today}
          error={errors.checkOut}
        />

        <Select
          name="guests"
          label="Guests"
          options={guestOptions}
          value={formData.guests}
          onChange={handleSelectChange('guests')}
          placeholder="Select guests"
          error={errors.guests}
        />

        <Select
          name="roomType"
          label="Room Type"
          options={roomTypeOptions}
          value={formData.roomType}
          onChange={handleSelectChange('roomType')}
          placeholder="All Room Types"
        />
      </div>

      <div className="search-form-actions">
        <Button type="submit" variant="primary" size="large">
          Search Rooms
        </Button>
      </div>
    </form>
  )
}

export default SearchForm
