/**
 * @fileoverview Conditional site chrome wrapper.
 *
 * Reads the current pathname and renders the Navbar, TopNavLinks, and Footer
 * only for non-auth routes. Auth pages (`/login`, `/register`, etc.) get a
 * clean full-screen canvas.
 *
 * This is a Client Component because it uses `usePathname()`.
 *
 * @module components/shared/SiteChrome
 */

'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import TopNavLinks from './TopNavLinks';
import Footer from './Footer';

/** Path prefixes that should NOT show the site Navbar/Footer. */
const NO_CHROME_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-otp',
  '/set-new-password',
  '/dashboard',
];

interface SiteChromeProps {
  children: React.ReactNode;
}

/**
 * Wraps children with Navbar + Footer for non-auth routes.
 * Auth route children are rendered as-is.
 */
export default function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  const isNoChromePage = NO_CHROME_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isNoChromePage) {
    // Pages without chrome: just render children — the respective layout provides
    // the layout structure (e.g., dashboard layout or auth layout).
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
        <TopNavLinks />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
