import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import authService from '../../services/authService';
import './Register.css';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await authService.registerAdmin({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        adminSecretKey: data.adminSecretKey
      });

      if (result.success) {
        setSuccess('Admin registration successful! Redirecting to admin dashboard...');
        
        // Store token and user data
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setError(result.error || 'Admin registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Registration" subtitle="Create an admin account">
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      {success && (
        <Alert 
          type="success" 
          message={success} 
          onClose={() => setSuccess('')}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <Input
          type="text"
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          register={register}
          validation={{
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          }}
          error={errors.name}
          disabled={isLoading}
        />

        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          register={register}
          validation={{
            required: 'Email is required',
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: 'Please enter a valid email'
            }
          }}
          error={errors.email}
          disabled={isLoading}
        />

        <Input
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="Enter your phone number"
          register={register}
          error={errors.phone}
          disabled={isLoading}
        />

        <Input
          type="password"
          name="adminSecretKey"
          label="Admin Secret Key"
          placeholder="Enter the admin secret key"
          register={register}
          validation={{
            required: 'Admin secret key is required'
          }}
          error={errors.adminSecretKey}
          disabled={isLoading}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Create a password (min 8 characters)"
          register={register}
          validation={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          }}
          error={errors.password}
          disabled={isLoading}
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          register={register}
          validation={{
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          }}
          error={errors.confirmPassword}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
          className="auth-submit-button"
        >
          Create Admin Account
        </Button>
      </form>

      <div className="auth-form-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="auth-link-primary">
            Sign in
          </Link>
        </p>
        <p>
          Regular user?{' '}
          <Link to="/register" className="auth-link-primary">
            User registration
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default AdminRegister;
