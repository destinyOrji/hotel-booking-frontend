import './Input.css'

const Input = ({ 
  type = 'text', 
  name, 
  label, 
  error, 
  register = () => ({}),
  validation = {},
  placeholder = '',
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
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

export default Input
