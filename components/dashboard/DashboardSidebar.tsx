'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
    Banknote,
    Boxes,
    ChevronDown,
    CirclePlus,
    Cog,
    Coins,
    FilePlusCorner,
    Gamepad2,
    Gift,
    Apple,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    ShoppingBag,
    Sparkles,
    Star,
    Store,
    Ticket,
    TicketPercent,
    Truck,
    User,
    Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavSubItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children?: NavSubItem[];
}

const vendorNavItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Product Management', href: '/dashboard/products', icon: Boxes },
  { name: 'Add New Product', href: '/dashboard/add-new-products', icon: CirclePlus },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  // { name: 'Shipping', href: '/dashboard/shipping', icon: Truck },
  // { name: 'Returns', href: '/dashboard/returns', icon: CircleX },
  { name: 'Earning', href: '/dashboard/earning', icon: Coins },
  { name: 'Promotions & Deals', href: '/dashboard/promotions', icon: TicketPercent },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Storefront', href: '/dashboard/storefront', icon: Store },
  { name: 'Store Management', href: '/dashboard/store-management', icon: Wrench },
  { name: 'Settings', href: '/dashboard/profile', icon: Cog },
];

const adminNavItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: User },
  { name: 'Vendors', href: '/dashboard/vendors', icon: Store },
  { name: 'Product Management', href: '/dashboard/products', icon: Boxes },
  {
    name: 'Special Campaigns',
    icon: Sparkles,
    children: [
      { name: 'Early Deals', href: '/dashboard/early-deals', icon: Sparkles },
      { name: 'Special Products', href: '/dashboard/special-products', icon: Star },
      { name: 'Holiday Deals', href: '/dashboard/holiday-deals', icon: Gift },
      { name: 'Toys & Games', href: '/dashboard/toys-and-games', icon: Gamepad2 },
      { name: 'Groceries', href: '/dashboard/groceries', icon: Apple },
    ],
  },
  { name: 'Categories', href: '/dashboard/categories', icon: FilePlusCorner },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Payout Requests', href: '/dashboard/payouts', icon: Banknote },
  // { name: 'Returns & Refunds', href: '/dashboard/returns', icon: CircleX },
  { name: 'Shipping', href: '/dashboard/shipping', icon: Truck },
  { name: 'Coupons', href: '/dashboard/coupons', icon: Ticket },
  { name: 'Promotions & Deals', href: '/dashboard/promotions', icon: TicketPercent },
  { name: 'Support Inquiries', href: '/dashboard/support', icon: MessageSquare },
  // { name: 'CMS', href: '/dashboard/cms', icon: LayoutTemplate },
  { name: 'Settings', href: '/dashboard/profile', icon: Cog },
];

export default function DashboardSidebar({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const isAdmin = session?.user?.role === 'ADMIN';

  const visibleNavItems = isAdmin ? adminNavItems : vendorNavItems;

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    'Special Campaigns': true,
  });

  // Automatically expand parent submenu if current route matches one of its children
  useEffect(() => {
    visibleNavItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => pathname === child.href || pathname.startsWith(child.href + '/')
        );
        if (hasActiveChild) {
          setOpenSubmenus((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname, visibleNavItems]);

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <aside
      className={`flex h-full flex-col border-r border-[#E5E5E6] bg-[#F2F2F3] ${isMobile ? 'w-full' : 'w-70'}`}
    >
      {/* Header / Logo */}
      <Link
        href='/'
        className='flex h-20 shrink-0 items-center gap-3 border-b border-[#E5E5E6] px-6 py-4 transition-colors hover:bg-black/5'
        aria-label='Facep home'
      >
        <div className='relative h-9 w-26 shrink-0 overflow-hidden rounded bg-white p-1'>
          <Image
            src='/logo.jpg'
            alt='Facep logo'
            fill
            className='object-contain'
          />
        </div>
        <div className='flex flex-col'>
          <span className='text-[11px] font-medium text-gray-500 uppercase tracking-wider'>
            {isAdmin ? 'Admin Dashboard' : 'Vendor Dashboard'}
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <div className='flex flex-1 flex-col justify-between overflow-y-auto'>
        <nav className='flex flex-col gap-1 p-6'>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;

            if (item.children && item.children.length > 0) {
              const isExpanded = Boolean(openSubmenus[item.name]);
              const hasActiveChild = item.children.some(
                (child) => pathname === child.href || pathname.startsWith(child.href + '/')
              );

              return (
                <div key={item.name} className='flex flex-col'>
                  <button
                    type='button'
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex w-full items-center justify-between rounded-sm p-3 transition-colors cursor-pointer ${
                      hasActiveChild
                        ? 'bg-black/5 font-semibold text-black'
                        : 'text-black hover:bg-black/5'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <Icon size={16} className={hasActiveChild ? 'text-[#DEC33A]' : ''} />
                      <span className='text-[14px] leading-[1.3]'>{item.name}</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700'>
                        {item.children.length}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Submenu Children */}
                  {isExpanded && (
                    <div className='ml-4 mt-1 flex flex-col gap-1 border-l-2 border-[#E5E5E6] pl-2 animate-in fade-in slide-in-from-top-1 duration-150'>
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        const ChildIcon = child.icon;

                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center gap-2 rounded-sm px-3 py-2 text-[13px] transition-colors ${
                              isChildActive
                                ? 'bg-[#F09000] font-semibold text-black shadow-2xs'
                                : 'text-[#42454D] hover:bg-black/5 hover:text-black'
                            }`}
                          >
                            {ChildIcon && <ChildIcon size={14} className='shrink-0' />}
                            <span className='leading-tight'>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href!}
                className={`flex items-center gap-2 rounded-sm p-3 transition-colors ${
                  isActive ? 'bg-[#F09000] text-black font-semibold' : 'text-black hover:bg-black/5'
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

