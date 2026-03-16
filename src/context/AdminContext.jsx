import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import adminService from '../services/adminService'

const AdminContext = createContext(null)

export const AdminProvider = ({ children }) => {
  const [dashboardMetrics, setDashboardMetrics] = useState({
    occupancyRate: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    monthlyRevenue: 0,
    upcomingBookings: [],
    lowAvailabilityRooms: []
  })

  const [filters, setFilters] = useState({
    dateRange: {
      start: null,
      end: null
    },
    status: '',
    roomType: '',
    searchQuery: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchDashboardMetrics = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await adminService.getDashboardMetrics()
      if (result.success) {
        setDashboardMetrics(result.data)
        setLastRefresh(new Date())
        return true
      } else {
        setError(result.error || 'Failed to fetch dashboard metrics')
        return false
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics')
      console.error('Error fetching dashboard metrics:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const updateDateRange = useCallback((start, end) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      dateRange: {
        start: null,
        end: null
      },
      status: '',
      roomType: '',
      searchQuery: ''
    })
  }, [])

  const refreshMetrics = useCallback(() => {
    fetchDashboardMetrics()
  }, [fetchDashboardMetrics])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardMetrics()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchDashboardMetrics])

  const value = {
    dashboardMetrics,
    filters,
    isLoading,
    error,
    lastRefresh,
    fetchDashboardMetrics,
    updateFilters,
    updateDateRange,
    clearFilters,
    refreshMetrics
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export default AdminContext
