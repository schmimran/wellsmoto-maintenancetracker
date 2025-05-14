
import React from 'react';
import { Link } from 'react-router-dom';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
};

const Logo = ({ size = 'md', withText = false }: LogoProps) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  return (
    <Link to="/" className={`flex ${withText ? 'flex-col items-center' : ''}`}>
      <div className={`${sizeStyles[size]} relative`}>
        <img 
          src="/lovable-uploads/8f03e4a2-6676-4a8f-9800-186ae355b255.png" 
          alt="Wells Moto Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {withText && (
        <div className="mt-2 text-center">
          <h1 className="text-2xl font-bold">WELLS MOTO</h1>
          <p className="text-sm text-gray-500">Your Motorcycle Maintenance Companion</p>
        </div>
      )}
    </Link>
  );
};

export default Logo;
