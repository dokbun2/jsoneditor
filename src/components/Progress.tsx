import React from 'react';
import { cn } from '@/utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showLabel?: boolean;
  label?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-purple-500 to-blue-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {(showLabel || label) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-bold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full',
          'bg-white/10 backdrop-blur-xl',
          'shadow-inner shadow-black/20',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            'relative overflow-hidden',
            variantClasses[variant],
            'shadow-lg'
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};