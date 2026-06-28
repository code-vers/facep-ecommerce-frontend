'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { session, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if user session is absent
  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [session, isLoading, router]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#dec33a] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[16px] font-medium">Loading account...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* ── 1. Page Breadcrumbs & Title ── */}
      <div className="w-full border-b border-[#e5e5e6]">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-5 text-left flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[14px] text-[#848995] mb-2 font-normal">
              <Link href="/" className="hover:text-black flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-black font-medium">My Account</span>
            </div>
            <h1 className="text-[28px] font-semibold text-black leading-tight tracking-tight">
              My Profile
            </h1>
          </div>

          {/* User Role Badge */}
          <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-full px-4 py-1.5 shadow-xs">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-[13px] font-medium text-gray-700 capitalize">
              Role: <strong className="text-black">{session.role}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Sidebar + Main Content Grid Layout ── */}
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between w-full">
          {/* Sidebar */}
          <ProfileSidebar onLogout={handleLogout} />

          {/* Main Tab Panel Display */}
          <div className="flex-1 w-full">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
