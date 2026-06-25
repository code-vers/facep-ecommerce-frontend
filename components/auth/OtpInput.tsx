/**
 * @fileoverview 6-digit OTP (One-Time Password) input component.
 *
 * Renders 6 individual single-character input boxes matching Figma node
 * 2237-7462 (Verify Identity screen). Features:
 *   - Auto-advances focus to the next box on character input
 *   - Backspace moves focus to the previous box
 *   - Paste support — distributes pasted digits across boxes
 *   - Only accepts numeric characters (0–9)
 *
 * Each box: border #E5E5E6, radius 2px, size approximately 60px × 44px,
 * text centred, 14px Open Sans.
 *
 * @module components/auth/OtpInput
 */

'use client';

import { cn } from '@/lib/utils';
import { useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────

interface OtpInputProps {
  /** Array of 6 single-character strings (empty string = unfilled). */
  value: string[];
  /** Called whenever a digit changes. Receives the updated 6-item array. */
  onChange: (value: string[]) => void;
  /** Whether the inputs are disabled. */
  disabled?: boolean;
}

const OTP_LENGTH = 6;

/**
 * Six-box numeric OTP input with auto-focus-advance and paste support.
 */
export default function OtpInput({ value, onChange, disabled = false }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>(
    Array.from({ length: OTP_LENGTH }, () => null),
  );

  const focusBox = (index: number) => {
    if (index >= 0 && index < OTP_LENGTH) {
      refs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, char: string) => {
    // Allow only a single digit
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);

    // Advance focus if a digit was entered
    if (digit && index < OTP_LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        // Clear current box first
        const next = [...value];
        next[index] = '';
        onChange(next);
      } else {
        // Move focus back and clear previous
        focusBox(index - 1);
        const next = [...value];
        next[index - 1] = '';
        onChange(next);
      }
    } else if (e.key === 'ArrowLeft') {
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight') {
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    const next = [...value];
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    onChange(next);
    // Focus the box after the last pasted digit
    focusBox(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div className="flex w-full items-center gap-[8px]" role="group" aria-label="One-time password">
      {Array.from({ length: OTP_LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
          className={cn(
            // Each box: flex-1 so they share the full container width
            'flex-1 rounded-[2px] border border-[#E5E5E6] bg-white',
            'h-[44px] text-center',
            'text-[14px] font-normal leading-[1.3] text-black',
            'outline-none transition-colors duration-150',
            'focus:border-[#165DD0] focus:ring-1 focus:ring-[#165DD0]',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
          style={{ fontFamily: 'Open Sans' }}
        />
      ))}
    </div>
  );
}
