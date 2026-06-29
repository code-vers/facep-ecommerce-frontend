'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
  Boxes,
  ChevronUp,
  CirclePlus,
  CircleX,
  Cog,
  Coins,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Star,
  Store,
  TicketPercent,
  Truck,
  Wrench,
  User,
  LayoutTemplate,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: User },
  { name: 'Product Management', href: '/dashboard/products', icon: Boxes },
  { name: 'Add New Product', href: '/dashboard/add-new-products', icon: CirclePlus },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Shipping', href: '/dashboard/shipping', icon: Truck },
  { name: 'Returns', href: '/dashboard/returns', icon: CircleX },
  { name: 'Earning', href: '/dashboard/earning', icon: Coins },
  { name: 'Promotions & Deals', href: '/dashboard/promotions', icon: TicketPercent },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Storefront', href: '/dashboard/storefront', icon: Store },
  { name: 'Store Management', href: '/dashboard/store-management', icon: Wrench },
    { name: 'CMS', href: '/dashboard/cms', icon: LayoutTemplate },
  { name: 'Profile Settings', href: '/dashboard/profile', icon: Cog },
];

export default function DashboardSidebar({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className={`flex h-full flex-col border-r border-[#E5E5E6] bg-[#F2F2F3] ${isMobile ? 'w-full' : 'w-[280px]'}`}>
      {/* Header / Logo */}
      <div className='flex h-[80px] shrink-0 items-center gap-3 border-b border-[#E5E5E6] px-6 py-4'>
        <div className='relative flex h-9 w-9 items-center justify-center overflow-hidden rounded bg-[#0A132B] text-white'>
          {/* Using a placeholder SVG similar to the Figma one */}
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='4' y1='20' x2='20' y2='4'></line>
            <line x1='14' y1='20' x2='20' y2='14'></line>
            <line x1='4' y1='10' x2='10' y2='4'></line>
          </svg>
        </div>
        <span className='text-[22px] font-normal leading-[1.2] text-black'>Platform Name</span>
      </div>

      {/* Select Input Mockup */}
      <div className='w-full shrink-0 border-b border-[#E5E5E6] p-6 py-4'>
        <div className='flex cursor-pointer items-center justify-between rounded-sm border border-[#E5E5E6] bg-white px-3 py-2.5'>
          <span className='text-[14px] text-[#848995]'>Plant House</span>
          <ChevronUp size={20} className='rotate-180 text-[#848995]' />
        </div>
      </div>

      {/* Navigation */}
      <div className='flex flex-1 flex-col justify-between overflow-y-auto'>
        <nav className='flex flex-col gap-1 p-6'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-sm p-3 transition-colors ${
                  isActive ? 'bg-[#F09000] text-black' : 'text-black hover:bg-black/5'
                }`}
              >
                <Icon size={16} />
                <span className='text-[14px] leading-[1.3]'>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className='shrink-0 border-t border-[#E5E5E6] p-6 px-9 py-4'>
          <button
            type='button'
            onClick={logout}
            className='flex w-full items-center gap-2 rounded p-0 text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
          >
            <LogOut size={16} />
            <span className='text-[14px] leading-[1.3]'>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
