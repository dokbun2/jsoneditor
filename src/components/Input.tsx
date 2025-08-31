import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="text-small font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'h-11 w-full rounded-xl',
              'bg-white/5 backdrop-blur-xl',
              'border-2 border-white/10',
              'px-4 text-sm text-white',
              'placeholder:text-gray-400',
              'transition-all duration-300 ease-out',
              'hover:border-purple-400/30 hover:bg-white/10',
              'focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30',
              'focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              hasError && 'border-red-400 focus:border-red-400 focus:ring-red-400/30 bg-red-500/5',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              className
            )}
            disabled={disabled}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              'text-mini',
              hasError ? 'text-status-red' : 'text-text-quaternary'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="text-small font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'min-h-[100px] w-full rounded-lg resize-y',
            'bg-white/[0.02]',
            'border border-white/[0.08]',
            'px-3.5 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-quaternary',
            'transition-all duration-200',
            'hover:border-white/[0.12] hover:bg-white/[0.03]',
            'focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
            'focus:bg-white/[0.03]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:resize-none',
            hasError && 'border-status-error/50 focus:border-status-error/50 focus:ring-status-error/20 bg-status-errorLight',
            className
          )}
          disabled={disabled}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={cn(
              'text-mini',
              hasError ? 'text-status-red' : 'text-text-quaternary'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';