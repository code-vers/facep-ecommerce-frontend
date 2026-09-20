/**
 * @fileoverview Auth page card shell component.
 *
 * Renders the outer logo header and the white bordered card used on every
 * auth page. Matches Figma specs:
 *   - Outer container: max-width 800px, gap 64px between logo and card
 *   - Card: border #CACBCE (1px), border-radius 6px, padding 40px
 *   - Logo: icon 60px + "Logo" text in Arial Bold 64px
 *
 * @module components/auth/AuthCard
 */

import Image from 'next/image';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────

interface AuthCardProps {
  children: React.ReactNode;
}

/**
 * Wraps auth page content with the logo header and bordered card shell.
 *
 * @example
 * ```tsx
 * <AuthCard>
 *   <h1>Login</h1>
 *   {/* ... form fields * /}
 * </AuthCard>
 * ```
 */
export default function AuthCard({ children }: AuthCardProps) {
  return (
    /*
     * Full-screen centering wrapper.
     * Figma shows the card vertically centered with the logo above it,
     * roughly at 50% height (offset by ~58px). We use flexbox centering
     * with min-h to replicate this naturally and responsively.
     */
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-200 flex-col items-center gap-16">
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-4 sm:gap-5 transition-opacity hover:opacity-90"
          aria-label="Facep home"
        >
          <div className="relative h-14 w-22 sm:h-16 sm:w-26 shrink-0 overflow-hidden rounded-lg bg-black shadow-sm">
            <Image
              src="/logo.jpg"
              alt="Facep logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          {/* <span
            className="whitespace-nowrap text-[36px] sm:text-[44px] font-bold capitalize leading-none text-black"
            style={{ fontFamily: 'Arial', letterSpacing: '-1.5px' }}
          >
            Facep
          </span> */}
        </Link>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        {/*
         * Figma: bg white, border 1px #CACBCE, border-radius 6px, padding 40px.
         */}
        <div className="w-full rounded-[6px] border border-[#CACBCE] bg-white p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
