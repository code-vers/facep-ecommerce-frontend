'use client';

import { ReactNode, useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='flex h-screen w-full overflow-hidden bg-white'>
      {/* Sidebar - Desktop */}
      <div className='hidden lg:block'>
        <DashboardSidebar />
      </div>

      {/* Sidebar - Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-50 flex lg:hidden'>
          {/* Overlay */}
          <div 
            className='fixed inset-0 bg-black/50' 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className='relative z-50 flex h-full w-[280px] flex-col bg-[#F2F2F3] shadow-xl'>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className='absolute right-4 top-4 rounded-sm bg-white p-1 text-black shadow-sm'
            >
              <X size={20} />
            </button>
            <DashboardSidebar isMobile />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <DashboardNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        {/* Adjusted padding for mobile/sm as requested */}
        <main className='flex-1 overflow-y-auto bg-white p-2 sm:p-4 lg:p-0'>
          {children}
        </main>
      </div>
    </div>
  );
}
