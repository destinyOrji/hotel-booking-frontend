import { useState, useEffect } from 'react'
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns'
import roomService from '../../services/roomService'
import Loader from '../common/Loader'
import './AvailabilityCalendar.css'

const AvailabilityCalendar = ({ roomId, onDateSelect, initialDates = {} }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedCheckIn, setSelectedCheckIn] = useState(
    initialDates.checkIn ? new Date(initialDates.checkIn) : null
  )
  const [selectedCheckOut, setSelectedCheckOut] = useState(
    initialDates.checkOut ? new Date(initialDates.checkOut) : null
  )
  const [availableDates, setAvailableDates] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [roomId, currentMonth])

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const startDate = startOfMonth(currentMonth)
      const endDate = endOfMonth(addMonths(currentMonth, 2))

      const result = await roomService.getRoomAvailability(roomId, {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      })

      if (result.success) {
        setAvailableDates(result.data.availableDates || [])
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (date) => {
    const today = startOfDay(new Date())
    if (isBefore(date, today)) {
      return
    }

    if (!isDateAvailable(date)) {
      return
    }

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(date)
      setSelectedCheckOut(null)
      onDateSelect?.({ checkIn: format(date, 'yyyy-MM-dd'), checkOut: null })
    } else if (selectedCheckIn && !selectedCheckOut) {
      if (isAfter(date, selectedCheckIn)) {
        setSelectedCheckOut(date)
        onDateSelect?.({
          checkIn: format(selectedCheckIn, 'yyyy-MM-dd'),
          checkOut: format(date, 'yyyy-MM-dd')
        })
      } else {
        setSelectedCheckIn(date)
        setSelectedCheckOut(null)
        onDateSelect?.({ checkIn: format(date, 'yyyy-MM-dd'), checkOut: null })
      }
    }
  }

  const isDateAvailable = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return availableDates.includes(dateStr)
  }

  const isDateInRange = (date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false
    return isAfter(date, selectedCheckIn) && isBefore(date, selectedCheckOut)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const renderMonth = (monthDate) => {
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const firstDayOfWeek = monthStart.getDay()
    const emptyDays = Array(firstDayOfWeek).fill(null)

    const today = startOfDay(new Date())

    return (
      <div className="calendar-month" key={monthDate.toString()}>
        <div className="calendar-month-header">
          <h3 className="calendar-month-title">
            {format(monthDate, 'MMMM yyyy')}
          </h3>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="calendar-day empty" />
            ))}

            {days.map(day => {
              const isPast = isBefore(day, today)
              const isAvailable = isDateAvailable(day)
              const isCheckIn = selectedCheckIn && isSameDay(day, selectedCheckIn)
              const isCheckOut = selectedCheckOut && isSameDay(day, selectedCheckOut)
              const isInRange = isDateInRange(day)
              const isDisabled = isPast || !isAvailable

              return (
                <button
                  key={day.toString()}
                  className={`calendar-day ${isCheckIn ? 'check-in' : ''} ${isCheckOut ? 'check-out' : ''} ${isInRange ? 'in-range' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabled}
                  aria-label={format(day, 'MMMM d, yyyy')}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="availability-calendar">
      <div className="calendar-controls">
        <button
          className="calendar-nav-button"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <button
          className="calendar-nav-button"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="calendar-months">
          {renderMonth(currentMonth)}
          {renderMonth(addMonths(currentMonth, 1))}
          {renderMonth(addMonths(currentMonth, 2))}
        </div>
      )}

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unavailable"></span>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  )
}

export default AvailabilityCalendar
