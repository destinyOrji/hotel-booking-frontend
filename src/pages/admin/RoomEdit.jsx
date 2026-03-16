import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RoomForm from '../../components/admin/RoomForm'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'
import roomService from '../../services/roomService'
import './RoomCreateEdit.css'

const RoomEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRoom()
  }, [id])

  const fetchRoom = async () => {
    setLoading(true);
    setError('');
    
    const result = await roomService.getRoom(id);
    
    if (result.success) {
      setRoom(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSubmit = async (formData) => {
    setError('')
    
    const result = await roomService.updateRoom(id, formData)
    
    if (result.success) {
      navigate('/admin/rooms', { 
        state: { success: 'Room updated successfully' } 
      })
    } else {
      setError(result.error)
    }
  }

  const handleCancel = () => {
    navigate('/admin/rooms')
  }

  if (loading) {
    return <Loader fullScreen />
  }

  if (error && !room) {
    return (
      <div className="room-create-edit">
        <Alert type="error" message={error} />
      </div>
    )
  }

  return (
    <div className="room-create-edit">
      <div className="page-header">
        <div>
          <h1>Edit Room</h1>
          <p className="page-description">Update room details and settings</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {room && (
        <RoomForm 
          room={room} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
        />
      )}
    </div>
  )
}

export default RoomEdit
