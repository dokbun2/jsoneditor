import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hoverable = false, children, className, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variantClasses = {
      default: cn(
        'bg-white/[0.02] backdrop-blur-xl',
        'border border-white/[0.05]',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]'
      ),
      elevated: cn(
        'bg-gradient-to-b from-white/[0.05] to-white/[0.02]',
        'border border-white/[0.08]',
        'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]',
        'backdrop-blur-xl'
      ),
      outlined: cn(
        'bg-transparent',
        'border border-white/[0.12]',
        'hover:border-white/[0.2]'
      ),
      ghost: cn(
        'bg-transparent',
        'border border-transparent',
        'hover:bg-white/[0.02]'
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl relative',
          'transition-all duration-200',
          paddingClasses[padding],
          variantClasses[variant],
          hoverable && 'cursor-pointer hover:bg-white/[0.03] hover:border-white/[0.08]',
          'group',
          className
        )}
        {...props}
      >
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ noBorder = false, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'pb-3',
        !noBorder && 'border-b border-border-primary mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = 'h3', children, className, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-title-2 font-semibold text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-small text-text-tertiary mt-1',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-text-secondary', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ noBorder = false, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'pt-3',
        !noBorder && 'border-t border-border-primary mt-4',
        'flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';