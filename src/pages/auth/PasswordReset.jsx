import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../../services/authService';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import './PasswordReset.css';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
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
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await authService.resetPassword(token, data.password);

      if (result.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-card">
          <Alert 
            type="error" 
            message="Invalid or missing reset token. Please request a new password reset link."
          />
          <div className="password-reset-footer">
            <Link to="/forgot-password" className="back-link">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h1 className="password-reset-title">Reset Password</h1>
        <p className="password-reset-subtitle">
          Enter your new password below.
        </p>

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
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="password-reset-form">
          <Input
            type="password"
            name="password"
            label="New Password"
            placeholder="Enter new password (min 8 characters)"
            register={register}
            error={errors.password}
            disabled={isLoading || success}
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            register={register}
            error={errors.confirmPassword}
            disabled={isLoading || success}
          />

          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading || success}
            className="password-reset-button"
          >
            Reset Password
          </Button>
        </form>

        <div className="password-reset-footer">
          <Link to="/login" className="back-link">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
