'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  ChevronRight,
  ChevronLeft,
  User,
  Sparkles,
  TicketPercent,
  Flame,
  Gift,
  History,
  HelpCircle,
  Store,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useCategories } from '@/hooks/api/useCategory';
import { useAuth } from '@/contexts/AuthContext';
import type { Category } from '@/lib/api/category';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AllCategoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllCategoriesDrawer({
  isOpen,
  onClose,
}: AllCategoriesDrawerProps) {
  const router = useRouter();
  const { session, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Fetch up to 100 categories with subcategories
  const { data: categoriesData, isLoading } = useCategories(1, 100);
  const categories = (categoriesData?.data || []).filter(
    (c) => c.isActive !== false
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle slide animations and unmount
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => {
        setIsRendered(false);
        setActiveCategory(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isRendered) return null;

  const handleCategoryClick = (cat: Category) => {
    if (cat.subcategories && cat.subcategories.length > 0) {
      setActiveCategory(cat);
    } else {
      router.push(`/products?category=${encodeURIComponent(cat.name)}`);
      onClose();
    }
  };

  const handleSubcategoryClick = (catName: string, subName: string) => {
    router.push(
      `/products?category=${encodeURIComponent(
        catName
      )}&subcategory=${encodeURIComponent(subName)}`
    );
    onClose();
  };

  const handleSeeAllCategory = (catName: string) => {
    router.push(`/products?category=${encodeURIComponent(catName)}`);
    onClose();
  };

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-9999 transition-all duration-300',
        isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      )}
      aria-modal="true"
      role="dialog"
      aria-label="All Categories Navigation"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 bg-black/65 backdrop-blur-[1px] transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Outside Floating Close Button (Desktop) */}
      <button
        type="button"
        onClick={onClose}
        className={cn(
          'fixed top-3.5 z-10000 hidden sm:flex size-9 rounded-full items-center justify-center text-white bg-black/50 hover:bg-black/80 hover:text-[#dec33a] transition-all cursor-pointer focus-visible:outline-none shadow-md',
          'left-93.75 md:left-98.75',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
        title="Close menu"
        aria-label="Close menu"
      >
        <X size={22} strokeWidth={2.2} />
      </button>

      {/* Sidebar Drawer Container */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-10000 w-90 md:w-95 max-w-[86vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header (Facep Dark Header) */}
        <div className="bg-[#181F26] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 shadow-sm border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#dec33a]">
              <User size={18} />
            </div>
            {session?.user?.name ? (
              <span className="font-bold text-[16px] sm:text-[17px] text-white truncate max-w-52.5">
                Hello, {session.user.name.split(' ')[0]}
              </span>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="font-bold text-[16px] sm:text-[17px] text-white hover:text-[#dec33a] transition-colors"
              >
                Hello, Sign In
              </Link>
            )}
          </div>

          {/* Close button on mobile inside header */}
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden size-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content with Two-Level Sliding Track */}
        <div className="relative flex-1 overflow-hidden bg-white">
          <div
            className={cn(
              'flex w-[200%] h-full transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
              activeCategory ? '-translate-x-1/2' : 'translate-x-0'
            )}
          >
            {/* ── Screen 1: Main Menu (Categories & Programs) ── */}
            <div className="w-1/2 h-full overflow-y-auto divide-y divide-gray-100 pb-12 scrollbar-thin">
              {/* Categories Section */}
              <div className="py-2.5">
                <h3 className="px-5 sm:px-6 pt-2 pb-2 text-[13px] font-bold tracking-wider text-gray-500 uppercase">
                  Shop By Department
                </h3>

                {isLoading ? (
                  <div className="px-5 sm:px-6 py-3 space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-5 bg-gray-200 rounded animate-pulse w-3/4"
                      />
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="px-5 sm:px-6 py-4 text-[13px] text-gray-400">
                    No departments found
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {categories.map((cat) => {
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryClick(cat)}
                          className="w-full flex items-center justify-between px-5 sm:px-6 py-3 text-left text-[14px] font-medium text-gray-800 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer group"
                        >
                          <span className="truncate pr-2">{cat.name}</span>
                          <ChevronRight
                            size={16}
                            className="text-gray-400 group-hover:text-gray-700 shrink-0 transition-transform group-hover:translate-x-0.5"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Programs & Features Section */}
              <div className="py-2.5">
                <h3 className="px-5 sm:px-6 pt-2 pb-2 text-[13px] font-bold tracking-wider text-gray-500 uppercase">
                  Programs & Features
                </h3>
                <div className="space-y-0.5">
                  <Link
                    href="/special-products"
                    onClick={onClose}
                    className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles size={16} className="text-[#dec33a]" />
                      Special Products
                    </span>
                  </Link>
                  <Link
                    href="/coupons"
                    onClick={onClose}
                    className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <TicketPercent size={16} className="text-[#dec33a]" />
                      Coupons & Discounts
                    </span>
                  </Link>
                  <Link
                    href="/early-deals"
                    onClick={onClose}
                    className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Flame size={16} className="text-[#dec33a]" />
                      Early Deals
                    </span>
                  </Link>
                  <Link
                    href="/holiday-deals"
                    onClick={onClose}
                    className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Gift size={16} className="text-[#dec33a]" />
                      Holiday Deals
                    </span>
                  </Link>
                  <Link
                    href="/browsing-history"
                    onClick={onClose}
                    className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <History size={16} className="text-gray-500" />
                      Browsing History
                    </span>
                  </Link>
                </div>
              </div>

              {/* Help & Settings Section */}
              <div className="py-2.5">
                <h3 className="px-5 sm:px-6 pt-2 pb-2 text-[13px] font-bold tracking-wider text-gray-500 uppercase">
                  Help & Settings
                </h3>
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <User size={16} className="text-gray-500" />
                      Your Account
                    </span>
                  </Link>
                  <Link
                    href="/customer-service"
                    onClick={onClose}
                    className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-gray-500" />
                      Customer Service
                    </span>
                  </Link>
                  <Link
                    href="/seller"
                    onClick={onClose}
                    className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Store size={16} className="text-gray-500" />
                      Sell on Facep
                    </span>
                  </Link>

                  {session ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        toast.success('Signed out successfully');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <LogOut size={16} className="text-red-500" />
                        Sign Out
                      </span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex items-center justify-between px-5 sm:px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <LogIn size={16} className="text-gray-500" />
                        Sign In
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* ── Screen 2: Submenu (Subcategories of active Category) ── */}
            <div className="w-1/2 h-full overflow-y-auto divide-y divide-gray-100 pb-12 scrollbar-thin">
              {activeCategory && (
                <>
                  {/* Back to Main Menu Button */}
                  <button
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className="flex items-center gap-2.5 w-full px-5 sm:px-6 py-3.5 text-left text-[13px] font-bold tracking-wider text-gray-700 hover:bg-gray-100 hover:text-black transition-colors uppercase border-b border-gray-100 cursor-pointer"
                  >
                    <ChevronLeft size={18} className="text-gray-600" />
                    <span>MAIN MENU</span>
                  </button>

                  {/* Active Category Department */}
                  <div className="py-2.5">
                    <div className="px-5 sm:px-6 pt-3 pb-2">
                      <h3 className="text-[17px] font-bold text-gray-900 leading-snug">
                        {activeCategory.name}
                      </h3>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        Browse all or select a subcategory
                      </p>
                    </div>

                    {/* "See all [Category]" link */}
                    <button
                      type="button"
                      onClick={() => handleSeeAllCategory(activeCategory.name)}
                      className="w-full flex items-center justify-between px-5 sm:px-6 py-3 text-left text-[14px] font-semibold text-[#2b323b] hover:bg-amber-50 hover:text-[#9e8316] transition-colors cursor-pointer group"
                    >
                      <span>See all {activeCategory.name}</span>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-[#9e8316] shrink-0"
                      />
                    </button>

                    <div className="my-1.5 border-t border-gray-100" />

                    {/* Subcategories list */}
                    {activeCategory.subcategories &&
                    activeCategory.subcategories.length > 0 ? (
                      <div className="space-y-0.5 pt-1">
                        {activeCategory.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() =>
                              handleSubcategoryClick(
                                activeCategory.name,
                                sub.name
                              )
                            }
                            className="w-full flex items-center justify-between px-5 sm:px-6 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                          >
                            <span className="truncate pr-2">{sub.name}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-5 sm:px-6 py-6 text-center text-[13px] text-gray-400 italic">
                        No subcategories available in this department
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
