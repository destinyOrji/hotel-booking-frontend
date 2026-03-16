import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../forms/Input'
import Select from '../forms/Select'
import DatePicker from '../forms/DatePicker'
import Button from '../common/Button'
import roomService from '../../services/roomService'
import { DISCOUNT_TYPES } from '../../utils/constants'
import './PromotionForm.css'

const PromotionForm = ({ promotion, onSubmit, onCancel }) => {
  const [rooms, setRooms] = useState([])
  const [selectedRooms, setSelectedRooms] = useState(promotion?.applicableRooms || [])
  const [validFrom, setValidFrom] = useState(promotion?.validFrom ? new Date(promotion.validFrom) : null)
  const [validTo, setValidTo] = useState(promotion?.validTo ? new Date(promotion.validTo) : null)
  const [discountType, setDiscountType] = useState(promotion?.discountType || DISCOUNT_TYPES.PERCENTAGE)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      code: promotion?.code || '',
      description: promotion?.description || '',
      discountType: promotion?.discountType || DISCOUNT_TYPES.PERCENTAGE,
      discountValue: promotion?.discountValue || '',
      usageLimit: promotion?.usageLimit || ''
    }
  })

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    const result = await roomService.getRooms()
    if (result.success) {
      setRooms(result.data)
    }
  }

  const handleRoomToggle = (roomId) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomId)) {
        return prev.filter(id => id !== roomId)
      }
      return [...prev, roomId]
    })
  }

  const handleSelectAllRooms = () => {
    if (selectedRooms.length === rooms.length) {
      setSelectedRooms([])
    } else {
      setSelectedRooms(rooms.map(room => room.id))
    }
  }

  const onFormSubmit = async (data) => {
    if (!validFrom || !validTo) {
      return
    }

    if (selectedRooms.length === 0) {
      return
    }

    setLoading(true)

    const promotionData = {
      ...data,
      validFrom: validFrom.toISOString(),
      validTo: validTo.toISOString(),
      applicableRooms: selectedRooms,
      discountType
    }

    await onSubmit(promotionData)
    setLoading(false)
  }

  const discountTypeOptions = [
    { value: DISCOUNT_TYPES.PERCENTAGE, label: 'Percentage (%)' },
    { value: DISCOUNT_TYPES.FIXED, label: 'Fixed Amount ($)' }
  ]

  const watchDiscountType = watch('discountType')

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="promotion-form">
      <div className="form-section">
        <h3>Basic Information</h3>
        
        <Input
          name="code"
          label="Promo Code"
          placeholder="e.g., SUMMER2024"
          register={(name) => register(name, {
            required: 'Promo code is required',
            pattern: {
              value: /^[A-Z0-9]+$/,
              message: 'Promo code must contain only uppercase letters and numbers'
            }
          })}
          error={errors.code}
        />

        <Input
          name="description"
          label="Description"
          placeholder="Brief description of the promotion"
          register={(name) => register(name, {
            required: 'Description is required'
          })}
          error={errors.description}
        />
      </div>

      <div className="form-section">
        <h3>Discount Configuration</h3>
        
        <Select
          name="discountType"
          label="Discount Type"
          options={discountTypeOptions}
          value={discountType}
          onChange={(value) => {
            setDiscountType(value)
            setValue('discountType', value)
          }}
          register={register}
        />

        <Input
          name="discountValue"
          label={discountType === DISCOUNT_TYPES.PERCENTAGE ? 'Discount Percentage' : 'Discount Amount'}
          type="number"
          placeholder={discountType === DISCOUNT_TYPES.PERCENTAGE ? 'e.g., 20' : 'e.g., 50'}
          register={(name) => register(name, {
            required: 'Discount value is required',
            min: {
              value: 0,
              message: 'Discount value must be positive'
            },
            max: discountType === DISCOUNT_TYPES.PERCENTAGE ? {
              value: 100,
              message: 'Percentage cannot exceed 100'
            } : undefined
          })}
          error={errors.discountValue}
        />
      </div>

      <div className="form-section">
        <h3>Validity Period</h3>
        
        <div className="date-range-group">
          <DatePicker
            label="Valid From"
            value={validFrom}
            onChange={setValidFrom}
            minDate={new Date()}
            placeholder="Select start date"
            error={!validFrom && 'Start date is required'}
          />

          <DatePicker
            label="Valid To"
            value={validTo}
            onChange={setValidTo}
            minDate={validFrom || new Date()}
            placeholder="Select end date"
            error={!validTo && 'End date is required'}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Usage Limit</h3>
        
        <Input
          name="usageLimit"
          label="Maximum Uses"
          type="number"
          placeholder="e.g., 100 (leave empty for unlimited)"
          register={(name) => register(name, {
            min: {
              value: 1,
              message: 'Usage limit must be at least 1'
            }
          })}
          error={errors.usageLimit}
        />
      </div>

      <div className="form-section">
        <h3>Applicable Rooms</h3>
        
        <div className="room-selector">
          <div className="room-selector-header">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedRooms.length === rooms.length && rooms.length > 0}
                onChange={handleSelectAllRooms}
              />
              <span>Select All Rooms</span>
            </label>
          </div>

          <div className="room-list">
            {rooms.map(room => (
              <label key={room.id} className="checkbox-label room-item">
                <input
                  type="checkbox"
                  checked={selectedRooms.includes(room.id)}
                  onChange={() => handleRoomToggle(room.id)}
                />
                <div className="room-info">
                  <span className="room-name">{room.name}</span>
                  <span className="room-type">{room.type}</span>
                </div>
              </label>
            ))}
          </div>

          {selectedRooms.length === 0 && (
            <p className="error-text">Please select at least one room</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {promotion ? 'Update Promotion' : 'Create Promotion'}
        </Button>
      </div>
    </form>
  )
}

export default PromotionForm
