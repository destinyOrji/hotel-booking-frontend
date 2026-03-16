import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import RoomCard from '../../components/ui/RoomCard'
import Select from '../../components/forms/Select'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import roomService from '../../services/roomService'
import { ROOM_TYPES, PAGINATION } from '../../utils/constants'
import './RoomListing.css'

const RoomListing = () => {
  const [searchParams] = useSearchParams()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    roomType: searchParams.get('roomType') || '',
    minPrice: '',
    maxPrice: ''
  })
  const [sortBy, setSortBy] = useState('price-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const searchCriteria = {
    checkIn: searchParams.get('checkIn'),
    checkOut: searchParams.get('checkOut'),
    guests: searchParams.get('guests')
  }

  useEffect(() => {
    fetchRooms()
  }, [filters, sortBy, currentPage])

  const fetchRooms = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        ...searchCriteria,
        ...filters,
        sortBy,
        page: currentPage,
        limit: PAGINATION.DEFAULT_PAGE_SIZE
      }

      const result = await roomService.searchRooms(params)

      if (result.success) {
        setRooms(result.data.rooms || result.data || [])
        setTotalPages(result.data.totalPages || 1)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load rooms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field) => (value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const roomTypeOptions = [
    { value: '', label: 'All Room Types' },
    { value: ROOM_TYPES.SINGLE, label: 'Single Room' },
    { value: ROOM_TYPES.DOUBLE, label: 'Double Room' },
    { value: ROOM_TYPES.SUITE, label: 'Suite' },
    { value: ROOM_TYPES.DELUXE, label: 'Deluxe Room' },
    { value: ROOM_TYPES.FAMILY, label: 'Family Room' }
  ]

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'name-asc', label: 'Name: A to Z' }
  ]

  const clearFilters = () => {
    setFilters({
      roomType: '',
      minPrice: '',
      maxPrice: ''
    })
    setSortBy('price-asc')
    setCurrentPage(1)
  }

  const hasActiveFilters = () => {
    return filters.roomType || filters.minPrice || filters.maxPrice
  }

  const priceRangeOptions = [
    { value: '', label: 'Any Price' },
    { value: '0-100', label: 'Under $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200-300', label: '$200 - $300' },
    { value: '300-500', label: '$300 - $500' },
    { value: '500-', label: 'Over $500' }
  ]

  const handlePriceRangeChange = (value) => {
    if (!value) {
      setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))
    } else {
      const [min, max] = value.split('-')
      setFilters(prev => ({
        ...prev,
        minPrice: min || '',
        maxPrice: max || ''
      }))
    }
    setCurrentPage(1)
  }

  const getPriceRangeValue = () => {
    if (!filters.minPrice && !filters.maxPrice) return ''
    return `${filters.minPrice}-${filters.maxPrice}`
  }

  if (loading && rooms.length === 0) {
    return (
      <div className="room-listing-page">
        <div className="container">
          <Loader fullScreen />
        </div>
      </div>
    )
  }

  return (
    <div className="room-listing-page">
      <div className="container">
        <div className="listing-header">
          <div className="listing-title-section">
            <h1 className="listing-title">Available Rooms</h1>
            {searchCriteria.checkIn && searchCriteria.checkOut && (
              <p className="listing-subtitle">
                {new Date(searchCriteria.checkIn).toLocaleDateString()} - {new Date(searchCriteria.checkOut).toLocaleDateString()}
                {searchCriteria.guests && ` • ${searchCriteria.guests} Guest${searchCriteria.guests > 1 ? 's' : ''}`}
              </p>
            )}
          </div>
          <div className="listing-results-count">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div className="listing-content">
          <aside className="listing-filters">
            <div className="filters-header">
              <h2 className="filters-title">Filters</h2>
              {hasActiveFilters() && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>

            <div className="filter-group">
              <Select
                name="roomType"
                label="Room Type"
                options={roomTypeOptions}
                value={filters.roomType}
                onChange={handleFilterChange('roomType')}
              />
            </div>

            <div className="filter-group">
              <Select
                name="priceRange"
                label="Price Range"
                options={priceRangeOptions}
                value={getPriceRangeValue()}
                onChange={handlePriceRangeChange}
              />
            </div>

            <div className="filter-group">
              <Select
                name="sortBy"
                label="Sort By"
                options={sortOptions}
                value={sortBy}
                onChange={handleSortChange}
              />
            </div>
          </aside>

          <main className="listing-results">
            {loading ? (
              <Loader />
            ) : rooms.length === 0 ? (
              <div className="no-results">
                <p>No rooms found matching your criteria.</p>
                <p>Try adjusting your filters or search dates.</p>
              </div>
            ) : (
              <>
                <div className="rooms-grid">
                  {rooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <div className="pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default RoomListing
