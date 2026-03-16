import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns'
import { BOOKING_STATUS } from '../../utils/constants'
import './CalendarView.css'

const CalendarView = ({ bookings = [], onDateClick, onBookingClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const firstDayOfWeek = monthStart.getDay()
  const emptyDays = Array(firstDayOfWeek).fill(null)

  const getBookingsForDay = (day) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      return day >= checkIn && day <= checkOut
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return 'status-confirmed'
      case BOOKING_STATUS.CHECKED_IN:
        return 'status-checked-in'
      case BOOKING_STATUS.CHECKED_OUT:
        return 'status-checked-out'
      case BOOKING_STATUS.CANCELLED:
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button
          className="calendar-nav-btn"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="calendar-month">{format(currentMonth, 'MMMM yyyy')}</h3>
        <button
          className="calendar-nav-btn"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day empty"></div>
          ))}
          
          {daysInMonth.map(day => {
            const dayBookings = getBookingsForDay(day)
            const isToday = isSameDay(day, new Date())
            
            return (
              <div
                key={day.toString()}
                className={`calendar-day ${!isSameMonth(day, currentMonth) ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => onDateClick && onDateClick(day)}
              >
                <div className="calendar-day-number">{format(day, 'd')}</div>
                <div className="calendar-day-bookings">
                  {dayBookings.slice(0, 3).map(booking => (
                    <div
                      key={booking.id}
                      className={`calendar-booking ${getStatusColor(booking.status)}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onBookingClick && onBookingClick(booking)
                      }}
                      title={`${booking.guestInfo.name} - ${booking.roomName || 'Room'}`}
                    >
                      <span className="booking-guest">{booking.guestInfo.name}</span>
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div className="calendar-booking-more">
                      +{dayBookings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color status-pending"></span>
          <span>Pending</span>
        </div>
        <div className="legend-item">
          <span className="legend-color status-confirmed"></span>
          <span>Confirmed</span>
        </div>
        <div className="legend-item">
          <span className="legend-color status-checked-in"></span>
          <span>Checked In</span>
        </div>
        <div className="legend-item">
          <span className="legend-color status-checked-out"></span>
          <span>Checked Out</span>
        </div>
        <div className="legend-item">
          <span className="legend-color status-cancelled"></span>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
