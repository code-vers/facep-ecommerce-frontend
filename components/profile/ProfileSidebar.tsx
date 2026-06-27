/**
 * @fileoverview Sidebar Navigation menu for the User Profile Page.
 *
 * @module components/profile/ProfileSidebar
 */

import React from 'react';
import { User, ShoppingBag, Heart, RotateCcw, LogOut } from 'lucide-react';

interface ProfileSidebarProps {
  activeTab: 'profile' | 'orders' | 'shops' | 'refunds';
  onTabChange: (tab: 'profile' | 'orders' | 'shops' | 'refunds') => void;
  onLogout: () => void;
}

/**
 * ProfileSidebar component.
 */
export default function ProfileSidebar({
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarProps) {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'shops', label: 'Favourite Shops', icon: Heart },
    { id: 'refunds', label: 'Returns & Refunds', icon: RotateCcw },
  ] as const;

  return (
    <div className="w-full lg:w-[400px] border border-[#e5e5e6] rounded bg-[#f2f2f3] p-6 flex flex-col gap-9 shrink-0 text-left">
      <div className="flex flex-col gap-6 w-full">
        {/* Title */}
        <h3 className="text-[22px] font-normal text-black leading-tight">
          Manage My Account
        </h3>

        {/* Menu Items List */}
        <nav className="flex flex-col w-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex gap-2 items-center p-3 rounded text-[14px] font-normal transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#dec33a] text-black font-semibold shadow-sm'
                    : 'text-black hover:bg-[#e5e5e6]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action Button */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full flex gap-2 items-center p-3 rounded text-[14px] font-normal text-[#cb1b1b] hover:bg-red-50 transition-all cursor-pointer border-t border-gray-200/50 pt-6"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  );
}
