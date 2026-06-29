'use client';

import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';

const getPageTitle = (pathname: string) => {
  if (pathname === '/dashboard') return 'Store Overview';
  if (pathname === '/dashboard/products') return 'Product Management';
  if (pathname === '/dashboard/products/new') return 'Add New Product';
  if (pathname === '/dashboard/orders') return 'Orders';
  if (pathname === '/dashboard/shipping') return 'Shipping';
  if (pathname === '/dashboard/returns') return 'Returns';
  if (pathname === '/dashboard/earning') return 'Earning';
  if (pathname === '/dashboard/promotions') return 'Promotions & Deals';
  if (pathname === '/dashboard/reviews') return 'Reviews';
  if (pathname === '/dashboard/storefront') return 'Storefront';
  if (pathname === '/dashboard/store-management') return 'Store Management';
  if (pathname === '/dashboard/profile') return 'Profile Settings';
  return 'Store Overview';
};

export default function DashboardNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className='flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E5E6] bg-[#F2F2F3] px-4 py-4 md:px-8 xl:px-[45px] xl:py-[20px]'>
      <div className='flex items-center gap-3'>
        <button 
          onClick={onMenuClick}
          className='flex lg:hidden p-1.5 bg-white border border-[#E5E5E6] rounded-sm text-black hover:bg-gray-50'
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <h1 className='shrink-0 text-[18px] md:text-[22px] font-normal leading-[1.2] text-black'>{pageTitle}</h1>
      </div>

      {/* Search Bar */}
      <div className='flex items-stretch rounded-[4px] w-full md:w-auto order-last md:order-0'>
        <div className='flex w-full md:w-[350px] lg:w-[450px] xl:w-[695px] items-center bg-white border border-[#E5E5E6] px-[12px] py-[10px] rounded-l-[4px] border-r-0'>
          <input
            type='text'
            placeholder='Search anything'
            className='w-full bg-transparent text-[14px] leading-[1.2] text-[#42454D] outline-none placeholder:text-[#42454D] placeholder:opacity-50'
          />
        </div>
        <button
          type='button'
          className='flex items-center justify-center bg-[#F09000] px-[12px] py-[8px] rounded-r-[4px] transition-colors hover:bg-[#d88200]'
        >
          <Search size={16} className='text-black' />
        </button>
      </div>

      {/* User Info */}
      <div className='flex shrink-0 items-center gap-[12px]'>
        <div className='flex w-[168px] flex-col items-end gap-[6px] text-right'>
          <p className='w-full text-[16px] font-normal leading-[1.2] text-[#232A39]'>
            Seller Name
          </p>
          <p className='w-full text-[12px] font-normal leading-[1.3] text-[#6B7280]'>
            Seller Name@Resu.com
          </p>
        </div>
        <div className='relative h-[32px] w-[32px] shrink-0 overflow-hidden rounded-full'>
          <Image
            src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
            alt='Seller Name'
            fill
            className='object-cover'
          />
        </div>
      </div>
    </header>
  );
}
