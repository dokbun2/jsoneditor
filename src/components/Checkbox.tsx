import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className, disabled, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              'mt-0.5 h-5 w-5 rounded-lg appearance-none cursor-pointer',
              'bg-white/10 backdrop-blur-xl',
              'border-2 border-white/20',
              'transition-all duration-300',
              'hover:border-purple-400/50 hover:bg-white/20',
              'checked:bg-gradient-to-r checked:from-purple-500 checked:to-blue-500',
              'checked:border-transparent',
              'focus:outline-none focus:ring-2 focus:ring-purple-400/30',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              hasError && 'border-red-400 focus:border-red-400 focus:ring-red-400/30',
              'relative',
              'after:content-[""] after:absolute after:hidden after:checked:block',
              'after:left-1.5 after:top-0.5 after:w-2 after:h-3',
              'after:border-white after:border-r-2 after:border-b-2',
              'after:rotate-45',
              className
            )}
            disabled={disabled}
            {...props}
          />
          {label && (
            <span className={cn(
              'text-small text-text-primary',
              disabled && 'opacity-40'
            )}>
              {label}
            </span>
          )}
        </label>
        {(error || helperText) && (
          <p
            className={cn(
              'text-mini ml-6',
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

Checkbox.displayName = 'Checkbox';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, helperText, className, disabled, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            ref={ref}
            type="radio"
            className={cn(
              'mt-0.5 h-5 w-5 appearance-none cursor-pointer',
              'bg-white/10 backdrop-blur-xl rounded-full',
              'border-2 border-white/20',
              'transition-all duration-300',
              'hover:border-purple-400/50 hover:bg-white/20',
              'checked:bg-gradient-to-r checked:from-purple-500 checked:to-blue-500',
              'checked:border-transparent',
              'focus:outline-none focus:ring-2 focus:ring-purple-400/30',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              hasError && 'border-red-400 focus:border-red-400 focus:ring-red-400/30',
              'relative',
              'after:content-[""] after:absolute after:hidden after:checked:block',
              'after:left-1 after:top-1 after:w-2.5 after:h-2.5',
              'after:bg-white after:rounded-full',
              className
            )}
            disabled={disabled}
            {...props}
          />
          {label && (
            <span className={cn(
              'text-small text-text-primary',
              disabled && 'opacity-40'
            )}>
              {label}
            </span>
          )}
        </label>
        {(error || helperText) && (
          <p
            className={cn(
              'text-mini ml-6',
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

Radio.displayName = 'Radio';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, helperText, className, disabled, checked, onChange, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only"
              disabled={disabled}
              checked={checked}
              onChange={onChange}
              {...props}
            />
            <div
              className={cn(
                'h-6 w-11 rounded-full relative',
                'transition-all duration-300',
                checked ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-white/10 backdrop-blur-xl',
                'border-2',
                checked ? 'border-transparent' : 'border-white/20',
                'shadow-lg',
                checked ? 'shadow-purple-500/30' : 'shadow-black/20',
                disabled && 'opacity-40 cursor-not-allowed',
                className
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 h-4 w-4 rounded-full',
                  'bg-white shadow-lg',
                  'transition-all duration-300',
                  checked ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </div>
          {label && (
            <span className={cn(
              'text-small text-text-primary',
              disabled && 'opacity-40'
            )}>
              {label}
            </span>
          )}
        </label>
        {helperText && (
          <p className="text-mini text-text-quaternary ml-12">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';