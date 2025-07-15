import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  variant?: 'default' | 'filled';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  showPasswordToggle,
  variant = 'default',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : props.type;
  const defaultIcon = <span className="w-5 h-5 inline-block" />;

  const baseClasses = 'w-full rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    default: 'border border-gray-300 bg-white hover:border-skorange focus:border-skorange focus:ring-skorange',
    filled: 'border-0 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-skorange',
  };

  const errorClasses = error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' : '';
  const focusClasses = isFocused ? 'scale-105' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <motion.div 
        className={`relative ${focusClasses}`}
        animate={{ scale: isFocused ? 1.02 : 1 }}
      >
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={`transition-colors duration-300 ${isFocused ? 'text-skorange' : 'text-gray-400'}`}>
              {icon}
            </div>
          </div>
        )}
        
        <input
          {...props}
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${baseClasses} 
            ${variantClasses[variant]} 
            ${errorClasses}
            ${icon ? 'pl-10' : 'pl-4'} 
            ${showPasswordToggle ? 'pr-10' : 'pr-4'} 
            py-3 
            ${className}
          `}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </motion.div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input; 