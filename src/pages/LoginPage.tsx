import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface LoginPageProps {
  portalType?: 'user' | 'admin';
}

const LoginPage: React.FC<LoginPageProps> = ({ portalType = 'user' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
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
      const response = await authAPI.login({ email, password }, portalType);
      
      console.log('Login response:', response); // Debug log
      
      if (response.status === 'SUCCESS' && response.data) {
        // Backend returns { username, jwtToken }
        const loginData = response.data;
        
        // Create user object from backend response
        const user = {
          id: 1, // We'll need to get this from backend later
          username: loginData.username,
          email: email,
          role: (portalType === 'admin' ? 'ADMIN' : 'USER') as 'ADMIN' | 'USER',
          createdAt: new Date().toISOString(),
        };
        
        login(user, loginData.jwtToken, portalType);
        toast.success('Login successful!');
        
        // Navigate based on portal type
        if (portalType === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrors({ general: 'Login failed' });
        toast.error('Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error); // Debug log
      const errorMessage = error.response?.data?.errorInfo || error.response?.data?.message || 'Network error. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setErrors({ email: 'Please enter your email first' });
      return;
    }
    navigate('/forgot-password', { state: { email } });
  };

  return (
    <AuthCard title={portalType === 'admin' ? 'Admin Login' : 'Welcome Back'} subtitle="Sign in to your account">
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
        
        <FormInput
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          icon={<Lock size={20} />}
          showPasswordToggle
        />
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-skorange hover:text-skorange-dark transition-colors duration-300"
          >
            Forgot Password?
          </button>
        </div>
        
        <SubmitButton loading={loading}>
          Sign In
        </SubmitButton>
        
        {portalType === 'user' && (
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-skorange hover:text-skorange-dark font-medium transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        )}
      </form>
    </AuthCard>
  );
};

export default LoginPage;