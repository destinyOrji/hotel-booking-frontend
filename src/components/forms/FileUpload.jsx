import { useState, useRef } from 'react'
import './FileUpload.css'

const FileUpload = ({ 
  accept = 'image/*', 
  multiple = false, 
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  preview = true,
  label,
  error,
  className = ''
}) => {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`
    }
    return null
  }

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    const validFiles = []
    let errorMsg = ''

    for (const file of newFiles) {
      const error = validateFile(file)
      if (error) {
        errorMsg = error
        break
      }
      validFiles.push(file)
    }

    if (errorMsg) {
      setUploadError(errorMsg)
      return
    }

    setUploadError('')
    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
    setFiles(updatedFiles)
    onUpload && onUpload(updatedFiles)
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onUpload && onUpload(updatedFiles)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return null
  }

  return (
    <div className={`file-upload-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      
      <div
        className={`file-upload-dropzone ${isDragging ? 'dragging' : ''} ${error || uploadError ? 'error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="file-upload-input"
        />
        
        <div className="file-upload-content">
          <svg className="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="file-upload-text">
            <span className="file-upload-link">Click to upload</span> or drag and drop
          </p>
          <p className="file-upload-hint">
            {accept === 'image/*' ? 'PNG, JPG, GIF' : accept} up to {(maxSize / 1024 / 1024).toFixed(1)}MB
          </p>
        </div>
      </div>

      {(error || uploadError) && (
        <span className="input-error-message" role="alert">
          {error?.message || error || uploadError}
        </span>
      )}

      {preview && files.length > 0 && (
        <div className="file-upload-previews">
          {files.map((file, index) => {
            const previewUrl = getFilePreview(file)
            return (
              <div key={index} className="file-upload-preview">
                {previewUrl ? (
                  <img src={previewUrl} alt={file.name} className="file-preview-image" />
                ) : (
                  <div className="file-preview-placeholder">
                    <span className="file-preview-name">{file.name}</span>
                  </div>
                )}
                <button
                  type="button"
                  className="file-preview-remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(index)
                  }}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FileUpload
