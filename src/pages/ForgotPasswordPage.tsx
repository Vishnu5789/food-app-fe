import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

interface ForgotPasswordPageProps {
  portalType?: 'user' | 'admin';
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ portalType = 'user' }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pre-fill email if passed from login page
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors: { email?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
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
      await authAPI.forgotPassword(email, portalType);
        setSuccess(true);
        toast.success('Reset code sent to your email!');
        setTimeout(() => {
          navigate('/update-password', { state: { email } });
        }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset code';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Check Your Email" subtitle="We've sent a reset code to your email">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-skgreen rounded-full flex items-center justify-center mx-auto">
            <Mail size={24} className="text-skorange" />
          </div>
          <p className="text-gray-600">
            Please check your email and enter the OTP code on the next page.
          </p>
          <div className="animate-pulse">
            <p className="text-sm text-skorange">Redirecting to password reset...</p>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot Password" subtitle="Enter your email to receive a reset code">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-orange-50 border border-skorange text-skorange px-4 py-3 rounded-lg animate-fade-in-scale">
            {errors.general}
          </div>
        )}
        
        <FormInput
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          icon={<Mail size={20} />}
        />
        
        <SubmitButton loading={loading}>
          Send Reset Code
        </SubmitButton>
        
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-skorange hover:text-skorange-dark font-medium transition-colors duration-300"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default ForgotPasswordPage;