import React from 'react';
import { cn } from '@/utils/cn';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  className,
  ...props
}) => {
  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'inline-block h-full w-px bg-border-primary',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div className={cn('relative my-6', className)} {...props}>
        <div className="absolute inset-0 flex items-center">
          <div className={cn('w-full border-t border-border-primary', variantClasses[variant])} />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background-primary px-3 text-mini text-text-tertiary">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'my-4 border-t border-border-primary',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};