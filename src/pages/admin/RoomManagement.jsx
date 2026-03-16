import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/common/DataTable'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import roomService from '../../services/roomService'
import { ROOM_STATUS } from '../../utils/constants'
import { formatPrice } from '../../utils/formatters'
import './RoomManagement.css'

const RoomManagement = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, room: null })
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    setLoading(true)
    setError('')
    const result = await roomService.getRooms()
    
    if (result.success) {
      setRooms(result.data)
      setFilteredRooms(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleSort = ({ key, direction }) => {
    const sorted = [...filteredRooms].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (typeof aVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    })
    setFilteredRooms(sorted)
  }

  const handleFilter = (filters) => {
    let filtered = [...rooms]
    
    Object.keys(filters).forEach(key => {
      const value = filters[key]
      if (value) {
        filtered = filtered.filter(room => {
          const roomValue = String(room[key]).toLowerCase()
          return roomValue.includes(value.toLowerCase())
        })
      }
    })
    
    setFilteredRooms(filtered)
  }

  const handleCreateRoom = () => {
    navigate('/admin/rooms/new')
  }

  const handleEditRoom = (room) => {
    const roomId = room._id || room.id;
    navigate(`/admin/rooms/${roomId}/edit`);
  };

  const handleDeleteClick = (room) => {
    setDeleteModal({ isOpen: true, room });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.room) return;
    
    const roomId = deleteModal.room._id || deleteModal.room.id;
    const result = await roomService.deleteRoom(roomId);
    
    if (result.success) {
      setSuccess('Room deleted successfully');
      setDeleteModal({ isOpen: false, room: null });
      fetchRooms();
    } else {
      setError(result.error);
      setDeleteModal({ isOpen: false, room: null });
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      [ROOM_STATUS.AVAILABLE]: 'status-badge status-available',
      [ROOM_STATUS.BLOCKED]: 'status-badge status-blocked',
      [ROOM_STATUS.MAINTENANCE]: 'status-badge status-maintenance'
    }
    
    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {status}
      </span>
    )
  }

  const columns = [
    {
      key: 'name',
      label: 'Room Name',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="room-name-cell">
          {row.images && row.images[0] && (
            <img src={row.images[0]} alt={value} className="room-thumbnail" />
          )}
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      filterable: true
    },
    {
      key: 'basePrice',
      label: 'Base Price',
      sortable: true,
      render: (value) => formatPrice(value)
    },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (value) => value ? `${value.adults} adults, ${value.children} children` : 'N/A'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => getStatusBadge(value)
    }
  ]

  const renderActions = (room) => (
    <div className="table-actions">
      <Button
        variant="outline"
        size="small"
        onClick={() => handleEditRoom(room)}
      >
        Edit
      </Button>
      <Button
        variant="danger"
        size="small"
        onClick={() => handleDeleteClick(room)}
      >
        Delete
      </Button>
    </div>
  )

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="room-management">
      <div className="page-header">
        <div>
          <h1>Room Management</h1>
          <p className="page-description">Manage hotel rooms and their details</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
          </div>
          <Button onClick={handleCreateRoom}>
            + Add New Room
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredRooms}
          onSort={handleSort}
          onFilter={handleFilter}
          actions={renderActions}
        />
      ) : (
        <div className="room-grid">
          {filteredRooms.map(room => {
            const roomId = room._id || room.id;
            return (
              <div key={roomId} className="room-grid-card">
                {room.images && room.images[0] && (
                  <img src={room.images[0]} alt={room.name} className="room-grid-image" />
                )}
                <div className="room-grid-content">
                  <h3>{room.name}</h3>
                  <p className="room-type">{room.type}</p>
                  <p className="room-price">{formatPrice(room.basePrice)}</p>
                  {getStatusBadge(room.status)}
                </div>
                <div className="room-grid-actions">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleEditRoom(room)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteClick(room)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, room: null })}
        title="Delete Room"
      >
        <div className="delete-modal-content">
          <p>Are you sure you want to delete <strong>{deleteModal.room?.name}</strong>?</p>
          <p className="warning-text">This action cannot be undone.</p>
          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, room: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default RoomManagement
