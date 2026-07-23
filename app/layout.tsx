/**
 * @fileoverview Root application layout.
 *
 * Provides:
 *   - HTML shell with font variables
 *   - AuthProvider (available to ALL routes including auth pages)
 *   - SiteChrome (conditionally renders Navbar/Footer only on non-auth routes)
 *
 * Auth pages (`/login`, `/register`, etc.) are in the `(auth)` route group.
 * They render without Navbar/Footer via the `SiteChrome` conditional logic.
 */

import type { Metadata } from 'next';
import { Geist_Mono, Open_Sans, Geist } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import SiteChrome from '@/components/shared/SiteChrome';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/QueryProvider';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Facep',
  description: 'Facep storefront interface',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        openSans.variable,
        geistMono.variable,
        'font-sans',
        geist.variable,
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>
            <AuthGuard>
              <SiteChrome>{children}</SiteChrome>
            </AuthGuard>
          </AuthProvider>
        </QueryProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
