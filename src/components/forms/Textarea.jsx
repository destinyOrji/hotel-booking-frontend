import './Input.css'

const Textarea = ({ 
  name, 
  label, 
  error, 
  register = () => ({}),
  validation = {},
  placeholder = '',
  disabled = false,
  className = '',
  rows = 4,
  ...rest
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      <textarea
        id={name}
        className={`input-field ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...register(name, validation)}
        {...rest}
      />
      {error && (
        <span className="input-error-message" role="alert">
          {error.message || error}
        </span>
      )}
    </div>
  )
}

export default Textarea
