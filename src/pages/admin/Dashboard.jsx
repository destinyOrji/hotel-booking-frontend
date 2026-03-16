import { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Chart from '../../components/common/Chart';
import './Dashboard.css';

const Dashboard = () => {
  const { dashboardMetrics, fetchDashboardMetrics, isLoading, error: contextError } = useAdmin();
  const [error, setError] = useState('');
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  useEffect(() => {
    loadDashboard();
    loadWeeklyRevenue();
  }, []);

  const loadDashboard = async () => {
    setError('');
    const result = await fetchDashboardMetrics();
    if (!result) {
      setError('Failed to load dashboard metrics');
    }
  };

  const loadWeeklyRevenue = async () => {
    setLoadingRevenue(true);
    try {
      // Create array for last 7 days with proper day names
      const last7Days = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        last7Days.push({
          date: date,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toISOString().split('T')[0],
          revenue: 0
        });
      }

      // Fetch revenue data from backend
      const startDate = last7Days[0].date;
      const endDate = last7Days[last7Days.length - 1].date;

      const response = await fetch(
        `/api/admin/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.revenueTrends) {
          // Map backend data to our 7-day structure
          data.data.revenueTrends.forEach(item => {
            const itemDate = new Date(item._id.year, item._id.month - 1, item._id.day);
            const dateStr = itemDate.toISOString().split('T')[0];
            
            const dayIndex = last7Days.findIndex(d => d.fullDate === dateStr);
            if (dayIndex !== -1) {
              last7Days[dayIndex].revenue = item.revenue;
            }
          });
        }
      }

      // Format for chart (only day name and revenue)
      const chartData = last7Days.map(d => ({
        day: d.day,
        revenue: d.revenue
      }));

      setWeeklyRevenue(chartData);
    } catch (err) {
      console.error('Failed to load weekly revenue:', err);
      // Fallback to empty data for last 7 days
      const fallbackData = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        fallbackData.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: 0
        });
      }
      
      setWeeklyRevenue(fallbackData);
    } finally {
      setLoadingRevenue(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={loadDashboard} className="refresh-button">
          Refresh
        </button>
      </div>

      {(error || contextError) && (
        <div className="error-message">
          {error || contextError}
        </div>
      )}

      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Occupancy Rate</h3>
            <p className="metric-value">{dashboardMetrics.occupancyRate || 0}%</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📥</div>
          <div className="metric-content">
            <h3>Today's Check-ins</h3>
            <p className="metric-value">{dashboardMetrics.todayCheckIns || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📤</div>
          <div className="metric-content">
            <h3>Today's Check-outs</h3>
            <p className="metric-value">{dashboardMetrics.todayCheckOuts || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Today's Revenue</h3>
            <p className="metric-value">${dashboardMetrics.todayRevenue || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💵</div>
          <div className="metric-content">
            <h3>Monthly Revenue</h3>
            <p className="metric-value">${dashboardMetrics.monthRevenue || 0}</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="dashboard-chart-section">
        <h2>Weekly Revenue Overview (Last 7 Days)</h2>
        {loadingRevenue ? (
          <div className="loading">Loading revenue data...</div>
        ) : (
          <div className="chart-container">
            <Chart 
              type="line" 
              data={weeklyRevenue} 
              xKey="day"
              dataKeys={['revenue']}
              height={300}
              showGrid={true}
              showLegend={false}
            />
          </div>
        )}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Upcoming Bookings</h2>
          <div className="bookings-list">
            {dashboardMetrics.upcomingBookings && dashboardMetrics.upcomingBookings.length > 0 ? (
              dashboardMetrics.upcomingBookings.map((booking) => (
                <div key={booking._id} className="booking-item">
                  <div className="booking-info">
                    <strong>{booking.guestInfo?.name || 'Guest'}</strong>
                    <span>{booking.room?.name || 'Room'}</span>
                  </div>
                  <div className="booking-date">
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No upcoming bookings</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Low Availability Alerts</h2>
          <div className="alerts-list">
            {dashboardMetrics.lowAvailabilityAlerts && dashboardMetrics.lowAvailabilityAlerts.length > 0 ? (
              dashboardMetrics.lowAvailabilityAlerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <span className="alert-icon">⚠️</span>
                  <div className="alert-info">
                    <strong>{new Date(alert.date).toLocaleDateString()}</strong>
                    <span>{alert.availabilityPercent}% available</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No availability alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
