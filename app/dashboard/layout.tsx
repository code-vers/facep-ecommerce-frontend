import { ReactNode } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-white'>
      {/* Sidebar - hidden on mobile, visible on lg screens */}
      <div className='hidden lg:block'>
        <DashboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <DashboardNavbar />
        
        <main className='flex-1 overflow-y-auto bg-white p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
