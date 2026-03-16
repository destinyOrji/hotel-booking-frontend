import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../forms/Input'
import Select from '../forms/Select'
import Button from '../common/Button'
import uploadService from '../../services/uploadService'
import { ROOM_STATUS, ROOM_TYPES } from '../../utils/constants'
import './RoomForm.css'

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [uploadedImages, setUploadedImages] = useState([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [seasonalPricing, setSeasonalPricing] = useState([])
  const [amenities, setAmenities] = useState([])
  const [newAmenity, setNewAmenity] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    defaultValues: room || {
      name: '',
      type: '',
      description: '',
      basePrice: '',
      capacity: {
        adults: 2,
        children: 0
      },
      status: ROOM_STATUS.AVAILABLE
    }
  })

  useEffect(() => {
    if (room) {
      setAmenities(room.amenities || [])
      setSeasonalPricing(room.seasonalPricing || [])
      if (room.images && room.images.length > 0) {
        // Store existing image URLs
        setUploadedImages(room.images)
      }
    }
  }, [room])

  const handleFormSubmit = async (data) => {
    // All images are now simple strings (URLs)
    const imageUrls = uploadedImages.filter(url => typeof url === 'string');
    
    const formData = {
      ...data,
      amenities,
      seasonalPricing,
      images: imageUrls
    };
    
    console.log('Submitting room with images:', imageUrls);
    console.log('Full form data:', formData);
    
    await onSubmit(formData);
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    console.log('=== FILE UPLOAD START ===');
    console.log('Selected files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    
    setIsUploading(true);
    setUploadError('');

    try {
      const result = await uploadService.uploadRoomImages(files);
      
      console.log('Upload service result:', result);
      
      if (result.success && result.data) {
        // Backend returns paths like: ["/uploads/rooms/filename.jpg"]
        // We need to construct full URLs for display
        const imageUrls = result.data.map(path => {
          // If it's already a full URL, use it
          if (path.startsWith('http://') || path.startsWith('https://')) {
            console.log('Full URL detected:', path);
            return path;
          }
          // Otherwise, construct the full URL
          // The backend serves static files from /uploads
          const fullUrl = `http://localhost:5000${path}`;
          console.log('Constructed URL:', fullUrl);
          return fullUrl;
        });
        
        console.log('Final image URLs to add:', imageUrls);
        
        // Add the uploaded URLs to the existing images
        setUploadedImages(prev => {
          const updated = [...prev, ...imageUrls];
          console.log('Updated images array:', updated);
          return updated;
        });
        
        console.log('=== UPLOAD SUCCESS ===');
      } else {
        console.error('Upload failed:', result.error);
        setUploadError(result.error || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Upload exception:', error);
      setUploadError('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
      console.log('=== FILE UPLOAD END ===');
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setUploadedImages([...uploadedImages, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity('')
    }
  }

  const handleRemoveAmenity = (amenity) => {
    setAmenities(amenities.filter(a => a !== amenity))
  }

  const handleAddSeasonalPrice = () => {
    setSeasonalPricing([
      ...seasonalPricing,
      { startDate: '', endDate: '', price: '' }
    ])
  }

  const handleRemoveSeasonalPrice = (index) => {
    setSeasonalPricing(seasonalPricing.filter((_, i) => i !== index))
  }

  const handleSeasonalPriceChange = (index, field, value) => {
    const updated = [...seasonalPricing]
    updated[index][field] = value
    setSeasonalPricing(updated)
  }

  const roomTypeOptions = Object.values(ROOM_TYPES).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))

  const statusOptions = Object.values(ROOM_STATUS).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1)
  }))

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="room-form">
      <div className="form-section">
        <h3 className="section-title">Basic Information</h3>
        
        <Input
          name="name"
          label="Room Name"
          placeholder="e.g., Deluxe Ocean View Suite"
          register={register}
          error={errors.name}
        />

        <Select
          name="type"
          label="Room Type"
          options={roomTypeOptions}
          register={register}
          error={errors.type}
          placeholder="Select room type"
        />

        <div className="form-row">
          <Input
            name="basePrice"
            label="Base Price (per night)"
            type="number"
            placeholder="0.00"
            register={register}
            error={errors.basePrice}
          />

          <Select
            name="status"
            label="Status"
            options={statusOptions}
            register={register}
            error={errors.status}
          />
        </div>

        <div className="form-group">
          <label className="input-label">Description</label>
          <textarea
            className={`textarea-field ${errors.description ? 'input-error' : ''}`}
            placeholder="Describe the room features and amenities..."
            rows="4"
            {...register('description')}
          />
          {errors.description && (
            <span className="input-error-message">{errors.description.message}</span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Capacity</h3>
        
        <div className="form-row">
          <Input
            name="capacity.adults"
            label="Adults"
            type="number"
            min="1"
            register={register}
            error={errors.capacity?.adults}
          />

          <Input
            name="capacity.children"
            label="Children"
            type="number"
            min="0"
            register={register}
            error={errors.capacity?.children}
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Amenities</h3>
        
        <div className="amenities-input">
          <Input
            name="newAmenity"
            placeholder="e.g., WiFi, Air Conditioning, Mini Bar"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddAmenity()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddAmenity}
          >
            Add
          </Button>
        </div>

        {amenities.length > 0 && (
          <div className="amenities-list">
            {amenities.map((amenity, index) => (
              <span key={index} className="amenity-tag">
                {amenity}
                <button
                  type="button"
                  className="amenity-remove"
                  onClick={() => handleRemoveAmenity(amenity)}
                  aria-label="Remove amenity"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-section">
        <h3 className="section-title">Room Photos</h3>
        <p className="section-description">Upload images from your computer or add image URLs</p>
        
        {uploadError && (
          <div className="upload-error">{uploadError}</div>
        )}

        {/* File Upload */}
        <div className="file-upload-section">
          <label className="file-upload-label">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
            <div className="file-upload-button">
              {isUploading ? (
                <>
                  <span className="upload-spinner">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <span className="upload-icon">📁</span>
                  Choose Images from Computer
                </>
              )}
            </div>
          </label>
          <p className="file-upload-hint">Click to select images (JPG, PNG, GIF, WebP - Max 5MB each)</p>
        </div>

        {/* OR Divider */}
        <div className="or-divider">
          <span>OR</span>
        </div>

        {/* URL Input */}
        <div className="image-url-input">
          <Input
            name="imageUrl"
            placeholder="Paste image URL here (e.g., https://images.unsplash.com/photo-...)"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddImageUrl()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddImageUrl}
          >
            Add URL
          </Button>
        </div>

        {/* Image Preview */}
        {uploadedImages.length > 0 && (
          <div className="images-preview">
            {uploadedImages.map((imageUrl, index) => {
              console.log(`Rendering image ${index}:`, imageUrl);
              
              return (
                <div key={`img-${index}-${imageUrl}`} className="image-preview-item">
                  <img 
                    src={imageUrl} 
                    alt={`Room ${index + 1}`}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', imageUrl);
                      e.target.style.border = '3px solid #ef4444';
                      e.target.style.background = '#fee2e2';
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully:', imageUrl);
                    }}
                  />
                  <button
                    type="button"
                    className="image-remove"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Test Images */}
        <div className="image-url-suggestions">
          <p className="suggestions-title">Quick test images (click to add):</p>
          <button
            type="button"
            className="suggestion-btn"
            onClick={() => {
              const url = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';
              setUploadedImages([...uploadedImages, url]);
            }}
          >
            + Deluxe Room
          </button>
          <button
            type="button"
            className="suggestion-btn"
            onClick={() => {
              const url = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800';
              setUploadedImages([...uploadedImages, url]);
            }}
          >
            + Suite
          </button>
          <button
            type="button"
            className="suggestion-btn"
            onClick={() => {
              const url = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800';
              setUploadedImages([...uploadedImages, url]);
            }}
          >
            + Standard Room
          </button>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3 className="section-title">Seasonal Pricing</h3>
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={handleAddSeasonalPrice}
          >
            + Add Seasonal Price
          </Button>
        </div>

        {seasonalPricing.length > 0 && (
          <div className="seasonal-pricing-list">
            {seasonalPricing.map((pricing, index) => (
              <div key={index} className="seasonal-pricing-item">
                <div className="seasonal-pricing-fields">
                  <Input
                    name={`seasonal-start-${index}`}
                    label="Start Date"
                    type="date"
                    value={pricing.startDate}
                    onChange={(e) => handleSeasonalPriceChange(index, 'startDate', e.target.value)}
                  />
                  <Input
                    name={`seasonal-end-${index}`}
                    label="End Date"
                    type="date"
                    value={pricing.endDate}
                    onChange={(e) => handleSeasonalPriceChange(index, 'endDate', e.target.value)}
                  />
                  <Input
                    name={`seasonal-price-${index}`}
                    label="Price"
                    type="number"
                    placeholder="0.00"
                    value={pricing.price}
                    onChange={(e) => handleSeasonalPriceChange(index, 'price', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="seasonal-pricing-remove"
                  onClick={() => handleRemoveSeasonalPrice(index)}
                  aria-label="Remove seasonal pricing"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting || isUploading}
        >
          {isUploading ? 'Uploading images...' : room ? 'Update Room' : 'Create Room'}
        </Button>
      </div>
    </form>
  )
}

export default RoomForm
