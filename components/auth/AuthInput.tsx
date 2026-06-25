/**
 * @fileoverview Auth form input component with optional password toggle.
 *
 * Matches Figma design tokens:
 *   - Label: Open Sans Regular, 16px, black
 *   - Input: border #E5E5E6 (1px), border-radius 2px, padding 12px 12px 10px
 *   - Placeholder: Open Sans Regular, 14px, #848995
 *   - Password eye-off icon: Lucide `EyeOff`, 16px
 *
 * @module components/auth/AuthInput
 */

'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────

interface AuthInputProps {
  /** Visible label rendered above the input. */
  label: string;
  /** HTML `id` for the input (also used by `htmlFor` on the label). */
  id: string;
  /** Input `name` attribute for form semantics. */
  name: string;
  /**
   * Input type. When `"password"`, the eye-toggle icon is rendered.
   * @defaultValue `"text"`
   */
  type?: 'text' | 'email' | 'password';
  /** Placeholder text. */
  placeholder?: string;
  /** Controlled value. */
  value: string;
  /** Change handler. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Error message shown in red beneath the input. */
  error?: string;
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Whether this field is required. */
  required?: boolean;
  /** Additional class names for the root wrapper. */
  className?: string;
}

/**
 * Reusable labeled auth input with optional password visibility toggle.
 */
export default function AuthInput({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {/* Label */}
      <label
        htmlFor={id}
        className="text-[16px] font-normal leading-[1.2] text-black"
        style={{ fontFamily: 'Open Sans' }}
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative flex w-full items-center">
        <input
          id={id}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={isPassword ? 'current-password' : undefined}
          className={cn(
            // Figma: border #E5E5E6, radius 2px, padding 12px / 10px
            'w-full rounded-[2px] border border-[#E5E5E6] bg-white',
            'pl-[12px] pr-[12px] pb-[10px] pt-[10px]',
            // Typography: 14px Open Sans Regular, placeholder #848995
            'text-[14px] font-normal leading-[1.3] text-black',
            'placeholder:text-[#848995]',
            // Focus ring
            'outline-none transition-colors duration-150',
            'focus:border-[#165DD0] focus:ring-1 focus:ring-[#165DD0]',
            // Disabled state
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
            // Extra right padding when toggle icon is present
            isPassword && 'pr-[40px]',
            // Error state
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
          )}
          style={{ fontFamily: 'Open Sans' }}
        />

        {/* Password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-[12px] flex items-center justify-center text-[#848995] transition-colors hover:text-black focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <Eye size={16} strokeWidth={1.5} />
            ) : (
              <EyeOff size={16} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>

      {/* Inline error message */}
      {error && (
        <p className="text-[12px] font-normal leading-[1.3] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
