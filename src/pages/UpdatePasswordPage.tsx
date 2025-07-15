import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Shield, ArrowLeft } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

interface UpdatePasswordPageProps {
  portalType?: 'user' | 'admin';
}

const UpdatePasswordPage: React.FC<UpdatePasswordPageProps> = ({ portalType = 'user' }) => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ otp?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from previous page
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Redirect to forgot password if no email provided
      navigate('/forgot-password');
    }
  }, [location.state, navigate]);

  const validateForm = () => {
    const newErrors: { otp?: string; password?: string; confirmPassword?: string } = {};
    
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    if (!password) {
      newErrors.password = 'New password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      await authAPI.updatePassword(email, password, otp, portalType);
        toast.success('Password updated! Please log in.');
        navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset Password" subtitle="Enter the OTP sent to your email and create a new password">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-orange-50 border border-skorange text-skorange px-4 py-3 rounded-lg animate-fade-in-scale">
            {errors.general}
          </div>
        )}
        
        <div className="bg-skgreen border border-skorange text-skorange px-4 py-3 rounded-lg">
          <p className="text-sm">Reset code sent to: <strong>{email}</strong></p>
        </div>
        
        <FormInput
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={setOtp}
          error={errors.otp}
          icon={<Shield size={20} />}
        />
        
        <FormInput
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          icon={<Lock size={20} />}
          showPasswordToggle
        />
        
        <FormInput
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
          icon={<Lock size={20} />}
          showPasswordToggle
        />
        
        <SubmitButton loading={loading}>
          Update Password
        </SubmitButton>
        
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center text-skorange hover:text-skorange-dark font-medium transition-colors duration-300"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Forgot Password
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default UpdatePasswordPage;