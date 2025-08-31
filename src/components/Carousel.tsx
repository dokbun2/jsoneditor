import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface CarouselSlide {
  id: string;
  content: React.ReactNode;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showControls?: boolean;
  height?: string;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoPlay = false,
  autoPlayInterval = 5000,
  showIndicators = true,
  showControls = true,
  height = 'h-96',
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (autoPlay && !isHovered && slides.length > 1) {
      const interval = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, goToNext, isHovered, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-lg bg-background-secondary', height, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out-cubic"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0">
            {slide.content}
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2',
              'h-10 w-10 rounded-full',
              'bg-background-primary/80 backdrop-blur-sm',
              'border border-border-secondary',
              'flex items-center justify-center',
              'text-text-secondary hover:text-text-primary',
              'transition-all duration-quick',
              'hover:bg-background-secondary',
              'focus:outline-none focus:ring-2 focus:ring-brand/50'
            )}
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'h-10 w-10 rounded-full',
              'bg-background-primary/80 backdrop-blur-sm',
              'border border-border-secondary',
              'flex items-center justify-center',
              'text-text-secondary hover:text-text-primary',
              'transition-all duration-quick',
              'hover:bg-background-secondary',
              'focus:outline-none focus:ring-2 focus:ring-brand/50'
            )}
            aria-label="Next slide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-quick',
                'focus:outline-none focus:ring-2 focus:ring-brand/50',
                index === currentIndex
                  ? 'w-8 bg-brand'
                  : 'w-2 bg-text-quaternary hover:bg-text-tertiary'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export interface ImageCarouselProps extends Omit<CarouselProps, 'slides'> {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  ...props
}) => {
  const slides: CarouselSlide[] = images.map((image, index) => ({
    id: `image-${index}`,
    content: (
      <div className="relative h-full w-full">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover"
        />
        {image.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background-primary/90 to-transparent p-6">
            <p className="text-regular font-medium text-text-primary">
              {image.caption}
            </p>
          </div>
        )}
      </div>
    ),
  }));

  return <Carousel slides={slides} {...props} />;
};