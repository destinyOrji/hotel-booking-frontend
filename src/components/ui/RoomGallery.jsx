import { useState } from 'react'
import Modal from '../common/Modal'
import './RoomGallery.css'

const RoomGallery = ({ images = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const displayImages = images.length > 0 ? images : ['/placeholder-room.jpg']

  const openGallery = (index) => {
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  const closeGallery = () => {
    setIsModalOpen(false)
    setSelectedImageIndex(null)
  }

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setSelectedImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious()
    } else if (e.key === 'ArrowRight') {
      goToNext()
    } else if (e.key === 'Escape') {
      closeGallery()
    }
  }

  return (
    <>
      <div className="room-gallery">
        <div className="gallery-main">
          <img
            src={displayImages[0]}
            alt="Room main view"
            className="gallery-main-image"
            onClick={() => openGallery(0)}
            loading="eager"
          />
        </div>
        {displayImages.length > 1 && (
          <div className="gallery-thumbnails">
            {displayImages.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="gallery-thumbnail"
                onClick={() => openGallery(index + 1)}
              >
                <img 
                  src={image} 
                  alt={`Room view ${index + 2}`} 
                  loading="lazy"
                />
                {index === 3 && displayImages.length > 5 && (
                  <div className="thumbnail-overlay">
                    <span>+{displayImages.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeGallery}
          size="fullscreen"
          className="gallery-modal"
        >
          <div className="gallery-viewer" onKeyDown={handleKeyDown} tabIndex={0}>
            <button className="gallery-close" onClick={closeGallery} aria-label="Close gallery">
              ✕
            </button>

            <button
              className="gallery-nav gallery-nav-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              ‹
            </button>

            <div className="gallery-image-container">
              <img
                src={displayImages[selectedImageIndex]}
                alt={`Room view ${selectedImageIndex + 1}`}
                className="gallery-full-image"
              />
              <div className="gallery-counter">
                {selectedImageIndex + 1} / {displayImages.length}
              </div>
            </div>

            <button
              className="gallery-nav gallery-nav-next"
              onClick={goToNext}
              aria-label="Next image"
            >
              ›
            </button>

            <div className="gallery-thumbnails-strip">
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  className={`gallery-thumbnail-small ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default RoomGallery
