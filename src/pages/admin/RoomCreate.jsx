import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RoomForm from '../../components/admin/RoomForm'
import Alert from '../../components/common/Alert'
import roomService from '../../services/roomService'
import './RoomCreateEdit.css'

const RoomCreate = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSubmit = async (formData) => {
    setError('')
    
    const result = await roomService.createRoom(formData)
    
    if (result.success) {
      navigate('/admin/rooms', { 
        state: { success: 'Room created successfully' } 
      })
    } else {
      setError(result.error)
    }
  }

  const handleCancel = () => {
    navigate('/admin/rooms')
  }

  return (
    <div className="room-create-edit">
      <div className="page-header">
        <div>
          <h1>Create New Room</h1>
          <p className="page-description">Add a new room to your hotel inventory</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <RoomForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}

export default RoomCreate
