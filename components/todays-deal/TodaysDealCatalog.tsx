/**
 * @fileoverview Main Deals Catalog component with Sidebar, Menubar, and Grid.
 * Handles category tab filtration, sidebar search refinements, and product pagination.
 *
 * @module components/todays-deal/TodaysDealCatalog
 */

'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, ArrowRight, X, Filter } from 'lucide-react';
import { CATALOG_PRODUCTS } from '@/lib/todays-deal-data';
import { cn } from '@/lib/utils';

// ── Constants ────────────────────────────────────────────────────────────────
const MENUBAR_TABS = [
  'All Deals',
  'Deals Express',
  'Refurbished Deals',
  'Available Deals',
  'Every day essentials',
  'Back to school',
  'Father\'s Day Deals',
  'Computers',
  'Electronics',
  'Accessories',
  'Pet supplies',
  'Outdoor',
  'Gardening',
];

const CATEGORIES = [
  'All',
  'Devices & Accessories',
  'Appliances',
  'Electronics',
  'Furniture',
  'Outdoor Equipment',
];

const DISCOUNTS = [
  { label: '10% off or more', value: 10 },
  { label: '25% off or more', value: 25 },
  { label: '50% off or more', value: 50 },
  { label: '70% off or more', value: 70 },
];

/**
 * TodaysDealCatalog component.
 * Core catalog view providing extensive interactive filters.
 */
