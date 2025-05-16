
import React from 'react';
import { isIOS, isAndroid, isNativePlatform } from '@/services/capacitor';

interface SafeAreaProps {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  all?: boolean;
  children: React.ReactNode;
  className?: string;
}

const SafeArea = ({
  top = false,
  bottom = false,
  left = false,
  right = false,
  all = false,
  children,
  className = '',
}: SafeAreaProps) => {
  const safeAreaClasses = [
    all || top ? 'pt-safe' : '',
    all || bottom ? 'pb-safe' : '',
    all || left ? 'pl-safe' : '',
    all || right ? 'pr-safe' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={safeAreaClasses}>
      {children}
    </div>
  );
};

export default SafeArea;
