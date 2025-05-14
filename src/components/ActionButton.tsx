
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ActionButtonProps = {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
};

const ActionButton = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  className,
  onClick,
  ...props 
}: ActionButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'font-medium',
        variant === 'default' && 'bg-wells-red hover:bg-wells-red/90 text-white',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
