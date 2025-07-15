import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { username?: string; email?: string; password?: string } = {};
    
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      console.log('Registering user:', { username, email, password }); // Debug log
      
      const response = await authAPI.register({ username, email, password }, 'user');
      
      console.log('Registration response:', response); // Debug log
      
      if (response.status === 'SUCCESS') {
        toast.success('Account created! Please log in.');
        navigate('/login');
      } else {
        setErrors({ general: 'Registration failed' });
        toast.error('Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error); // Debug log
      const errorMessage = error.response?.data?.errorInfo || error.response?.data?.message || 'Registration failed';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Account" subtitle="Join us today">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-orange-50 border border-skorange text-skorange px-4 py-3 rounded-lg animate-fade-in-scale">
            {errors.general}
          </div>
        )}
        
        <FormInput
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={setUsername}
          error={errors.username}
          icon={<User size={20} />}
        />
        
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
          placeholder="Create a password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          icon={<Lock size={20} />}
          showPasswordToggle
        />
        
        <SubmitButton loading={loading}>
          Create Account
        </SubmitButton>
        
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-skorange hover:text-skorange-dark font-medium transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default SignupPage;