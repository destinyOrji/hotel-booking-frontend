import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../forms/Input'
import Select from '../forms/Select'
import Button from '../common/Button'
import { USER_ROLES } from '../../utils/constants'
import { validateEmail, validatePhone } from '../../utils/validators'
import './UserEditForm.css'

const UserEditForm = ({ user, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || USER_ROLES.USER
    }
  })

  const roleValue = watch('role')

  const roleOptions = [
    { value: USER_ROLES.GUEST, label: 'Guest' },
    { value: USER_ROLES.USER, label: 'User' },
    { value: USER_ROLES.STAFF, label: 'Staff' },
    { value: USER_ROLES.ADMIN, label: 'Admin' }
  ]

  const onSubmit = async (data) => {
    setLoading(true)
    await onSave(data)
    setLoading(false)
  }

  return (
    <div className="user-edit-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="name"
          label="Full Name"
          placeholder="Enter full name"
          register={register}
          error={errors.name}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
        />

        <Input
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter email address"
          register={register}
          error={errors.email}
          {...register('email', {
            required: 'Email is required',
            validate: (value) => validateEmail(value) || 'Invalid email address'
          })}
        />

        <Input
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="Enter phone number"
          register={register}
          error={errors.phone}
          {...register('phone', {
            validate: (value) => {
              if (!value) return true
              return validatePhone(value) || 'Invalid phone number'
            }
          })}
        />

        <Select
          name="role"
          label="User Role"
          options={roleOptions}
          value={roleValue}
          onChange={(value) => setValue('role', value)}
          error={errors.role}
        />

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
            variant="primary"
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UserEditForm
