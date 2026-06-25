/**
 * @fileoverview Auth button components.
 *
 * Two variants matching Figma:
 *
 * - `primary`   – Filled yellow (#DEC33A) full-width button. Used for primary
 *                 CTA actions (Login, Create Account, Send Reset Link, etc.).
 * - `secondary` – Outlined button with border #686F7D, height 36px. Used for
 *                 the "Don't have an account? Create One" row.
 * - `vendor`    – Orange (#F59E0B) variant used exclusively for the vendor
 *                 registration CTA ("Create Vendor Account").
 *
 * @module components/auth/AuthButton
 */

import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────

type AuthButtonVariant = 'primary' | 'secondary' | 'vendor';

interface AuthButtonProps {
  /** Button label. Can contain JSX for rich text (e.g. coloured spans). */
  children: React.ReactNode;
  /**
   * Visual variant.
   * @defaultValue `"primary"`
   */
  variant?: AuthButtonVariant;
  /** HTML button type. @defaultValue `"button"` */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler. */
  onClick?: () => void;
  /** Whether the button is in a loading / disabled state. */
  disabled?: boolean;
  /** Whether to show a loading spinner. */
  isLoading?: boolean;
  /** Additional class names. */
  className?: string;
}

/**
 * Reusable auth CTA button in primary (yellow), secondary (outlined), or
 * vendor (orange) variants.
 */
export default function AuthButton({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  className,
}: AuthButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isVendor = variant === 'vendor';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        // Base
        'relative flex w-full items-center justify-center overflow-hidden rounded-[2px]',
        'text-[16px] font-normal leading-[1.2] transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-60',
        // Open Sans font family
        'font-[Open_Sans]',

        // Primary: yellow fill — Figma py-[12px], border #DEC33A
        isPrimary && [
          'border border-[#DEC33A] bg-[#DEC33A] px-[16px] py-[12px] text-black',
          'hover:bg-[#C9B034] hover:border-[#C9B034]',
          'active:bg-[#B49A2E]',
          'focus-visible:ring-[#DEC33A]',
        ],

        // Secondary: outlined — Figma h-[36px], border #686F7D
        isSecondary && [
          'h-[36px] border border-[#686F7D] bg-white px-[8px] text-black',
          'hover:bg-gray-50',
          'focus-visible:ring-[#686F7D]',
        ],

        // Vendor: orange fill — distinct from buyer yellow
        isVendor && [
          'border border-[#F59E0B] bg-[#F59E0B] px-[16px] py-[12px] text-black',
          'hover:bg-[#D97706] hover:border-[#D97706]',
          'active:bg-[#B45309]',
          'focus-visible:ring-[#F59E0B]',
        ],

        className,
      )}
      style={{ fontFamily: 'Open Sans' }}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="size-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
