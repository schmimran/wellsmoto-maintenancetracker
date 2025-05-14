
import React from 'react';

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
    <div className={`flex ${withText ? 'flex-col items-center' : ''}`}>
      <div className={`${sizeStyles[size]} relative rounded-full bg-wells-darkBlue border-2 border-[#a6a48a]`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Stylized WM in gold/green colors */}
          <div className="text-[#a6a48a] font-bold text-xl">WM</div>
        </div>
        {/* Red lightning bolt overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-wells-red text-2xl font-bold transform -rotate-12">⚡</div>
        </div>
      </div>
      
      {withText && (
        <div className="mt-2 text-center">
          <h1 className="text-2xl font-bold">WELLS MOTO</h1>
          <p className="text-sm text-gray-500">Your Motorcycle Maintenance Companion</p>
        </div>
      )}
    </div>
  );
};

export default Logo;
