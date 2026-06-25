/**
 * @fileoverview Isolated layout for all auth pages.
 *
 * Auth pages (login, register, forgot-password, etc.) intentionally
 * render without the main application chrome — no Navbar, no TopNavLinks,
 * and no Footer. This layout provides a clean full-screen white canvas
 * matching the Figma designs for all 7 auth screens.
 *
 * Route group `(auth)` is invisible in the URL — pages inside it remain
 * at `/login`, `/register`, etc. The only purpose of the group is to
 * attach this layout exclusively to auth routes.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facep — Account',
  description: 'Sign in or create your Facep account.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white">
      {children}
    </div>
  );
}
