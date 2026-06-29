'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const GUEST_ROUTES = ['/login', '/register', '/forgot-password'];
const PROTECTED_ROUTES = ['/profile', '/dashboard'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const isGuestRoute = GUEST_ROUTES.some(route => pathname.startsWith(route));
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (session && isGuestRoute) {
      router.replace('/');
    } else if (!session && isProtectedRoute) {
      router.replace('/login');
    } else {
      setIsReady(true);
    }
  }, [session, isLoading, pathname, router]);

  // Optionally show a global loading state for protected routes while checking auth
  if (isLoading || !isReady) {
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    if (isProtectedRoute) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#dec33a] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[16px] font-medium">Loading...</span>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
