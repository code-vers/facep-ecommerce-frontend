/**
 * @fileoverview Demo credential quick-login card.
 *
 * Displayed at the bottom of the Login page (below the main auth card)
 * to allow testers to log in instantly as a pre-seeded demo user with
 * a single click.
 *
 * Design: Small bordered card (border #E5E5E6, radius 6px) with a role
 * badge, email + password hint, and a "Use this account" button. The
 * card uses a subtle left-accent color bar to distinguish Buyer (yellow)
 * from Vendor (orange).
 *
 * @module components/auth/DemoCredentialCard
 */

'use client';

import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────

interface DemoCredentialCardProps {
  /** Human-readable role label. */
  role: 'Buyer' | 'Vendor' | 'Admin';
  /** Pre-filled email. */
  email: string;
  /** Pre-filled password (shown masked). */
  password: string;
  /** Called when the user clicks "Use this account". */
  onSelect: () => void;
  /** Whether the login operation is in progress. */
  isLoading?: boolean;
}

/**
 * A compact card showing demo credentials for quick testing access.
 * Clicking it instantly logs in as the selected demo user.
 */
export default function DemoCredentialCard({
  role,
  email,
  password,
  onSelect,
  isLoading = false,
}: DemoCredentialCardProps) {
  const isBuyer = role === 'Buyer';
  const accentColor = isBuyer ? '#DEC33A' : '#F59E0B';
  const badgeBg = isBuyer ? 'bg-[#DEC33A]' : 'bg-[#F59E0B]';

  return (
    <div
      className={cn(
        'relative flex w-full flex-col gap-3 overflow-hidden rounded-[6px]',
        'border border-[#E5E5E6] bg-white p-4',
        'transition-shadow duration-200 hover:shadow-md',
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-[4px] rounded-l-[6px]"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="pl-2">
        {/* Role badge */}
        <div className="mb-2 flex items-center gap-2">
          <span
            className={cn(
              'rounded-[2px] px-[8px] py-[2px]',
              'text-[11px] font-bold leading-[1.3] text-black',
              badgeBg,
            )}
          >
            {role}
          </span>
          <span className="text-[12px] font-bold text-black leading-[1.3]">
            Demo Account
          </span>
        </div>

        {/* Credentials */}
        <div className="flex flex-col gap-1 text-[12px] text-[#42454D]" style={{ fontFamily: 'Open Sans' }}>
          <div className="flex items-center gap-2">
            <span className="w-[56px] shrink-0 font-semibold text-black">Email</span>
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[56px] shrink-0 font-semibold text-black">Password</span>
            <span>{password.replace(/./g, '•')}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onSelect}
        disabled={isLoading}
        className={cn(
          'ml-2 flex h-[32px] items-center justify-center rounded-[2px]',
          'border text-[12px] font-normal leading-[1.3] transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-60',
          isBuyer
            ? 'border-[#DEC33A] bg-[#DEC33A] text-black hover:bg-[#C9B034] focus-visible:ring-[#DEC33A]'
            : 'border-[#F59E0B] bg-[#F59E0B] text-black hover:bg-[#D97706] focus-visible:ring-[#F59E0B]',
        )}
        style={{ fontFamily: 'Open Sans' }}
      >
        {isLoading ? 'Signing in…' : 'Use this account →'}
      </button>
    </div>
  );
}