export default function TodaysDealCatalog() {
  // Filter States
  const [selectedTab, setSelectedTab] = useState('All Deals');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [isEverydayEssential, setIsEverydayEssential] = useState<boolean | null>(null);
  
  // Mobile UI States
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(8);

  // References
  const menuBarRef = useRef<HTMLDivElement>(null);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const scrollMenuBar = (direction: 'left' | 'right') => {
    if (menuBarRef.current) {
      const scrollAmount = 200;
      menuBarRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(3000);
    setSelectedDiscount(null);
    setMinRating(null);
    setIsEverydayEssential(null);
    setSelectedTab('All Deals');
    setVisibleCount(8);
  };

  const handleRemovePill = (filterType: string) => {
    switch (filterType) {
      case 'category':
        setSelectedCategory('All');
        break;
      case 'price':
        setMaxPrice(3000);
        break;
      case 'discount':
        setSelectedDiscount(null);
        break;
      case 'rating':
        setMinRating(null);
        break;
      case 'essential':
        setIsEverydayEssential(null);
        break;
      case 'tab':
        setSelectedTab('All Deals');
        break;
    }
  };

  // ── Filter Logic ───────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      // 1. Tab filtering (mock categorization)
      if (selectedTab !== 'All Deals') {
        if (selectedTab === 'Every day essentials' && !product.isEveryDayEssential) return false;
        if (selectedTab === 'Computers' && product.category !== 'Devices & Accessories') return false;
        if (selectedTab === 'Electronics' && product.category !== 'Electronics' && product.category !== 'Devices & Accessories') return false;
        if (selectedTab === 'Outdoor' && product.category !== 'Outdoor Equipment') return false;
        if (selectedTab === 'Father\'s Day Deals' && parseFloat(product.discountBadge) < 30) return false;
      }

      // 2. Sidebar category filtering
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Price filtering
      if (product.price > maxPrice) {
        return false;
      }

      // 4. Discount filtering
      if (selectedDiscount !== null) {
        const discountPercent = parseInt(product.discountBadge);
        if (isNaN(discountPercent) || discountPercent < selectedDiscount) {
          return false;
        }
      }

      // 5. Rating filtering
      if (minRating !== null && product.rating < minRating) {
        return false;
      }

      // 6. Everyday essential pill
      if (isEverydayEssential !== null && product.isEveryDayEssential !== isEverydayEssential) {
        return false;
      }

      return true;
    });
  }, [selectedTab, selectedCategory, maxPrice, selectedDiscount, minRating, isEverydayEssential]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const activeFilterPills = useMemo(() => {
    const pills = [];
    if (selectedCategory !== 'All') {
      pills.push({ id: 'category', label: selectedCategory });
    }
    if (maxPrice < 3000) {
      pills.push({ id: 'price', label: `Under $${maxPrice}` });
    }
    if (selectedDiscount !== null) {
      pills.push({ id: 'discount', label: `${selectedDiscount}% off+` });
    }
    if (minRating !== null) {
      pills.push({ id: 'rating', label: `${minRating}★ & up` });
    }
    if (isEverydayEssential) {
      pills.push({ id: 'essential', label: 'Everyday Essential' });
    }
    if (selectedTab !== 'All Deals') {
      pills.push({ id: 'tab', label: selectedTab });
    }
    return pills;
  }, [selectedCategory, maxPrice, selectedDiscount, minRating, isEverydayEssential, selectedTab]);

  return (
    <section className="w-full py-8 bg-white" id="deals-catalog">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
        
        {/* ── 1. Menubar (Horizontal category tabs) ── */}
        <div className="relative border-b border-[#E5E5E6] pb-3 mb-6 flex items-center">
          {/* Scroll Left Button */}
          <button
            onClick={() => scrollMenuBar('left')}
            className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E6] bg-white text-black hover:bg-gray-50 shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Tab lists wrapper */}
          <div
            ref={menuBarRef}
            className="flex gap-2 overflow-x-auto scrollbar-none px-10 py-1 w-full select-none"
          >
            {MENUBAR_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setSelectedTab(tab);
                  setVisibleCount(8);
                }}
                className={cn(
                  'h-8 shrink-0 px-4 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all border',
                  selectedTab === tab
                    ? 'bg-black border-black text-white'
                    : 'bg-[#F2F2F3] border-[#E5E5E6] text-gray-700 hover:bg-gray-100 hover:text-black'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scrollMenuBar('right')}
            className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E6] bg-white text-black hover:bg-gray-50 shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* ── Mobile Filters Button ── */}
        <div className="flex lg:hidden items-center justify-between mb-4">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E6] rounded text-[14px] font-bold text-black"
          >
            <Filter size={16} />
            <span>Filters ({activeFilterPills.length})</span>
          </button>
          
          <span className="text-[14px] text-gray-600">
            {filteredProducts.length} Results
          </span>
        </div>

        {/* ── 2. Main Layout (Sidebar + Grid) ── */}
        <div className="flex gap-8 relative items-start">
          
          {/* ── Left Sidebar (Desktop) ── */}
          <aside className="hidden lg:block w-[240px] shrink-0 border-r border-[#E5E5E6] pr-6 space-y-6">
            
            {/* Filter Pills Tag Panel */}
            {activeFilterPills.length > 0 && (
              <div className="space-y-2 border-b border-[#E5E5E6] pb-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Filtered by</h3>
                  <button
                    onClick={handleClearFilters}
                    className="text-[12px] font-semibold text-red-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeFilterPills.map((pill) => (
                    <span
                      key={pill.id}
                      className="inline-flex items-center gap-1 bg-[#F2F2F3] border border-[#E5E5E6] px-2 py-0.5 rounded text-[12px] text-black"
                    >
                      {pill.label}
                      <button
                        onClick={() => handleRemovePill(pill.id)}
                        className="text-gray-400 hover:text-black"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Everyday Essential Toggle Pill */}
            <div className="border-b border-[#E5E5E6] pb-5">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isEverydayEssential === true}
                  onChange={(e) => setIsEverydayEssential(e.target.checked ? true : null)}
                  className="h-4 w-4 rounded border-[#E5E5E6] text-black focus:ring-black accent-black"
                />
                <span className="text-[14px] font-bold text-gray-800">Everyday Essential</span>
              </label>
            </div>

            {/* Category Filter Group */}
            <div className="border-b border-[#E5E5E6] pb-5 space-y-3">
              <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(8);
                    }}
                    className={cn(
                      'block w-full text-left text-[14px] hover:text-[#dec33a] transition-all',
                      selectedCategory === cat ? 'font-bold text-black border-l-2 border-black pl-2' : 'text-gray-600 pl-2'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter Group */}
            <div className="border-b border-[#E5E5E6] pb-5 space-y-3">
              <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Customer Review</h3>
              <div className="space-y-1.5">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => {
                      setMinRating(stars);
                      setVisibleCount(8);
                    }}
                    className={cn(
                      'flex items-center gap-1.5 w-full text-[13px] hover:bg-gray-50 p-1.5 rounded transition-all',
                      minRating === stars ? 'bg-gray-100 font-semibold' : 'text-gray-600'
                    )}
                  >
                    <div className="flex gap-0.5 text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < stars ? 'currentColor' : 'none'}
                          className="shrink-0"
                        />
                      ))}
                    </div>
                    <span>&amp; Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Group */}
            <div className="border-b border-[#E5E5E6] pb-5 space-y-3">
              <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Price</h3>
              <div className="space-y-2">
                <span className="text-[14px] text-gray-700 font-medium block">
                  $0 - ${maxPrice}
                </span>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setVisibleCount(8);
                  }}
                  className="w-full accent-black bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Discount Filter Group */}
            <div className="space-y-3 pb-2">
              <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">Discount</h3>
              <div className="space-y-2">
                {DISCOUNTS.map((disc) => (
                  <label key={disc.value} className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="discount-group"
                      checked={selectedDiscount === disc.value}
                      onChange={() => {
                        setSelectedDiscount(disc.value);
                        setVisibleCount(8);
                      }}
                      className="h-4 w-4 border-[#E5E5E6] text-black focus:ring-black accent-black"
                    />
                    <span className="text-[13px] text-gray-600">{disc.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* ── Right Product Catalog Grid ── */}
          <div className="flex-1 space-y-8">
            
            {/* Catalog Info Bar (Desktop) */}
            <div className="hidden lg:flex items-center justify-between">
              <span className="text-[14px] text-gray-600">
                Showing {displayedProducts.length} of {filteredProducts.length} deals
              </span>
            </div>

            {/* Empty State */}
            {displayedProducts.length === 0 ? (
              <div className="text-center py-20 border border-[#E5E5E6] rounded-lg bg-gray-50 flex flex-col items-center justify-center gap-4">
                <span className="text-[18px] font-bold text-gray-800">No deals matched your criteria.</span>
                <p className="text-[14px] text-gray-500 max-w-[400px]">
                  Try resetting the filter sliders, categories, or price metrics to discover available products.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-[#dec33a] hover:bg-[#c9b034] text-black px-6 py-2.5 rounded font-bold transition-all text-[14px]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white border border-[#E5E5E6] rounded overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Image Block */}
                    <Link href={`/product/deals/${product.id}`} className="relative w-full h-[180px] bg-gray-50 overflow-hidden">
                      <Image
                        src={product.imageSrc}
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Content Block */}
                    <div className="p-4 flex-1 flex flex-col gap-2.5">
                      {/* Badge Highlights */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-[#CC0C39] px-2 py-0.5 rounded-[2px] text-[11px] font-bold text-white">
                          {product.discountBadge}
                        </span>
                        <span className="text-[10px] font-semibold text-[#CC0C39] uppercase">
                          {product.offerLabel}
                        </span>
                      </div>

                      {/* Product Title */}
                      <Link href={`/product/deals/${product.id}`} className="text-[14px] text-black font-semibold hover:text-[#dec33a] line-clamp-2 min-h-[40px] leading-tight">
                        {product.title}
                      </Link>

                      {/* Rating Block */}
                      <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                        <div className="flex text-orange-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span>{product.rating} ({product.reviewsCount}+)</span>
                      </div>

                      {/* Pricing Block */}
                      <div className="flex items-baseline gap-2 mt-auto">
                        <span className="text-[20px] font-bold text-black">${product.price}</span>
                        <span className="text-[14px] text-gray-500 line-through">${product.originalPrice}</span>
                      </div>

                      {/* Shipping detail or tags */}
                      {product.shippingText && (
                        <span className="text-[12px] text-gray-500 font-medium leading-none">
                          {product.shippingText}
                        </span>
                      )}

                      {/* Explore Button */}
                      <Link
                        href={`/product/deals/${product.id}`}
                        className="mt-2 border border-[#E5E5E6] group-hover:border-[#dec33a] group-hover:bg-[#dec33a]/10 hover:bg-[#dec33a]/20 transition-all rounded py-2 px-3 text-[13px] font-bold text-gray-800 flex items-center justify-between"
                      >
                        <span>Explore More</span>
                        <ArrowRight size={14} className="text-gray-600 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > visibleCount && (
              <div className="flex justify-center pt-8 border-t border-[#E5E5E6]">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="bg-white border border-[#E5E5E6] hover:border-black text-black font-bold text-[14px] px-8 py-3 rounded transition-all min-w-[211px]"
                >
                  Show More
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ── 3. Mobile Filters Slide-over / Drawer ── */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50" role="dialog" aria-modal="true">
          {/* Overlay background */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileSidebar(false)} />

          {/* Drawer Content */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white py-4 pb-12 shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-4 pb-4 border-b border-[#E5E5E6]">
              <h2 className="text-[16px] font-bold text-black uppercase">Filters</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Filter Pills Tag Panel */}
              {activeFilterPills.length > 0 && (
                <div className="space-y-2 border-b border-[#E5E5E6] pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-black uppercase">Active Filters</span>
                    <button
                      onClick={handleClearFilters}
                      className="text-[11px] font-semibold text-red-600"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeFilterPills.map((pill) => (
                      <span
                        key={pill.id}
                        className="inline-flex items-center gap-1 bg-[#F2F2F3] border border-[#E5E5E6] px-2 py-0.5 rounded text-[11px] text-black"
                      >
                        {pill.label}
                        <button onClick={() => handleRemovePill(pill.id)}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Everyday Essential Toggle Pill */}
              <div className="border-b border-[#E5E5E6] pb-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isEverydayEssential === true}
                    onChange={(e) => setIsEverydayEssential(e.target.checked ? true : null)}
                    className="h-4 w-4 rounded border-[#E5E5E6] text-black accent-black"
                  />
                  <span className="text-[13px] font-bold text-gray-800">Everyday Essential</span>
                </label>
              </div>

              {/* Category Filter Group */}
              <div className="border-b border-[#E5E5E6] pb-4 space-y-3">
                <h3 className="text-[13px] font-bold text-black uppercase">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setVisibleCount(8);
                      }}
                      className={cn(
                        'block w-full text-left text-[13px] py-1 pl-2',
                        selectedCategory === cat ? 'font-bold text-black border-l-2 border-black' : 'text-gray-600'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter Group */}
              <div className="border-b border-[#E5E5E6] pb-4 space-y-3">
                <h3 className="text-[13px] font-bold text-black uppercase">Customer Review</h3>
                <div className="space-y-1.5">
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => {
                        setMinRating(stars);
                        setVisibleCount(8);
                      }}
                      className={cn(
                        'flex items-center gap-1.5 w-full text-[12px] p-1 rounded',
                        minRating === stars ? 'bg-gray-100 font-semibold text-black' : 'text-gray-600'
                      )}
                    >
                      <div className="flex gap-0.5 text-orange-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < stars ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <span>&amp; Up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Group */}
              <div className="border-b border-[#E5E5E6] pb-4 space-y-3">
                <h3 className="text-[13px] font-bold text-black uppercase">Price</h3>
                <div className="space-y-2">
                  <span className="text-[13px] text-gray-700 font-medium block">
                    $0 - ${maxPrice}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setVisibleCount(8);
                    }}
                    className="w-full accent-black bg-gray-200 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Discount Filter Group */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-bold text-black uppercase">Discount</h3>
                <div className="space-y-2">
                  {DISCOUNTS.map((disc) => (
                    <label key={disc.value} className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="discount-mobile"
                        checked={selectedDiscount === disc.value}
                        onChange={() => {
                          setSelectedDiscount(disc.value);
                          setVisibleCount(8);
                        }}
                        className="h-4 w-4 border-[#E5E5E6] text-black accent-black"
                      />
                      <span className="text-[12px] text-gray-600">{disc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
