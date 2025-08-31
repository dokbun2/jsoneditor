import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Badge } from './Badge';
import { Avatar } from './Avatar';

export interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
  hoverable?: boolean;
}

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  (
    {
      image,
      title,
      description,
      badge,
      badgeVariant = 'default',
      author,
      stats,
      aspectRatio = 'video',
      hoverable = true,
      className,
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[21/9]',
      tall: 'aspect-[3/4]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'group overflow-hidden rounded-lg',
          'bg-background-secondary border border-border-primary',
          'transition-all duration-quick ease-out-quad',
          hoverable && 'cursor-pointer hover:border-border-secondary hover:shadow-medium',
          className
        )}
        {...props}
      >
        {/* Image Container */}
        <div className={cn('relative overflow-hidden bg-background-tertiary', aspectRatioClasses[aspectRatio])}>
          <img
            src={image.src}
            alt={image.alt}
            className={cn(
              'h-full w-full object-cover',
              'transition-transform duration-regular ease-out-cubic',
              hoverable && 'group-hover:scale-105'
            )}
          />
          {badge && (
            <div className="absolute top-3 left-3">
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-regular font-semibold text-text-primary line-clamp-2">
            {title}
          </h3>
          
          {description && (
            <p className="mt-2 text-small text-text-secondary line-clamp-3">
              {description}
            </p>
          )}

          {/* Author */}
          {author && (
            <div className="mt-4 flex items-center gap-3">
              <Avatar
                size="sm"
                src={author.avatar}
                fallback={author.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-small font-medium text-text-primary truncate">
                  {author.name}
                </p>
                {author.role && (
                  <p className="text-mini text-text-tertiary truncate">
                    {author.role}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="mt-4 flex items-center gap-4 border-t border-border-primary pt-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="text-mini text-text-tertiary">{stat.label}</span>
                  <span className="text-small font-medium text-text-secondary">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ImageCard.displayName = 'ImageCard';

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: {
    src: string;
    alt: string;
  };
  name: string;
  price: string | number;
  originalPrice?: string | number;
  rating?: number;
  reviews?: number;
  badge?: string;
  hoverable?: boolean;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      image,
      name,
      price,
      originalPrice,
      rating,
      reviews,
      badge,
      hoverable = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group overflow-hidden rounded-lg',
          'bg-background-secondary border border-border-primary',
          'transition-all duration-quick ease-out-quad',
          hoverable && 'cursor-pointer hover:border-border-secondary hover:shadow-medium',
          className
        )}
        {...props}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-background-tertiary">
          <img
            src={image.src}
            alt={image.alt}
            className={cn(
              'h-full w-full object-cover',
              'transition-transform duration-regular ease-out-cubic',
              hoverable && 'group-hover:scale-105'
            )}
          />
          {badge && (
            <div className="absolute top-3 right-3">
              <Badge variant="danger" size="sm">
                {badge}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-regular font-medium text-text-primary line-clamp-2">
            {name}
          </h3>

          {/* Rating */}
          {rating !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.floor(rating)
                        ? 'text-status-yellow fill-current'
                        : 'text-text-quaternary'
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {reviews !== undefined && (
                <span className="text-mini text-text-tertiary">
                  ({reviews})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-large font-semibold text-text-primary">
              ${typeof price === 'number' ? price.toFixed(2) : price}
            </span>
            {originalPrice && (
              <span className="text-small text-text-tertiary line-through">
                ${typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';