import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-brand-primary/10 text-brand-accent border-brand-primary/20',
    success: 'bg-status-successLight text-status-success border-status-success/20',
    warning: 'bg-status-warningLight text-status-warning border-status-warning/20',
    danger: 'bg-status-errorLight text-status-error border-status-error/20',
    info: 'bg-status-infoLight text-status-info border-status-info/20',
    neutral: 'bg-white/[0.05] text-text-secondary border-white/[0.08]',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        'transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
};