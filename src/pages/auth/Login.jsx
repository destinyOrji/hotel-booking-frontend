import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        // Redirect to the page they tried to visit or default based on role
        const from = location.state?.from?.pathname;
        
        // Redirect admin/staff to admin dashboard, regular users to home
        const defaultPath = result.user?.role === 'admin' || result.user?.role === 'staff' 
          ? '/admin' 
          : '/';
        
        navigate(from || defaultPath, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
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

        <div className="auth-form-actions">
          <Link to="/forgot-password" className="auth-link-secondary">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
          className="auth-submit-button"
        >
          Sign In
        </Button>
      </form>

      <div className="auth-form-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link-primary">
            Sign up
          </Link>
        </p>
        <p>
          Admin?{' '}
          <Link to="/register-admin" className="auth-link-primary">
            Admin registration
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
