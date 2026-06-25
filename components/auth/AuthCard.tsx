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

// ─── Assets ──────────────────────────────────────────────────────────────────

/** Figma: Shadcn-style logo icon (filled square with slash). */
const LOGO_ICON_SRC = 'http://localhost:3845/assets/c7dccfac2c38409253b30c61d18b8732759fefa6.svg';

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
      <div className="flex w-full max-w-[800px] flex-col items-center gap-16">
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        {/*
         * Figma: 60px icon + "Logo" text at 64px Arial Bold.
         * Gap between them: 36px.
         * Letter-spacing: -1.92px.
         */}
        <div className="flex items-center gap-9">
          <div className="relative size-[60px] shrink-0 overflow-hidden">
            <Image
              src={LOGO_ICON_SRC}
              alt="Facep logo"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <span
            className="whitespace-nowrap text-[64px] font-bold capitalize leading-none text-black"
            style={{ fontFamily: 'Arial', letterSpacing: '-1.92px' }}
          >
            Logo
          </span>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        {/*
         * Figma: bg white, border 1px #CACBCE, border-radius 6px, padding 40px.
         */}
        <div className="w-full rounded-[6px] border border-[#CACBCE] bg-white p-[40px]">
          {children}
        </div>
      </div>
    </div>
  );
}
