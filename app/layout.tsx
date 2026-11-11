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
// import { ProductModalProvider } from '@/contexts/ProductModalContext';
// import MobileProductModal from '@/components/product-modal/MobileProductModal';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Many Products Many faces',
    template: '%s | Many Products Many faces',
  },
  description:
    'Many Products Many faces — Discover top deals, trending electronics, fashion, home essentials, and verified store brands.',
  applicationName: 'Many Products Many faces',
  keywords: [
    'Many Products Many faces',
    'Facep',
    'E-commerce',
    'Online Shopping',
    'Early Deals',
    'Special Products',
    'Buy Again',
    'Coupons',
  ],
  icons: {
    icon: [
      { url: '/logo.jpg', type: 'image/jpeg' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/logo.jpg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Many Products Many faces',
    description:
      'Many Products Many faces — Discover top deals, trending electronics, fashion, home essentials, and verified store brands.',
    url: '/',
    siteName: 'Many Products Many faces',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 848,
        alt: 'Many Products Many faces Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Many Products Many faces',
    description:
      'Many Products Many faces — Discover top deals, trending electronics, fashion, home essentials, and verified store brands.',
    images: ['/logo.jpg'],
  },
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
              {/* Mobile product modal quick-view (commented out to restore previous product details page) */}
              {/* <ProductModalProvider> */}
                <SiteChrome>{children}</SiteChrome>
                {/* <MobileProductModal /> */}
              {/* </ProductModalProvider> */}
            </AuthGuard>
          </AuthProvider>
        </QueryProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
