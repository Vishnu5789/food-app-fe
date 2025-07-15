import React from 'react';

interface SKDelightLogoProps {
  className?: string;
  animate?: boolean;
}

const SKDelightLogo: React.FC<SKDelightLogoProps> = ({ className = '', animate = false }) => (
  <div
    className={`inline-flex items-center px-4 py-2 rounded-xl shadow-sk-card bg-skgreen font-sans select-none drop-shadow-lg transition-transform duration-300 hover:scale-105 ${animate ? 'animate-fade-in-scale' : ''} ${className}`}
    style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: '0.01em' }}
  >
    <span style={{ fontSize: '2.2rem', marginRight: '0.5rem' }}>🍛</span>
    <span className="text-skorange">SK Delight</span>
  </div>
);

export default SKDelightLogo; 