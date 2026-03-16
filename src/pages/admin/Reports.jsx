import { useState, useEffect } from 'react'
import DateRangePicker from '../../components/common/DateRangePicker'
import Chart from '../../components/common/Chart'
import reportService from '../../services/reportService'
import { useToast } from '../../components/common'
import './Reports.css'

const Reports = () => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [revenueData, setRevenueData] = useState(null)
  const [occupancyData, setOccupancyData] = useState(null)
  const [trendsData, setTrendsData] = useState(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    // Set default date range to last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      fetchReports()
    }
  }, [startDate, endDate])

  const fetchReports = async () => {
    setLoading(true)
    
    try {
      // Fetch all reports in parallel
      const [revenueResult, occupancyResult, trendsResult] = await Promise.all([
        reportService.getRevenueReport(startDate, endDate),
        reportService.getOccupancyReport(startDate, endDate),
        reportService.getBookingTrends(startDate, endDate)
      ])

      if (revenueResult.success) {
        setRevenueData(revenueResult.data)
      } else {
        showToast(revenueResult.error, 'error')
      }

      if (occupancyResult.success) {
        setOccupancyData(occupancyResult.data)
      } else {
        showToast(occupancyResult.error, 'error')
      }

      if (trendsResult.success) {
        setTrendsData(trendsResult.data)
      } else {
        showToast(trendsResult.error, 'error')
      }
    } catch (error) {
      showToast('Failed to fetch reports', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleExportRevenue = async () => {
    setExporting(true)
    const result = await reportService.exportReport('revenue', startDate, endDate)
    
    if (result.success) {
      showToast('Revenue report exported successfully', 'success')
    } else {
      showToast(result.error, 'error')
    }
    setExporting(false)
  }

  const handleExportOccupancy = async () => {
    setExporting(true)
    const result = await reportService.exportReport('occupancy', startDate, endDate)
    
    if (result.success) {
      showToast('Occupancy report exported successfully', 'success')
    } else {
      showToast(result.error, 'error')
    }
    setExporting(false)
  }

  const handleExportTrends = async () => {
    setExporting(true)
    const result = await reportService.exportReport('trends', startDate, endDate)
    
    if (result.success) {
      showToast('Booking trends report exported successfully', 'success')
    } else {
      showToast(result.error, 'error')
    }
    setExporting(false)
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="reports-subtitle">View business insights and performance metrics</p>
        </div>
      </div>

      <div className="reports-filters">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          label="Select Date Range"
        />
      </div>

      {loading ? (
        <div className="reports-loading">
          <div className="spinner"></div>
          <p>Loading reports...</p>
        </div>
      ) : (
        <div className="reports-content">
          {/* Revenue Report */}
          <div className="report-section">
            <div className="report-section-header">
              <h2>Revenue Report</h2>
              <button
                className="export-btn"
                onClick={handleExportRevenue}
                disabled={exporting || !revenueData}
              >
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
            {revenueData ? (
              <>
                <div className="report-summary">
                  <div className="summary-card">
                    <span className="summary-label">Total Revenue</span>
                    <span className="summary-value">
                      ${revenueData.totalRevenue?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Total Bookings</span>
                    <span className="summary-value">
                      {revenueData.totalBookings || 0}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Average Booking Value</span>
                    <span className="summary-value">
                      ${revenueData.averageBookingValue?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
                {revenueData.dailyRevenue && revenueData.dailyRevenue.length > 0 && (
                  <Chart
                    type="bar"
                    data={revenueData.dailyRevenue}
                    xKey="date"
                    dataKeys={['revenue']}
                    title="Daily Revenue"
                    height={350}
                  />
                )}
              </>
            ) : (
              <div className="no-data">No revenue data available for the selected period</div>
            )}
          </div>

          {/* Occupancy Report */}
          <div className="report-section">
            <div className="report-section-header">
              <h2>Occupancy Rate</h2>
              <button
                className="export-btn"
                onClick={handleExportOccupancy}
                disabled={exporting || !occupancyData}
              >
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
            {occupancyData ? (
              <>
                <div className="report-summary">
                  <div className="summary-card">
                    <span className="summary-label">Average Occupancy</span>
                    <span className="summary-value">
                      {occupancyData.averageOccupancy?.toFixed(1) || '0'}%
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Total Room Nights</span>
                    <span className="summary-value">
                      {occupancyData.totalRoomNights || 0}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Occupied Room Nights</span>
                    <span className="summary-value">
                      {occupancyData.occupiedRoomNights || 0}
                    </span>
                  </div>
                </div>
                {occupancyData.dailyOccupancy && occupancyData.dailyOccupancy.length > 0 && (
                  <Chart
                    type="line"
                    data={occupancyData.dailyOccupancy}
                    xKey="date"
                    dataKeys={['occupancyRate']}
                    title="Daily Occupancy Rate (%)"
                    height={350}
                  />
                )}
              </>
            ) : (
              <div className="no-data">No occupancy data available for the selected period</div>
            )}
          </div>

          {/* Booking Trends */}
          <div className="report-section">
            <div className="report-section-header">
              <h2>Booking Trends</h2>
              <button
                className="export-btn"
                onClick={handleExportTrends}
                disabled={exporting || !trendsData}
              >
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
            {trendsData ? (
              <>
                <div className="report-summary">
                  <div className="summary-card">
                    <span className="summary-label">Total Bookings</span>
                    <span className="summary-value">
                      {trendsData.totalBookings || 0}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Confirmed</span>
                    <span className="summary-value">
                      {trendsData.confirmedBookings || 0}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Cancelled</span>
                    <span className="summary-value">
                      {trendsData.cancelledBookings || 0}
                    </span>
                  </div>
                </div>
                {trendsData.dailyBookings && trendsData.dailyBookings.length > 0 && (
                  <Chart
                    type="line"
                    data={trendsData.dailyBookings}
                    xKey="date"
                    dataKeys={['bookings']}
                    title="Daily Booking Count"
                    height={350}
                  />
                )}
              </>
            ) : (
              <div className="no-data">No booking trends data available for the selected period</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
