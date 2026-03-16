import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../../services/authService';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import './PasswordRecovery.css';

const PasswordRecovery = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await authService.requestPasswordReset(data.email);

      if (result.success) {
        setSuccess(
          result.message || 
          'Password reset instructions have been sent to your email address.'
        );
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-recovery-container">
      <div className="password-recovery-card">
        <h1 className="password-recovery-title">Forgot Password?</h1>
        <p className="password-recovery-subtitle">
          Enter your email address and we'll send you instructions to reset your password.
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
            onClose={() => setSuccess('')}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="password-recovery-form">
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            register={register}
            error={errors.email}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            className="password-recovery-button"
          >
            Send Reset Link
          </Button>
        </form>

        <div className="password-recovery-footer">
          <Link to="/login" className="back-to-login-link">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
