import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import './Register.css';

const Register = () => {
  const { register: registerUser } = useAuth();
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
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });

      if (result.success) {
        setSuccess(result.message || 'Registration successful! Please check your email to verify your account.');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Sign up to start booking">
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
          Create Account
        </Button>
      </form>

      <div className="auth-form-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="auth-link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
