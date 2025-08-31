import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  shape?: 'circle' | 'square';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      fallback,
      size = 'md',
      status,
      shape = 'circle',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'h-6 w-6 text-micro',
      sm: 'h-8 w-8 text-mini',
      md: 'h-10 w-10 text-small',
      lg: 'h-12 w-12 text-regular',
      xl: 'h-16 w-16 text-large',
    };

    const statusColors = {
      online: 'bg-status-green',
      offline: 'bg-text-quaternary',
      away: 'bg-status-yellow',
      busy: 'bg-status-red',
    };

    const statusSizes = {
      xs: 'h-1.5 w-1.5 border',
      sm: 'h-2 w-2 border',
      md: 'h-2.5 w-2.5 border-2',
      lg: 'h-3 w-3 border-2',
      xl: 'h-4 w-4 border-2',
    };

    const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-md';

    const getFallbackText = () => {
      if (fallback) {
        return fallback.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
      }
      return '?';
    };

    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...props}>
        <div
          className={cn(
            'relative overflow-hidden',
            'bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl',
            'border-2 border-white/20',
            'flex items-center justify-center',
            'shadow-lg hover:shadow-xl shadow-purple-500/20',
            'transition-all duration-300 hover:scale-105',
            'group',
            sizeClasses[size],
            shapeClasses
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt || fallback}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <span className="font-bold text-white/90 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {getFallbackText()}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full',
              'border-background-primary',
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max = 3, size = 'md', children, className, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const remainingCount = childrenArray.length - visibleChildren.length;

    const overlapClasses = {
      xs: '-ml-2',
      sm: '-ml-2.5',
      md: '-ml-3',
      lg: '-ml-4',
      xl: '-ml-5',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center', className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            className={cn(
              'relative',
              index > 0 && overlapClasses[size || 'md'],
              'ring-2 ring-background-primary rounded-full'
            )}
          >
            {React.cloneElement(child as React.ReactElement, { size })}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              'relative',
              overlapClasses[size || 'md'],
              'ring-2 ring-background-primary rounded-full'
            )}
          >
            <Avatar
              size={size}
              fallback={`+${remainingCount}`}
            />
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';