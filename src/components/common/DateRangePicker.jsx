import { useState } from 'react'
import './DateRangePicker.css'

const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  minDate,
  maxDate,
  label = 'Date Range',
  error,
  disabled = false,
  className = ''
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate || '')
  const [localEndDate, setLocalEndDate] = useState(endDate || '')
  const [validationError, setValidationError] = useState('')

  const formatDateForInput = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const validateDateRange = (start, end) => {
    if (!start || !end) {
      setValidationError('')
      return true
    }

    const startDateObj = new Date(start)
    const endDateObj = new Date(end)

    if (startDateObj > endDateObj) {
      setValidationError('End date must be after start date')
      return false
    }

    if (minDate && startDateObj < new Date(minDate)) {
      setValidationError('Start date cannot be before minimum date')
      return false
    }

    if (maxDate && endDateObj > new Date(maxDate)) {
      setValidationError('End date cannot be after maximum date')
      return false
    }

    setValidationError('')
    return true
  }

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value
    setLocalStartDate(newStartDate)
    
    if (validateDateRange(newStartDate, localEndDate)) {
      onStartDateChange?.(newStartDate)
    }
  }

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value
    setLocalEndDate(newEndDate)
    
    if (validateDateRange(localStartDate, newEndDate)) {
      onEndDateChange?.(newEndDate)
    }
  }

  const displayError = error || validationError

  return (
    <div className={`date-range-picker ${className}`}>
      {label && <label className="date-range-label">{label}</label>}
      <div className="date-range-inputs">
        <div className="date-input-wrapper">
          <label htmlFor="start-date" className="date-input-label">
            From
          </label>
          <input
            id="start-date"
            type="date"
            value={formatDateForInput(localStartDate)}
            onChange={handleStartDateChange}
            min={minDate ? formatDateForInput(minDate) : undefined}
            max={maxDate ? formatDateForInput(maxDate) : undefined}
            disabled={disabled}
            className={`date-input ${displayError ? 'date-input-error' : ''}`}
            aria-label="Start date"
            aria-invalid={!!displayError}
            aria-describedby={displayError ? 'date-range-error' : undefined}
          />
        </div>
        <span className="date-range-separator">to</span>
        <div className="date-input-wrapper">
          <label htmlFor="end-date" className="date-input-label">
            To
          </label>
          <input
            id="end-date"
            type="date"
            value={formatDateForInput(localEndDate)}
            onChange={handleEndDateChange}
            min={localStartDate || (minDate ? formatDateForInput(minDate) : undefined)}
            max={maxDate ? formatDateForInput(maxDate) : undefined}
            disabled={disabled}
            className={`date-input ${displayError ? 'date-input-error' : ''}`}
            aria-label="End date"
            aria-invalid={!!displayError}
            aria-describedby={displayError ? 'date-range-error' : undefined}
          />
        </div>
      </div>
      {displayError && (
        <div id="date-range-error" className="date-range-error" role="alert">
          {displayError}
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
