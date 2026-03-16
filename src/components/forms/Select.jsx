import { useState, useRef, useEffect } from 'react'
import './Select.css'

const Select = ({ 
  name, 
  label, 
  options = [], 
  error, 
  register = () => ({}),
  placeholder = 'Select an option',
  disabled = false,
  searchable = false,
  className = '',
  onChange,
  value,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = searchable
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const selectedOption = options.find(opt => opt.value === value)

  if (!searchable) {
    return (
      <div className={`input-group ${className}`}>
        {label && (
          <label htmlFor={name} className="input-label">
            {label}
          </label>
        )}
        <select
          id={name}
          className={`select-field ${error ? 'input-error' : ''}`}
          disabled={disabled}
          {...register(name)}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="input-error-message" role="alert">
            {error.message || error}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`input-group ${className}`} ref={selectRef}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      <div className="select-searchable">
        <div
          className={`select-trigger ${error ? 'input-error' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? '' : 'select-placeholder'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={`select-arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
        {isOpen && (
          <div className="select-dropdown">
            <input
              type="text"
              className="select-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="select-options">
              {filteredOptions.length === 0 ? (
                <div className="select-option disabled">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`select-option ${option.value === value ? 'selected' : ''}`}
                    onClick={() => {
                      onChange && onChange(option.value)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <span className="input-error-message" role="alert">
          {error.message || error}
        </span>
      )}
    </div>
  )
}

export default Select
