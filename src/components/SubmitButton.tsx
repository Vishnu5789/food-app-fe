import React, { useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  type = 'submit',
  onClick,
  variant = 'primary'
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const baseClasses = "w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:animate-pulse";
  
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-r from-skorange to-skorange-dark text-white hover:from-skorange-dark hover:to-skorange focus:ring-skorange hover:scale-105 active:scale-95 shadow-xl backdrop-blur-sm"
    : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 hover:scale-105 active:scale-95 shadow";

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'absolute bg-white/40 rounded-full pointer-events-none animate-ping';
    ripple.style.width = ripple.style.height = '120px';
    ripple.style.left = `${e.nativeEvent.offsetX - 60}px`;
    ripple.style.top = `${e.nativeEvent.offsetY - 60}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={typeof children === 'string' ? children : 'Submit'}
      className={`${baseClasses} ${variantClasses} relative overflow-hidden`}
      onMouseDown={handleRipple}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 size={20} className="animate-spin mr-2" />
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;