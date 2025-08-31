import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  as?: React.ElementType;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      as: Component = 'button',
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-all duration-200',
      'transform-gpu',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'relative isolate overflow-hidden',
      'group',
      fullWidth && 'w-full'
    );

    const variantClasses = {
      primary: cn(
        'bg-brand-primary text-white',
        'hover:bg-brand-accent',
        'shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_-1px_0_0_rgba(0,0,0,0.1)_inset]',
        'hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_-1px_0_0_rgba(0,0,0,0.15)_inset]',
        'active:shadow-[0_1px_0_0_rgba(0,0,0,0.1)_inset]',
        'border border-brand-primary/20'
      ),
      secondary: cn(
        'bg-white/[0.05] text-text-primary',
        'hover:bg-white/[0.08]',
        'border border-white/[0.08]',
        'shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]',
        'hover:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]',
        'backdrop-blur-sm'
      ),
      ghost: cn(
        'bg-transparent text-text-secondary',
        'hover:bg-white/[0.05] hover:text-text-primary',
        'active:bg-white/[0.03]',
        'border border-transparent'
      ),
      danger: cn(
        'bg-status-errorLight text-status-error',
        'hover:bg-red-500/15',
        'border border-red-500/20',
        'shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]'
      ),
      success: cn(
        'bg-status-successLight text-status-success',
        'hover:bg-green-500/15',
        'border border-green-500/20',
        'shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]'
      ),
    };

    const sizeClasses = {
      xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-md',
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-5 text-base gap-2.5',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
          </svg>
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';