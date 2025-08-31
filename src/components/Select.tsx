import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      fullWidth = false,
      className,
      disabled,
      value,
      defaultValue,
      onChange,
      name,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hasError = !!error;

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    useEffect(() => {
      if (!isOpen) return;

      const updatePosition = () => {
        if (!selectRef.current || !dropdownRef.current) return;

        const selectRect = selectRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - selectRect.bottom;
        const spaceAbove = selectRect.top;

        if (spaceBelow < dropdownHeight + 10 && spaceAbove > dropdownHeight + 10) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isOpen]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      if (!disabled) {
        setSelectedValue(optionValue);
        setIsOpen(false);
        onChange?.(optionValue);
      }
    };

    const selectedOption = options.find(option => option.value === selectedValue);

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="text-small font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative" ref={selectRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'h-11 w-full rounded-xl',
              'bg-white/5 backdrop-blur-xl',
              'border-2 border-white/10',
              'px-4 pr-11 text-sm text-left',
              'transition-all duration-300 ease-out',
              'hover:border-purple-400/30 hover:bg-white/10',
              'focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30',
              'focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              hasError && 'border-red-400 focus:border-red-400 focus:ring-red-400/30 bg-red-500/5',
              !selectedValue && 'text-gray-400',
              selectedValue && 'text-white',
              isOpen && 'border-purple-400 ring-2 ring-purple-400/30',
              className
            )}
            disabled={disabled}
            {...props}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </button>
          
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                'text-gray-400 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {isOpen && (
            <div
              ref={dropdownRef}
              className={cn(
                'absolute z-50 w-full mt-2',
                'bg-gray-900/95 backdrop-blur-xl',
                'border-2 border-white/10 rounded-xl',
                'shadow-2xl shadow-purple-500/10',
                'overflow-hidden',
                'animate-in fade-in-0 zoom-in-95 duration-200',
                dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full'
              )}
            >
              <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/20 scrollbar-track-transparent">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={cn(
                      'w-full px-4 py-2.5 text-left text-sm',
                      'transition-all duration-200',
                      'hover:bg-purple-400/10 hover:text-purple-300',
                      'focus:bg-purple-400/10 focus:text-purple-300 focus:outline-none',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      option.value === selectedValue && 'bg-purple-400/20 text-purple-300',
                      option.disabled ? 'text-gray-500' : 'text-gray-300'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {name && (
          <input
            type="hidden"
            name={name}
            value={selectedValue}
          />
        )}
        
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

Select.displayName = 'Select';