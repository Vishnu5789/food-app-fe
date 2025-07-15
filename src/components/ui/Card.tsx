import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick 
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white shadow-lg hover:shadow-xl border border-gray-100',
    glass: 'bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 hover:shadow-3xl',
    elevated: 'bg-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1',
  };

  const Component = onClick ? motion.div : motion.div;
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    onClick,
    className: 'cursor-pointer',
  } : {};

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card; 