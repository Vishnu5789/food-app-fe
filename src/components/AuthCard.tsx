import React from 'react';
import SKDelightLogo from './SKDelightLogo';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-skgreen">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/40 transform transition-all duration-500 hover:shadow-2xl animate-fade-in-scale">
          <div className="text-center mb-10">
            <SKDelightLogo className="mx-auto mb-6" animate />
            {title && <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{title}</h1>}
            {subtitle && <p className="text-gray-600 text-lg mb-2">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;