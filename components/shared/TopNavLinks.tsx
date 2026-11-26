'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import AllCategoriesDrawer from '@/components/shared/AllCategoriesDrawer';
import TopNavItem from './top-nav/TopNavItem';
import EarlyDealsPopover from './top-nav/EarlyDealsPopover';
import HolidayDealsPopover from './top-nav/HolidayDealsPopover';
import SpecialProductsPopover from './top-nav/SpecialProductsPopover';
import OrdersPopover from './top-nav/OrdersPopover';
import BuyAgainPopover from './top-nav/BuyAgainPopover';
import BrowsingHistoryPopover from './top-nav/BrowsingHistoryPopover';
import ToysAndGamesPopover from './top-nav/ToysAndGamesPopover';
import GroceriesPopover from './top-nav/GroceriesPopover';

export type NavDropdownType =
  | 'early'
  | 'holiday'
  | 'special'
  | 'orders'
  | 'buy-again'
  | 'history'
  | 'toys'
  | 'groceries';

interface NavItemConfig {
  label: string;
  href?: string;
  dropdown?: NavDropdownType;
  isDrawerTrigger?: boolean;
}

const navItems: NavItemConfig[] = [
  { label: 'All', isDrawerTrigger: true },
  { label: 'Early Deals', href: '/early-deals', dropdown: 'early' },
  { label: 'Holiday Deals', href: '/holiday-deals', dropdown: 'holiday' },
  { label: 'Special Products', href: '/special-products', dropdown: 'special' },
  { label: 'Coupons', href: '/coupons' },
  { label: 'Orders', href: '/orders', dropdown: 'orders' },
  { label: 'Buy Again', href: '/buy-again', dropdown: 'buy-again' },
  { label: 'Browsing History', href: '/browsing-history', dropdown: 'history' },
  { label: 'Toys & Games', href: '/toys-and-games', dropdown: 'toys' },
  { label: 'Groceries', href: '/groceries', dropdown: 'groceries' },
  { label: 'Customer Service', href: '/customer-service' },
  { label: 'Sell', href: '/seller' },
];

export default function TopNavLinks() {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavDropdownType | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseEnter = (type: NavDropdownType) => {
    clearTimer();
    setActiveDropdown(type);
  };

  const handleMouseLeave = () => {
    clearTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleClose = () => {
    clearTimer();
    setActiveDropdown(null);
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <section className="relative w-full bg-[#2b323b] text-white select-none">
      <div className="w-full px-2.5 sm:px-3.5 md:px-4">
        <nav
          aria-label="Secondary navigation"
          className="flex h-10 sm:h-10.5 xl:h-11 items-center gap-4 sm:gap-5 md:gap-6 xl:gap-8 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[14px] sm:text-[15px] xl:text-[16px] leading-none font-semibold"
        >
          {navItems.map((item) => (
            <TopNavItem
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.isDrawerTrigger ? Menu : undefined}
              onClick={item.isDrawerTrigger ? () => setIsCategoryDrawerOpen(true) : undefined}
              hasDropdown={Boolean(item.dropdown)}
              isOpen={activeDropdown === item.dropdown}
              onMouseEnter={item.dropdown ? () => handleMouseEnter(item.dropdown!) : undefined}
              onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
            />
          ))}
        </nav>
      </div>

      {/* Popovers */}
      <EarlyDealsPopover
        isOpen={activeDropdown === 'early'}
        onMouseEnter={() => handleMouseEnter('early')}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />

      <HolidayDealsPopover
        isOpen={activeDropdown === 'holiday'}
        onMouseEnter={() => handleMouseEnter('holiday')}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />

      <SpecialProductsPopover
        isOpen={activeDropdown === 'special'}
        onMouseEnter={() => handleMouseEnter('special')}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />

      <OrdersPopover
        isOpen={activeDropdown === 'orders'}
        onMouseEnter={() => handleMouseEnter('orders')}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />

      <BuyAgainPopover
        isOpen={activeDropdown === 'buy-again'}
        onMouseEnter={() => handleMouseEnter('buy-again')}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />

      <BrowsingHistoryPopover
        isOpen={activeDropdown === 'history'}
        onMouseEnter={() => handleMouseEnter('history')}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />

      <ToysAndGamesPopover
        isOpen={activeDropdown === 'toys'}
        onMouseEnter={() => handleMouseEnter('toys')}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />

      <GroceriesPopover
        isOpen={activeDropdown === 'groceries'}
        onMouseEnter={() => handleMouseEnter('groceries')}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />

      {/* All Categories Drawer */}
      <AllCategoriesDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />
    </section>
  );
}
