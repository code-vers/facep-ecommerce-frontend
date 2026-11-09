'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  X,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { usePublicCoupons } from '@/hooks/api/useCoupon';
import { useCategories } from '@/hooks/api/useCategory';
import { Coupon, CouponDiscountType } from '@/lib/api/coupon';
import CouponTicketCard from './CouponTicketCard';
import CouponDetailModal from './CouponDetailModal';

export default function CouponsGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [discountTypeFilter, setDiscountTypeFilter] = useState<CouponDiscountType | 'all'>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'sitewide'>('all');
  const [sortBy, setSortBy] = useState<'expiring' | 'discount-desc' | 'name-asc'>('expiring');

  // Modal State
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Fetch Public Coupons
  const { data: rawCoupons = [], isLoading } = usePublicCoupons({
    search: searchTerm.trim() || undefined,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  // Fetch Categories for Quick Filter Chips
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  // Filter & Sort
  const coupons = useMemo(() => {
    let list = [...rawCoupons];

    if (discountTypeFilter !== 'all') {
      list = list.filter((c) => c.discountType === discountTypeFilter);
    }

    if (scopeFilter === 'sitewide') {
      list = list.filter((c) => c.scope === 'ALL');
    }

    if (sortBy === 'expiring') {
      list.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    } else if (sortBy === 'discount-desc') {
      list.sort((a, b) => Number(b.discountValue) - Number(a.discountValue));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.code.localeCompare(b.code));
    }

    return list;
  }, [rawCoupons, discountTypeFilter, scopeFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setDiscountTypeFilter('all');
    setScopeFilter('all');
    setSortBy('expiring');
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategory !== 'all' ||
    discountTypeFilter !== 'all' ||
    scopeFilter !== 'all';

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#0F1111]">
      
      {/* ── 1. Top Breadcrumb Bar ── */}
      <nav
        aria-label="Breadcrumb"
        className="w-full bg-white border-b border-[#E5E5E6] py-2.5 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 text-xs text-[#565959]"
      >
        <div className="mx-auto max-w-[1760px] flex items-center justify-between font-normal">
          <div className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#165DD0] hover:underline transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/todays-deal" className="hover:text-[#165DD0] hover:underline transition-colors">
              Deals
            </Link>
            <span>›</span>
            <span className="font-semibold text-black">Vouchers &amp; Coupons</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>All Vouchers Verified &amp; Tested</span>
          </div>
        </div>
      </nav>

      {/* ── 2. Distinctive Promo Hero Section ── */}
      <section className="relative w-full bg-linear-to-r from-[#FFFDF2] via-[#FEF7D9] to-[#FCEEB7] border-b border-[#E8DFB8] overflow-hidden py-8 sm:py-12 md:py-14">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#DEC33A]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative z-10">
          <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
            
            {/* Live Ticker Badge */}
            <div className="inline-flex items-center gap-2 bg-[#CC0C39] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-[3px] shadow-xs">
              <Sparkles size={13} className="fill-white" />
              <span>Instant Savings Hub • 1-Click Copy</span>
            </div>

            {/* Headline */}
            <h1 className="text-[32px] sm:text-[42px] md:text-[50px] font-extrabold tracking-tight text-[#0A0A0A] leading-[1.1] font-[Arial]">
              Facep Coupon Central &amp; Digital Vouchers
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed font-normal">
              Copy verified digital discount codes with one click, explore full terms, and paste at checkout for instant savings across all major departments.
            </p>

            {/* Search Box in Hero */}
            <div className="relative w-full max-w-xl mt-2">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search coupons by code (e.g. FACEP20), department, or keyword..."
                className="w-full pl-11 pr-10 py-3 sm:py-3.5 text-xs sm:text-sm bg-white border-2 border-gray-300 focus:border-black rounded-lg shadow-sm focus:outline-none placeholder:text-gray-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Quick 3-Step "How It Works" Strip ── */}
      <section className="w-full bg-[#181F26] text-white py-4 border-b border-[#2A3440] shadow-2xs">
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 items-center text-center sm:text-left">
            
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">1-Click Copy Code</span>
                <span className="text-[11px] text-gray-400">Click &apos;Copy Code&apos; on any voucher</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Fill Your Cart</span>
                <span className="text-[11px] text-gray-400">Meet the minimum spend condition</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Paste &amp; Save Instantly</span>
                <span className="text-[11px] text-gray-400">Apply at Cart or Checkout for discount</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Main Catalog Section ── */}
      <main className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 py-8">
        
        {/* Filter Toolbar */}
        <div className="bg-white border border-[#E5E5E6] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Quick Segment Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider mr-1 hidden sm:inline">
              Filter By:
            </span>

            <button
              type="button"
              onClick={() => {
                setDiscountTypeFilter('all');
                setScopeFilter('all');
                setSelectedCategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                discountTypeFilter === 'all' && scopeFilter === 'all' && selectedCategory === 'all'
                  ? 'bg-black text-white border-black font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
              }`}
            >
              All Vouchers ({rawCoupons.length})
            </button>

            <button
              type="button"
              onClick={() => setScopeFilter(scopeFilter === 'sitewide' ? 'all' : 'sitewide')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                scopeFilter === 'sitewide'
                  ? 'bg-black text-white border-black font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
              }`}
            >
              ✦ Sitewide Only
            </button>

            <button
              type="button"
              onClick={() =>
                setDiscountTypeFilter(discountTypeFilter === 'PERCENTAGE' ? 'all' : 'PERCENTAGE')
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                discountTypeFilter === 'PERCENTAGE'
                  ? 'bg-black text-white border-black font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
              }`}
            >
              % Discounts
            </button>

            <button
              type="button"
              onClick={() =>
                setDiscountTypeFilter(discountTypeFilter === 'FIXED_AMOUNT' ? 'all' : 'FIXED_AMOUNT')
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                discountTypeFilter === 'FIXED_AMOUNT'
                  ? 'bg-black text-white border-black font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
              }`}
            >
              $ Fixed Off
            </button>

            <button
              type="button"
              onClick={() =>
                setDiscountTypeFilter(discountTypeFilter === 'FREE_SHIPPING' ? 'all' : 'FREE_SHIPPING')
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                discountTypeFilter === 'FREE_SHIPPING'
                  ? 'bg-black text-white border-black font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
              }`}
            >
              Free Shipping
            </button>
          </div>

          {/* Sort & Category Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center">
            {/* Category Select */}
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-md bg-white text-gray-800 cursor-pointer focus:outline-none focus:border-black"
              >
                <option value="all">All Departments</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-md bg-white text-gray-800 cursor-pointer focus:outline-none focus:border-black"
            >
              <option value="expiring">Expiring Soonest</option>
              <option value="discount-desc">Highest Discount</option>
              <option value="name-asc">Code Name (A-Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── 5. Vouchers Grid ── */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-coupon-${i}`}
                  className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3 animate-pulse h-48"
                >
                  <div className="w-1/3 h-6 bg-gray-200 rounded" />
                  <div className="w-3/4 h-5 bg-gray-200 rounded" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded" />
                  <div className="w-full h-8 bg-gray-200 rounded mt-auto" />
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white border border-[#E5E5E6] rounded-xl p-10 sm:p-14 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 shadow-xs">
              <div className="size-16 rounded-full bg-[#DEC33A]/20 flex items-center justify-center text-[#B49A2E] mb-4">
                <Ticket size={32} />
              </div>
              <h3 className="text-xl font-bold text-black mb-1">
                No Coupons Found
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                No active promotional coupons match your current filters. Clear your filters to explore all available offers.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-black text-white font-bold text-xs rounded-sm hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {coupons.map((coupon) => (
                <CouponTicketCard
                  key={coupon.id}
                  coupon={coupon}
                  onViewDetails={(c) => setSelectedCoupon(c)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── 6. Customer Assurance & FAQ Accordion Section ── */}
        <section className="mt-14 bg-white border border-[#E5E5E6] rounded-2xl p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-[#8B6E00] uppercase tracking-wider block">
                Customer Guarantee
              </span>
              <h3 className="text-lg sm:text-xl font-black text-black">
                Frequently Asked Coupon Questions
              </h3>
            </div>
            <Link
              href="/customer-service"
              className="text-xs font-bold text-[#165DD0] hover:underline flex items-center gap-1"
            >
              <span>Need help? Contact Support</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs text-gray-600">
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-black text-sm flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#DEC33A]" />
                <span>How do I redeem a coupon?</span>
              </h4>
              <p className="leading-relaxed">
                Simply click the <strong>Copy Code</strong> button on any coupon above. Then, paste the copied code into the &apos;Promo Code&apos; box at Cart or Checkout and click &apos;Apply&apos;.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-black text-sm flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#DEC33A]" />
                <span>Are discounts guaranteed to work?</span>
              </h4>
              <p className="leading-relaxed">
                Yes. All coupons displayed on this page are verified by the platform and checked in real-time for validity, active dates, and remaining stock quotas.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-black text-sm flex items-center gap-1.5">
                <ShoppingBag size={15} className="text-[#DEC33A]" />
                <span>What are minimum spend requirements?</span>
              </h4>
              <p className="leading-relaxed">
                Some coupons require your qualifying cart total to reach a specific threshold (e.g. $50). You can check every coupon&apos;s criteria by clicking the <strong>Info (ℹ)</strong> icon on any card.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ── 7. Coupon Detail Modal ── */}
      <CouponDetailModal
        coupon={selectedCoupon}
        isOpen={Boolean(selectedCoupon)}
        onClose={() => setSelectedCoupon(null)}
      />

    </div>
  );
}
