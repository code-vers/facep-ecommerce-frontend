'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ROLE_REDIRECT } from '@/lib/auth/auth.constants';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const GUEST_ROUTES = ['/login', '/register', '/forgot-password'];
const PROTECTED_ROUTES = ['/profile', '/dashboard'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isGuestRoute = GUEST_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  const willRedirect =
    (!isLoading && session && isGuestRoute) || (!isLoading && !session && isProtectedRoute);

  useEffect(() => {
    if (isLoading) return;

    if (session && isGuestRoute) {
      const dest = ROLE_REDIRECT[session.user.role] ?? '/';
      router.replace(dest);
    } else if (!session && isProtectedRoute) {
      router.replace('/login');
    }
  }, [session, isLoading, isGuestRoute, isProtectedRoute, router]);

  // Show a global loading state for protected routes while checking auth or redirecting
  if (isLoading || willRedirect) {
    if (isProtectedRoute) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-white text-black font-sans'>
          <div className='flex flex-col items-center gap-4'>
            <div className='w-10 h-10 border-4 border-[#dec33a] border-t-transparent rounded-full animate-spin'></div>
            <span className='text-[16px] font-medium'>Loading...</span>
          </div>
        </div>
      );
    }
    // Prevent flash of content on guest routes when redirecting to dashboard
    if (willRedirect) {
      return null;
    }
  }

  return <>{children}</>;
}
