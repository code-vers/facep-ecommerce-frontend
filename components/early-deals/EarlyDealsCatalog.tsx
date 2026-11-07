'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Truck,
  X,
  Star,
  Zap,
  Timer,
} from 'lucide-react';
import {
  useEarlyDeals,
} from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';
import { getImageUrl } from '@/lib/utils';
import type { Product } from '@/lib/api/product';

// Calculate deterministic claim percentage based on product id
function getProductClaimPercent(productId: string): number {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = (hash << 5) - hash + productId.charCodeAt(i);
    hash |= 0;
  }
  // Returns between 58% and 94%
  return 58 + (Math.abs(hash) % 37);
}

export default function EarlyDealsCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('discount-desc');
  const [priceRange, setPriceRange] = useState<'all' | 'under25' | 'under50' | '50to100' | 'over100'>('all');
  const [discountFilter, setDiscountFilter] = useState<'all' | 'high'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic live countdown timer for flash urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 11, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Fetch categories for filtering
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  // Price range filters
  const priceFilter = useMemo(() => {
    switch (priceRange) {
      case 'under25':
        return { maxPrice: 25 };
      case 'under50':
        return { maxPrice: 50 };
      case '50to100':
        return { minPrice: 50, maxPrice: 100 };
      case 'over100':
        return { minPrice: 100 };
      default:
        return {};
    }
  }, [priceRange]);

  // Fetch early deals
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: 18,
      search: searchTerm.trim() || undefined,
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: sortBy,
      isEarlyDeal: true,
      ...priceFilter,
    };
  }, [currentPage, searchTerm, selectedCategory, sortBy, priceFilter]);

  const { data, isLoading, isFetching } = useEarlyDeals(queryParams);
  const rawProducts = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 18, totalPage: 1 };

  // Filter high discounts client-side if selected
  const products = useMemo(() => {
    if (discountFilter === 'high') {
      return rawProducts.filter(
        (p) =>
          Number(p.discountValue) >= 20 ||
          (p.oldPrice && Number(p.oldPrice) > Number(p.basePrice) * 1.25)
      );
    }
    return rawProducts;
  }, [rawProducts, discountFilter]);

  // Select spotlight deal
  const spotlightProduct: Product | undefined = products[0];

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 260;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('discount-desc');
    setPriceRange('all');
    setDiscountFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategory !== 'all' ||
    priceRange !== 'all' ||
    discountFilter !== 'all' ||
    sortBy !== 'discount-desc';

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#0F1111]">
      {/* ── 1. Top Ticker & Breadcrumb Bar ── */}
      <div className="w-full bg-[#182026] text-white py-1.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[#DEC33A] uppercase tracking-wider font-bold">Live Early Bird Drop:</span>
        <span className="hidden sm:inline text-gray-300">Manufacturer direct allocations are open. Claim before batch exhaustion!</span>
        <span className="sm:hidden text-gray-300">Batch allocations live!</span>
      </div>

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
            <span className="font-semibold text-black">⚡ Flash Early Deals</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            <Flame size={12} className="fill-red-600" />
            <span>Updated Daily at 00:00 GMT</span>
          </div>
        </div>
      </nav>

      {/* ── 2. High-Energy Deal Hero Section with Live Countdown ── */}
      <section className="relative w-full bg-linear-to-r from-[#FFFDF0] via-[#FDF7D8] to-[#FCEEB7] border-b border-[#E8DFB8] overflow-hidden py-8 sm:py-10 md:py-12">
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Flash Urgency, Countdown & Quick Deal Jumps */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-black">
              {/* Event Badge & Live Timer */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 bg-[#CC0C39] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-[3px] shadow-xs">
                  <Flame size={14} className="fill-white" />
                  <span>Early Access Event</span>
                </span>
                
                {/* Live Countdown Clock */}
                <div className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-mono font-bold px-3 py-1 rounded-[3px] shadow-xs">
                  <Timer size={13} className="text-[#DEC33A]" />
                  <span>Ends In:</span>
                  <span className="text-[#DEC33A]">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] font-extrabold tracking-tight text-[#0A0A0A] leading-[1.1] font-[Arial]">
                ⚡ Flash Early Deals &amp; Batch Markdowns
              </h1>

              {/* Urgency Subtitle */}
              <p className="text-sm sm:text-base md:text-[17px] text-gray-800 leading-relaxed max-w-2xl font-normal">
                Score member-first discounts on limited product allocations. Once batch allocations hit 100%, items revert to standard retail pricing.
              </p>

              {/* 3 Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                <div className="flex items-center gap-2 bg-white/80 border border-[#DEC33A]/60 rounded-md p-2.5 shadow-2xs">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded bg-[#CC0C39] text-white font-bold text-xs">
                    %
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-black leading-tight">Up to 60% Off</span>
                    <span className="text-[11px] text-gray-600 leading-tight">Verified markdowns</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/80 border border-[#DEC33A]/60 rounded-md p-2.5 shadow-2xs">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded bg-[#DEC33A] text-black">
                    <Zap size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-black leading-tight">Early Batch</span>
                    <span className="text-[11px] text-gray-600 leading-tight">Reserved seller inventory</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/80 border border-[#DEC33A]/60 rounded-md p-2.5 shadow-2xs">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded bg-[#229A4E] text-white">
                    <Truck size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-black leading-tight">Fast Dispatch</span>
                    <span className="text-[11px] text-gray-600 leading-tight">Priority warehouse handling</span>
                  </div>
                </div>
              </div>

              {/* Quick Deal Price Bubbles */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-gray-700 mr-1">Deal Buckets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPriceRange('all');
                    setDiscountFilter('all');
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-all border cursor-pointer ${
                    priceRange === 'all' && discountFilter === 'all'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white/90 hover:bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  All Deals ({meta.total})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriceRange('under25');
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-all border cursor-pointer ${
                    priceRange === 'under25'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white/90 hover:bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  ⚡ Under $25
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriceRange('under50');
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-all border cursor-pointer ${
                    priceRange === 'under50'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white/90 hover:bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  ⚡ Under $50
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDiscountFilter(discountFilter === 'high' ? 'all' : 'high');
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-all border cursor-pointer ${
                    discountFilter === 'high'
                      ? 'bg-[#CC0C39] text-white border-[#CC0C39] shadow-xs'
                      : 'bg-white/90 hover:bg-white text-red-700 border-red-200'
                  }`}
                >
                  🔥 20%+ Off Only
                </button>
              </div>
            </div>

            {/* Right Column: Hero Spotlight Deal Card with Claim Bar */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              {spotlightProduct ? (
                <div className="w-full max-w-105 bg-white border-2 border-[#DEC33A] rounded-xl shadow-xl p-5 flex flex-col gap-3.5 relative overflow-hidden">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#CC0C39] px-2.5 py-1 rounded-xs shadow-xs">
                      <Flame size={13} className="fill-white" />
                      <span>Early Drop Highlight</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs">
                      Active Now
                    </span>
                  </div>

                  {/* Spotlight Image */}
                  <Link
                    href={`/products/${spotlightProduct.slug}`}
                    className="relative w-full h-48 sm:h-52 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center group/spotlight"
                  >
                    <Image
                      src={getImageUrl(spotlightProduct.thumbnail)}
                      alt={spotlightProduct.name}
                      fill
                      unoptimized
                      priority
                      className="object-contain p-3 transition-transform duration-300 group-hover/spotlight:scale-105"
                    />
                    {Number(spotlightProduct.discountValue) > 0 && (
                      <span className="absolute top-2 left-2 rounded-xs bg-[#CC0C39] px-2 py-0.5 text-xs font-extrabold text-white shadow-md">
                        {spotlightProduct.discountValue}
                        {spotlightProduct.discountType === 'PERCENTAGE' ? '%' : ''} OFF
                      </span>
                    )}
                  </Link>

                  {/* Product Title */}
                  <div className="flex flex-col gap-1.5">
                    <Link
                      href={`/products/${spotlightProduct.slug}`}
                      className="text-base font-bold text-[#0F1111] hover:text-[#165DD0] line-clamp-1 transition-colors"
                      title={spotlightProduct.name}
                    >
                      {spotlightProduct.name}
                    </Link>

                    {/* Price Row */}
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-2xl font-black text-black">
                        ${Number(spotlightProduct.basePrice).toFixed(2)}
                      </span>
                      {spotlightProduct.oldPrice && Number(spotlightProduct.oldPrice) > Number(spotlightProduct.basePrice) && (
                        <span className="text-sm text-gray-500 line-through">
                          ${Number(spotlightProduct.oldPrice).toFixed(2)}
                        </span>
                      )}
                      {spotlightProduct.oldPrice && Number(spotlightProduct.oldPrice) > Number(spotlightProduct.basePrice) && (
                        <span className="text-xs font-bold text-[#229A4E] ml-auto">
                          Save ${(Number(spotlightProduct.oldPrice) - Number(spotlightProduct.basePrice)).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Live Batch Claim Meter */}
                    <div className="flex flex-col gap-1 pt-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-gray-700">Early Allocation Claimed</span>
                        <span className="text-[#CC0C39]">78% Claimed</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                        <div className="h-full bg-linear-to-r from-[#DEC33A] via-amber-500 to-[#CC0C39] rounded-full w-[78%]" />
                      </div>
                      <span className="text-[11px] text-gray-500">
                        ⚡ Limited early stock remaining at this promotional rate.
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/products/${spotlightProduct.slug}`}
                      className="mt-2 w-full py-2.5 px-4 rounded-sm bg-[#DEC33A] hover:bg-[#C9B034] active:bg-[#B49A2E] text-black font-extrabold text-xs text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Zap size={15} className="fill-black" />
                      <span>Claim Early Deal Now</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Category Carousel & Filter Toolbar ── */}
      <section className="w-full bg-white border-b border-[#E5E5E6] py-3.5 sticky top-14 sm:top-16 z-20 shadow-2xs">
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider shrink-0 hidden md:inline">
              Deals by Category:
            </span>

            {/* Left Scroll Chevron */}
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="hidden sm:flex size-8 shrink-0 items-center justify-center rounded-full border border-[#E5E5E6] bg-white text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Scroll categories left"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Scrollable Category Chips */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#DEC33A] text-black border-[#DEC33A] font-bold shadow-xs'
                    : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                }`}
              >
                All Categories ({meta.total})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#DEC33A] text-black border-[#DEC33A] font-bold shadow-xs'
                      : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right Scroll Chevron */}
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="hidden sm:flex size-8 shrink-0 items-center justify-center rounded-full border border-[#E5E5E6] bg-white text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Scroll categories right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. Main Catalog Content Area ── */}
      <main className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 py-6 sm:py-8">
        
        {/* Deal Controls & Search Toolbar */}
        <div className="bg-white border border-[#E5E5E6] rounded-lg p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search early deals by keyword or brand..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm border border-[#E5E5E6] rounded-md focus:outline-none focus:border-black placeholder:text-gray-400 bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Controls: Price Range, Sort, Reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Price Range Dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="early-price-filter" className="text-xs font-semibold text-gray-600 hidden sm:inline">
                Price:
              </label>
              <select
                id="early-price-filter"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(e.target.value as never);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-xs font-medium border border-[#E5E5E6] rounded-md bg-white focus:outline-none focus:border-black text-gray-800 cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under25">Under $25</option>
                <option value="under50">Under $50</option>
                <option value="50to100">$50 to $100</option>
                <option value="over100">$100 and Above</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="early-sort" className="text-xs font-semibold text-gray-600 hidden sm:inline">
                Sort:
              </label>
              <select
                id="early-sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-xs font-medium border border-[#E5E5E6] rounded-md bg-white focus:outline-none focus:border-black text-gray-800 cursor-pointer"
              >
                <option value="discount-desc">⚡ Biggest Savings %</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="createdAt:desc">Newest Early Drops</option>
                <option value="name-asc">Product Name: A to Z</option>
              </select>
            </div>

            {/* Reset button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 pb-1 text-xs">
            <span className="text-gray-500 font-medium">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#E5E5E6] px-2.5 py-1 rounded-full text-gray-800">
                Keyword: <strong className="text-black">{searchTerm}</strong>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="hover:text-red-600 ml-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#E5E5E6] px-2.5 py-1 rounded-full text-gray-800">
                Category:{' '}
                <strong className="text-black">
                  {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                </strong>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-red-600 ml-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#E5E5E6] px-2.5 py-1 rounded-full text-gray-800">
                Price:{' '}
                <strong className="text-black">
                  {priceRange === 'under25'
                    ? 'Under $25'
                    : priceRange === 'under50'
                    ? 'Under $50'
                    : priceRange === '50to100'
                    ? '$50 - $100'
                    : '$100+'}
                </strong>
                <button
                  type="button"
                  onClick={() => setPriceRange('all')}
                  className="hover:text-red-600 ml-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {discountFilter === 'high' && (
              <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full text-red-700">
                <strong>20%+ Discount Only</strong>
                <button
                  type="button"
                  onClick={() => setDiscountFilter('all')}
                  className="hover:text-red-900 ml-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* ── 5. Flash Early Deals Custom Grid (Dense 6-column Deal Hub) ── */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`skeleton-early-${i}`}
                  className="bg-white border border-[#E5E5E6] rounded-md p-3 flex flex-col gap-3 animate-pulse"
                >
                  <div className="w-full h-44 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded-full w-full mt-2" />
                  <div className="h-8 bg-gray-200 rounded mt-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#E5E5E6] rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 sm:my-12 shadow-xs">
              <div className="size-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                <Flame size={32} />
              </div>
              <h3 className="text-xl font-bold text-black mb-1">
                No Early Deals In This Filter
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                There are currently no early deal items matching this combination. Adjust your search or clear filters to see all available drops.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-black text-white font-bold text-xs rounded-sm hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {products.map((product) => {
                const claimPercent = getProductClaimPercent(product.id);
                const hasDiscount = Number(product.discountValue) > 0 || (product.oldPrice && Number(product.oldPrice) > Number(product.basePrice));
                const savingsAmount = product.oldPrice && Number(product.oldPrice) > Number(product.basePrice)
                  ? (Number(product.oldPrice) - Number(product.basePrice)).toFixed(2)
                  : null;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-[#E5E5E6] hover:border-[#DEC33A] rounded-md overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col h-full group"
                  >
                    {/* Image Area with Badges */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative w-full h-44 sm:h-48 bg-[#FBFBFB] flex items-center justify-center p-3 border-b border-[#F0F0F0] overflow-hidden"
                    >
                      <Image
                        src={getImageUrl(product.thumbnail)}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Red % Off Pill */}
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-[#CC0C39] text-white text-[11px] font-black px-1.5 py-0.5 rounded-xs shadow-xs">
                          {product.discountValue
                            ? `${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : ''} OFF`
                            : 'DEAL'}
                        </span>
                      )}

                      {/* Early Access Pill */}
                      <span className="absolute top-2 right-2 bg-amber-500/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-xs shadow-2xs flex items-center gap-0.5">
                        <Zap size={10} className="fill-black" />
                        <span>Early</span>
                      </span>
                    </Link>

                    {/* Card Body */}
                    <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
                      <div>
                        {/* Category */}
                        <div className="text-[11px] font-semibold text-amber-700 truncate">
                          {product.category?.name || 'Flash Deal'}
                        </div>

                        {/* Title */}
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-xs sm:text-[13px] font-semibold text-[#0F1111] hover:text-[#165DD0] line-clamp-2 leading-tight transition-colors mt-0.5"
                          title={product.name}
                        >
                          {product.name}
                        </Link>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-600">
                          <div className="flex items-center text-[#F09000]">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                size={11}
                                className={i < 4 ? 'fill-[#F09000]' : 'fill-[#F09000] opacity-60'}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-gray-700">4.8</span>
                        </div>
                      </div>

                      {/* Pricing Block */}
                      <div className="pt-1 border-t border-gray-100 flex flex-col gap-1">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-base sm:text-lg font-black text-black leading-none">
                            ${Number(product.basePrice).toFixed(2)}
                          </span>
                          {product.oldPrice && Number(product.oldPrice) > Number(product.basePrice) && (
                            <span className="text-xs text-gray-400 line-through leading-none">
                              ${Number(product.oldPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {savingsAmount && (
                          <div className="text-[10px] font-bold text-[#229A4E]">
                            Save ${savingsAmount}
                          </div>
                        )}

                        {/* Stock Claim Progress Bar */}
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold">
                            <span className="text-gray-500">Claimed:</span>
                            <span className="text-[#CC0C39] font-bold">{claimPercent}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-[#DEC33A] to-[#CC0C39] rounded-full"
                              style={{ width: `${claimPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Claim Deal Button */}
                        <Link
                          href={`/products/${product.slug}`}
                          className="mt-2 w-full py-1.5 px-2 bg-[#DEC33A] hover:bg-[#C9B034] active:bg-[#B49A2E] text-black font-extrabold text-xs rounded-xs text-center transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Zap size={12} className="fill-black" />
                          <span>Claim Early Deal</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 6. Pagination ── */}
        {meta.totalPage > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E5E6] bg-white rounded-lg p-4 mt-8 shadow-xs">
            <div className="text-xs text-gray-600">
              Showing page <strong className="text-black">{meta.page}</strong> of{' '}
              <strong className="text-black">{meta.totalPage}</strong> (Total {meta.total} Early Deals)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || isFetching}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-sm border border-[#E5E5E6] hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-black transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPage }, (_, i) => i + 1)
                  .filter((page) => page === 1 || page === meta.totalPage || Math.abs(page - currentPage) <= 1)
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    return (
                      <React.Fragment key={page}>
                        {prev && page - prev > 1 && (
                          <span className="px-1 text-gray-400 text-xs">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`size-7 text-xs font-bold rounded-sm transition-colors cursor-pointer ${
                            currentPage === page
                              ? 'bg-[#DEC33A] text-black'
                              : 'bg-white hover:bg-gray-100 text-gray-700 border border-[#E5E5E6]'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                type="button"
                disabled={currentPage >= meta.totalPage || isFetching}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-sm border border-[#E5E5E6] hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-black transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
