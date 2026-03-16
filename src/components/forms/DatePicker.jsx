import { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore } from 'date-fns'
import './DatePicker.css'

const DatePicker = ({ 
  name, 
  label, 
  error,
  placeholder = 'Select date',
  disabled = false,
  minDate,
  maxDate,
  onChange,
  value,
  isRange = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState(isRange && value?.start ? new Date(value.start) : null)
  const [endDate, setEndDate] = useState(isRange && value?.end ? new Date(value.end) : null)
  const [selectedDate, setSelectedDate] = useState(!isRange && value ? new Date(value) : null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const firstDayOfWeek = monthStart.getDay()
  const emptyDays = Array(firstDayOfWeek).fill(null)

  const handleDateClick = (day) => {
    if (isDisabled(day)) return

    if (isRange) {
      if (!startDate || (startDate && endDate)) {
        setStartDate(day)
        setEndDate(null)
        onChange && onChange({ start: day, end: null })
      } else if (startDate && !endDate) {
        if (isAfter(day, startDate)) {
          setEndDate(day)
          onChange && onChange({ start: startDate, end: day })
          setIsOpen(false)
        } else {
          setStartDate(day)
          setEndDate(null)
          onChange && onChange({ start: day, end: null })
        }
      }
    } else {
      setSelectedDate(day)
      onChange && onChange(day)
      setIsOpen(false)
    }
  }

  const isDisabled = (day) => {
    if (minDate && isBefore(day, minDate)) return true
    if (maxDate && isAfter(day, maxDate)) return true
    return false
  }

  const isSelected = (day) => {
    if (isRange) {
      if (startDate && isSameDay(day, startDate)) return true
      if (endDate && isSameDay(day, endDate)) return true
      return false
    }
    return selectedDate && isSameDay(day, selectedDate)
  }

  const isInRange = (day) => {
    if (!isRange || !startDate || !endDate) return false
    return isAfter(day, startDate) && isBefore(day, endDate)
  }

  const getDisplayValue = () => {
    if (isRange) {
      if (startDate && endDate) {
        return `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`
      }
      if (startDate) {
        return `${format(startDate, 'MMM dd, yyyy')} - ...`
      }
      return placeholder
    }
    return selectedDate ? format(selectedDate, 'MMM dd, yyyy') : placeholder
  }

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <div className="datepicker-wrapper">
        <input
          type="text"
          className={`input-field datepicker-input ${error ? 'input-error' : ''}`}
          value={getDisplayValue()}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          readOnly
          disabled={disabled}
          placeholder={placeholder}
        />
        {isOpen && (
          <div className="datepicker-dropdown">
            <div className="datepicker-header">
              <button
                type="button"
                className="datepicker-nav"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                ‹
              </button>
              <span className="datepicker-month">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                type="button"
                className="datepicker-nav"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                ›
              </button>
            </div>
            <div className="datepicker-calendar">
              <div className="datepicker-weekdays">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="datepicker-weekday">{day}</div>
                ))}
              </div>
              <div className="datepicker-days">
                {emptyDays.map((_, index) => (
                  <div key={`empty-${index}`} className="datepicker-day empty"></div>
                ))}
                {daysInMonth.map(day => (
                  <button
                    key={day.toString()}
                    type="button"
                    className={`datepicker-day ${isSelected(day) ? 'selected' : ''} ${isInRange(day) ? 'in-range' : ''} ${isDisabled(day) ? 'disabled' : ''} ${!isSameMonth(day, currentMonth) ? 'other-month' : ''}`}
                    onClick={() => handleDateClick(day)}
                    disabled={isDisabled(day)}
                  >
                    {format(day, 'd')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <span className="input-error-message" role="alert">
          {error.message || error}
        </span>
      )}
    </div>
  )
}

export default DatePicker
