import './StatusBadge.css'

const STATUS_VARIANTS = {
  // Booking statuses
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
  completed: { label: 'Completed', variant: 'info' },
  'checked-in': { label: 'Checked In', variant: 'primary' },
  'checked-out': { label: 'Checked Out', variant: 'secondary' },
  
  // User statuses
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  suspended: { label: 'Suspended', variant: 'danger' },
  
  // Payment statuses
  paid: { label: 'Paid', variant: 'success' },
  unpaid: { label: 'Unpaid', variant: 'warning' },
  refunded: { label: 'Refunded', variant: 'info' },
  
  // Room statuses
  available: { label: 'Available', variant: 'success' },
  occupied: { label: 'Occupied', variant: 'primary' },
  maintenance: { label: 'Maintenance', variant: 'warning' },
  blocked: { label: 'Blocked', variant: 'danger' },
  
  // Promotion statuses
  draft: { label: 'Draft', variant: 'secondary' },
  scheduled: { label: 'Scheduled', variant: 'info' },
  expired: { label: 'Expired', variant: 'secondary' },
  
  // Staff statuses
  online: { label: 'Online', variant: 'success' },
  offline: { label: 'Offline', variant: 'secondary' },
  busy: { label: 'Busy', variant: 'warning' }
}

const StatusBadge = ({ 
  status, 
  variant,
  label,
  size = 'medium',
  className = '' 
}) => {
  // Normalize status to lowercase for lookup
  const normalizedStatus = status?.toLowerCase()
  
  // Get status config from predefined variants or use custom
  const statusConfig = STATUS_VARIANTS[normalizedStatus] || {
    label: label || status,
    variant: variant || 'default'
  }

  const badgeVariant = variant || statusConfig.variant
  const badgeLabel = label || statusConfig.label

  return (
    <span 
      className={`status-badge status-badge-${badgeVariant} status-badge-${size} ${className}`}
      role="status"
      aria-label={`Status: ${badgeLabel}`}
    >
      <span className="status-badge-dot"></span>
      <span className="status-badge-text">{badgeLabel}</span>
    </span>
  )
}

export default StatusBadge
