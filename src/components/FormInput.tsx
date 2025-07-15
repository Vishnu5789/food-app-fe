import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  icon,
  showPasswordToggle
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  const defaultIcon = <span className="w-5 h-5 inline-block" />;

  return (
    <div className="mb-4">
      <div className={`relative transform transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className={`transition-colors duration-300 ${isFocused ? 'text-skorange' : 'text-gray-400'}`}>{icon || defaultIcon}</div>
        </div>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-10' : 'pr-4'} py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skorange focus:border-skorange transition-all duration-300 ${
            error ? 'border-skorange bg-orange-50' : isFocused ? 'border-skorange bg-skgreen' : 'border-gray-300 bg-white hover:border-skorange'
          } scale-100 ${isFocused ? 'scale-105' : ''}`}
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
      </div>
      {error && <p className="mt-1 text-sm text-skorange animate-fade-in-scale">{error}</p>}
    </div>
  );
};

export default FormInput;