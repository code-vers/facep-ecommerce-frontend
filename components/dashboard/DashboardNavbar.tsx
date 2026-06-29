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

export default function DashboardNavbar() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className='flex items-center justify-between border-b border-[#E5E5E6] bg-[#F2F2F3] px-[45px] py-[20px]'>
      <h1 className='shrink-0 text-[22px] font-normal leading-[1.2] text-black'>{pageTitle}</h1>

      {/* Search Bar matching Figma exactly */}
      <div className='flex items-stretch rounded-[4px] shrink-0'>
        <div className='flex w-[695px] items-center bg-white border border-[#E5E5E6] px-[12px] py-[10px] rounded-l-[4px] border-r-0'>
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
