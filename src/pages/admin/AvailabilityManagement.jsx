import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isSameMonth, isWithinInterval, parseISO } from 'date-fns'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import Input from '../../components/forms/Input'
import Textarea from '../../components/forms/Textarea'
import roomService from '../../services/roomService'
import availabilityService from '../../services/availabilityService'
import { formatPrice } from '../../utils/formatters'
import './AvailabilityManagement.css'

const AvailabilityManagement = () => {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Availability data
  const [availabilityData, setAvailabilityData] = useState(null)
  const [blockedDates, setBlockedDates] = useState([])
  const [bookings, setBookings] = useState([])
  
  // Selection state
  const [selectedDates, setSelectedDates] = useState([])
  const [selectionMode, setSelectionMode] = useState(null) // 'block'
  
  // Modals
  const [blockModal, setBlockModal] = useState(false)
  
  // Form data
  const [blockFormData, setBlockFormData] = useState({ reason: '' })

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      fetchAvailabilityData()
    }
  }, [selectedRoom, currentMonth])

  const fetchRooms = async () => {
    setLoading(true)
    const result = await roomService.getRooms()
    
    if (result.success) {
      setRooms(result.data)
      if (result.data.length > 0) {
        setSelectedRoom(result.data[0].id)
      }
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const fetchAvailabilityData = async () => {
    if (!selectedRoom) return
    
    const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
    const endDate = format(endOfMonth(addMonths(currentMonth, 2)), 'yyyy-MM-dd')
    
    const result = await availabilityService.getAvailability(startDate, endDate)
    
    if (result.success) {
      // Find data for the selected room
      const roomData = result.data.find(r => r.room.id === selectedRoom)
      
      if (roomData) {
        setAvailabilityData(roomData)
        setBlockedDates(roomData.blocks || [])
        setBookings(roomData.bookings || [])
      } else {
        setAvailabilityData(null)
        setBlockedDates([])
        setBookings([])
      }
    } else {
      setError(result.error)
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const firstDayOfWeek = monthStart.getDay()
  const emptyDays = Array(firstDayOfWeek).fill(null)

  const isDateBlocked = (day) => {
    return blockedDates.some(block => {
      const start = parseISO(block.startDate)
      const end = parseISO(block.endDate)
      return isWithinInterval(day, { start, end })
    })
  }

  const isDateBooked = (day) => {
    return bookings.some(booking => {
      const checkIn = parseISO(booking.checkIn)
      const checkOut = parseISO(booking.checkOut)
      return isWithinInterval(day, { start: checkIn, end: checkOut })
    })
  }

  const isDateSelected = (day) => {
    return selectedDates.some(date => isSameDay(date, day))
  }

  const handleDayClick = (day) => {
    if (!selectionMode) return
    
    const isSelected = isDateSelected(day)
    if (isSelected) {
      setSelectedDates(selectedDates.filter(date => !isSameDay(date, day)))
    } else {
      setSelectedDates([...selectedDates, day])
    }
  }

  const handleBlockDates = () => {
    if (selectedDates.length === 0) {
      setError('Please select dates to block')
      return
    }
    setBlockModal(true)
  }

  const confirmBlockDates = async () => {
    if (selectedDates.length === 0 || !blockFormData.reason.trim()) {
      setError('Please provide a reason for blocking')
      return
    }
    
    const sortedDates = [...selectedDates].sort((a, b) => a - b)
    const result = await availabilityService.blockRoom({
      roomId: selectedRoom,
      startDate: format(sortedDates[0], 'yyyy-MM-dd'),
      endDate: format(sortedDates[sortedDates.length - 1], 'yyyy-MM-dd'),
      reason: blockFormData.reason
    })
    
    if (result.success) {
      setSuccess('Dates blocked successfully')
      setBlockModal(false)
      setSelectedDates([])
      setSelectionMode(null)
      setBlockFormData({ reason: '' })
      fetchAvailabilityData()
    } else {
      setError(result.error)
    }
  }

  const handleUnblockDates = async (blockId) => {
    const result = await availabilityService.unblockRoom(blockId)
    
    if (result.success) {
      setSuccess('Dates unblocked successfully')
      fetchAvailabilityData()
    } else {
      setError(result.error)
    }
  }

  const startSelection = (mode) => {
    setSelectionMode(mode)
    setSelectedDates([])
  }

  const cancelSelection = () => {
    setSelectionMode(null)
    setSelectedDates([])
  }

  const selectedRoomData = rooms.find(r => r.id === selectedRoom)

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="availability-management">
      <div className="page-header">
        <div>
          <h1>Availability Management</h1>
          <p className="page-description">Manage room availability and block dates for maintenance or special events</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      <div className="availability-controls">
        <div className="room-selector">
          <label htmlFor="room-select">Select Room:</label>
          <select
            id="room-select"
            value={selectedRoom || ''}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="room-select"
          >
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} - {room.type}
              </option>
            ))}
          </select>
          {selectedRoomData && (
            <span className="room-base-price">
              Base Price: {formatPrice(selectedRoomData.basePrice)}
            </span>
          )}
        </div>

        {!selectionMode ? (
          <div className="action-buttons">
            <Button variant="primary" onClick={() => startSelection('block')}>
              Block Dates
            </Button>
          </div>
        ) : (
          <div className="selection-actions">
            <span className="selection-info">
              {selectedDates.length} date(s) selected
            </span>
            <Button
              variant="primary"
              onClick={handleBlockDates}
              disabled={selectedDates.length === 0}
            >
              Block Selected
            </Button>
            <Button variant="outline" onClick={cancelSelection}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="availability-calendar">
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
              const isBlocked = isDateBlocked(day)
              const isBooked = isDateBooked(day)
              const isSelected = isDateSelected(day)
              const isToday = isSameDay(day, new Date())
              
              return (
                <div
                  key={day.toString()}
                  className={`calendar-day ${!isSameMonth(day, currentMonth) ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isBlocked ? 'blocked' : ''} ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''} ${selectionMode ? 'selectable' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="calendar-day-number">{format(day, 'd')}</div>
                  <div className="calendar-day-info">
                    {isBlocked && <span className="day-badge blocked-badge">Blocked</span>}
                    {isBooked && !isBlocked && <span className="day-badge booked-badge">Booked</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color blocked-color"></span>
            <span>Blocked</span>
          </div>
          <div className="legend-item">
            <span className="legend-color booked-color"></span>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <span className="legend-color selected-color"></span>
            <span>Selected</span>
          </div>
        </div>
      </div>

      <div className="availability-lists">
        <div className="list-section">
          <h3>Blocked Dates</h3>
          {blockedDates.length === 0 ? (
            <p className="empty-message">No blocked dates</p>
          ) : (
            <ul className="availability-list">
              {blockedDates.map((block) => (
                <li key={block.id} className="availability-item">
                  <div className="block-info">
                    <div className="block-dates">
                      {format(parseISO(block.startDate), 'MMM dd, yyyy')} - {format(parseISO(block.endDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="block-reason">
                      <strong>Reason:</strong> {block.reason}
                    </div>
                    {block.createdBy && (
                      <div className="block-creator">
                        <small>Blocked by: {block.createdBy.name || block.createdBy.email}</small>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleUnblockDates(block.id)}
                  >
                    Unblock
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Block Dates Modal */}
      <Modal
        isOpen={blockModal}
        onClose={() => setBlockModal(false)}
        title="Block Dates"
      >
        <div className="modal-content-body">
          <p>Block the following dates for {selectedRoomData?.name}?</p>
          <p className="date-range-display">
            {selectedDates.length > 0 && (
              <>
                {format(Math.min(...selectedDates), 'MMM dd, yyyy')} - {format(Math.max(...selectedDates), 'MMM dd, yyyy')}
              </>
            )}
          </p>
          <Textarea
            label="Reason for blocking"
            placeholder="Enter reason (e.g., maintenance, renovation, special event)"
            value={blockFormData.reason}
            onChange={(e) => setBlockFormData({ reason: e.target.value })}
            rows={3}
            required
          />
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setBlockModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={confirmBlockDates}
              disabled={!blockFormData.reason.trim()}
            >
              Confirm Block
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AvailabilityManagement
