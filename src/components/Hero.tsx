import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Badge } from './Badge';

export interface HeroProps {
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  description?: string | React.ReactNode;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  image?: {
    src: string;
    alt: string;
  };
  background?: 'gradient' | 'pattern' | 'image' | 'solid';
  backgroundImage?: string;
  align?: 'left' | 'center' | 'right';
  fullHeight?: boolean;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  badge,
  badgeVariant = 'default',
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  image,
  background = 'gradient',
  backgroundImage,
  align = 'center',
  fullHeight = false,
  className,
}) => {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const backgroundClasses = {
    gradient: 'bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary',
    pattern: 'bg-background-primary',
    image: 'bg-cover bg-center bg-no-repeat',
    solid: 'bg-background-primary',
  };

  const renderAction = (action: typeof primaryAction, variant: 'primary' | 'secondary') => {
    if (!action) return null;
    
    const ButtonWrapper = action.href ? 'a' : 'div';
    const buttonProps = action.href ? { href: action.href } : {};
    
    return (
      <ButtonWrapper {...buttonProps}>
        <Button
          variant={variant === 'primary' ? 'primary' : 'secondary'}
          size="lg"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      </ButtonWrapper>
    );
  };

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        fullHeight ? 'min-h-screen' : 'min-h-[600px]',
        backgroundClasses[background],
        className
      )}
      style={
        background === 'image' && backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      {/* Pattern Overlay for pattern background */}
      {background === 'pattern' && (
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Dark overlay for image background */}
      {background === 'image' && backgroundImage && (
        <div className="absolute inset-0 bg-background-primary/70" />
      )}

      <div className="relative w-full px-6 lg:px-8">
        <div className={cn(
          'mx-auto max-w-7xl',
          fullHeight ? 'flex min-h-screen items-center py-24' : 'py-24 lg:py-32'
        )}>
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Content */}
            <div className={cn('flex flex-col', alignmentClasses[align], image && 'lg:text-left lg:items-start')}>
              {badge && (
                <Badge variant={badgeVariant} className="mb-4">
                  {badge}
                </Badge>
              )}

              <h1 className="text-title-6 sm:text-title-7 lg:text-title-8 font-bold text-text-primary">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-4 text-title-2 sm:text-title-3 font-medium text-brand">
                  {subtitle}
                </p>
              )}

              {description && (
                <p className="mt-6 text-large sm:text-title-1 text-text-secondary max-w-2xl">
                  {description}
                </p>
              )}

              {(primaryAction || secondaryAction) && (
                <div className={cn(
                  'mt-8 flex flex-col sm:flex-row gap-4',
                  align === 'center' && 'justify-center',
                  align === 'right' && 'justify-end'
                )}>
                  {renderAction(primaryAction, 'primary')}
                  {renderAction(secondaryAction, 'secondary')}
                </div>
              )}
            </div>

            {/* Image */}
            {image && (
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-high">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-brand/20 blur-3xl" />
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-status-blue/20 blur-3xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export interface CTAHeroProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  background?: 'brand' | 'gradient' | 'dark';
  className?: string;
}

export const CTAHero: React.FC<CTAHeroProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  background = 'gradient',
  className,
}) => {
  const backgroundClasses = {
    brand: 'bg-brand',
    gradient: 'bg-gradient-to-r from-brand via-brand-accent to-brand-accent-hover',
    dark: 'bg-background-tertiary',
  };

  const renderAction = (action: typeof primaryAction, variant: 'white' | 'ghost') => {
    if (!action) return null;
    
    const ButtonWrapper = action.href ? 'a' : 'div';
    const buttonProps = action.href ? { href: action.href } : {};
    
    return (
      <ButtonWrapper {...buttonProps}>
        <Button
          variant={variant === 'white' ? 'secondary' : 'ghost'}
          size="lg"
          onClick={action.onClick}
          className={variant === 'white' ? 'bg-white text-brand hover:bg-gray-100' : ''}
        >
          {action.label}
        </Button>
      </ButtonWrapper>
    );
  };

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        backgroundClasses[background],
        className
      )}
    >
      <div className="w-full px-6 lg:px-8 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-title-4 sm:text-title-5 lg:text-title-6 font-bold text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-6 text-large sm:text-title-1 text-white/90 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {renderAction(primaryAction, 'white')}
              {renderAction(secondaryAction, 'ghost')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};