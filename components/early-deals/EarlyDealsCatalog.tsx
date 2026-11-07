'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Flame,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Tag,
  Loader2,
  Clock,
  ShieldCheck,
  Truck,
  Percent,
  X,
  Star,
  CheckCircle2,
} from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import {
  useEarlyDeals,
  mapProductToCarousel,
} from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';
import { getImageUrl } from '@/lib/utils';
import type { Product } from '@/lib/api/product';

export default function EarlyDealsCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt:desc');
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50to100' | 'over100'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Fetch categories for filtering
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  // Price range filters
  const priceFilter = useMemo(() => {
    switch (priceRange) {
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
  const products = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 18, totalPage: 1 };

  // Select spotlight deal (first product or fallback)
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
    setSortBy('createdAt:desc');
    setPriceRange('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchTerm) || selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'createdAt:desc';

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#0F1111]">
      {/* ── 1. Top Breadcrumb Bar ── */}
      <nav
        aria-label="Breadcrumb"
        className="w-full bg-white border-b border-[#E5E5E6] py-2.5 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 text-xs text-[#565959]"
      >
        <div className="mx-auto max-w-[1760px] flex items-center gap-1.5 font-normal">
          <Link href="/" className="hover:text-[#165DD0] hover:underline transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/todays-deal" className="hover:text-[#165DD0] hover:underline transition-colors">
            Deals
          </Link>
          <span>›</span>
          <span className="font-semibold text-black">Early Deals</span>
        </div>
      </nav>

      {/* ── 2. Human-Crafted Hero Section ── */}
      <section className="relative w-full bg-gradient-to-br from-[#FFFDF2] via-[#FEF7D9] to-[#FCEEB7] border-b border-[#E8DFB8] overflow-hidden py-8 sm:py-10 md:py-12 lg:py-14">
        {/* Subtle, refined background glow (no artificial dot patterns) */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#DEC33A]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 translate-y-1/3 w-80 h-80 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Human Editorial Hook & Perks */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-black">
              {/* Event Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#CC0C39] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-[3px] shadow-xs">
                  <Flame size={13} className="fill-white" />
                  <span>Early Access Event</span>
                </span>
                <span className="text-xs font-semibold text-[#8B6E00] bg-[#DEC33A]/25 px-2.5 py-1 rounded-[3px] border border-[#DEC33A]/40">
                  Members & First Look
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[30px] sm:text-[38px] md:text-[44px] lg:text-[50px] font-bold tracking-tight text-[#0A0A0A] leading-[1.12] font-[Arial]">
                Early Deals & Exclusive First Look
              </h1>

              {/* Editorial Subheadline */}
              <p className="text-sm sm:text-base md:text-[17px] text-gray-800 leading-relaxed max-w-2xl font-normal">
                Be the first to claim limited-allocation markdowns on top electronics, home appliances, apparel, and daily essentials before general public sale allocations run out.
              </p>

              {/* 3 Human Retail Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-2">
                <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-xs border border-[#DEC33A]/50 rounded-lg p-2.5 shadow-2xs">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#DEC33A] text-black">
                    <Tag size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-black leading-tight">Verified Pricing</span>
                    <span className="text-[11px] text-gray-600 leading-tight">Direct vendor markdowns</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-xs border border-[#DEC33A]/50 rounded-lg p-2.5 shadow-2xs">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#DEC33A] text-black">
                    <Clock size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-black leading-tight">Early Allocations</span>
                    <span className="text-[11px] text-gray-600 leading-tight">Reserved stock batches</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-xs border border-[#DEC33A]/50 rounded-lg p-2.5 shadow-2xs">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#DEC33A] text-black">
                    <Truck size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-black leading-tight">Fast Dispatch</span>
                    <span className="text-[11px] text-gray-600 leading-tight">Doorstep delivery available</span>
                  </div>
                </div>
              </div>

              {/* Quick Jump Category Chips in Hero */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-semibold text-gray-700 mr-1">Quick Browse:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors border ${
                    selectedCategory === 'all' && priceRange === 'all'
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white/80 hover:bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  All Early Deals
                </button>
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors border ${
                      selectedCategory === cat.id
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white/80 hover:bg-white text-gray-800 border-gray-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPriceRange('under50');
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors border ${
                    priceRange === 'under50'
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white/80 hover:bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  ⚡ Under $50
                </button>
              </div>
            </div>

            {/* Right Column: Tangible Merchandising Deal Spotlight Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              {spotlightProduct ? (
                <div className="w-full max-w-[420px] bg-white border border-[#E5E5E6] rounded-xl shadow-lg p-5 flex flex-col gap-3.5 transition-all hover:shadow-xl relative">
                  {/* Spotlight Top Label */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#CC0C39] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-sm">
                      <Sparkles size={12} />
                      <span>Featured Early Drop</span>
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {spotlightProduct.category?.name || 'Top Pick'}
                    </span>
                  </div>

                  {/* Spotlight Image with Link */}
                  <Link
                    href={`/products/${spotlightProduct.slug}`}
                    className="relative w-full h-52 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center group/img"
                  >
                    <Image
                      src={getImageUrl(spotlightProduct.thumbnail)}
                      alt={spotlightProduct.name}
                      fill
                      unoptimized
                      priority
                      className="object-contain p-3 transition-transform duration-300 group-hover/img:scale-105"
                    />
                    {Number(spotlightProduct.discountValue) > 0 && (
                      <span className="absolute top-2 left-2 rounded-xs bg-[#CC0C39] px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                        {spotlightProduct.discountValue}
                        {spotlightProduct.discountType === 'PERCENTAGE' ? '%' : ''} OFF
                      </span>
                    )}
                  </Link>

                  {/* Spotlight Content */}
                  <div className="flex flex-col gap-1.5">
                    <Link
                      href={`/products/${spotlightProduct.slug}`}
                      className="text-base font-bold text-[#0F1111] leading-snug hover:text-[#165DD0] line-clamp-1 transition-colors"
                      title={spotlightProduct.name}
                    >
                      {spotlightProduct.name}
                    </Link>

                    {/* Star ratings */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="flex items-center text-[#F09000]">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < 4 ? 'fill-[#F09000]' : 'fill-[#F09000] opacity-80'}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-800">4.8</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[#165DD0]">Verified Early Deal</span>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-2xl font-bold text-black">
                        ${Number(spotlightProduct.basePrice).toFixed(2)}
                      </span>
                      {spotlightProduct.oldPrice && Number(spotlightProduct.oldPrice) > Number(spotlightProduct.basePrice) && (
                        <span className="text-sm text-gray-500 line-through">
                          ${Number(spotlightProduct.oldPrice).toFixed(2)}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[#229A4E] ml-auto">
                        In Stock Now
                      </span>
                    </div>

                    {/* Stock claim bar */}
                    <div className="flex flex-col gap-1 pt-1">
                      <div className="flex justify-between text-[11px] font-medium text-gray-600">
                        <span>Early batch allocation</span>
                        <span className="text-[#CC0C39] font-bold">Limited Quantities</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#DEC33A] to-[#F09000] rounded-full w-[76%]" />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/products/${spotlightProduct.slug}`}
                      className="mt-2 w-full py-2.5 px-4 rounded-sm bg-[#DEC33A] hover:bg-[#C9B034] active:bg-[#B49A2E] text-black font-bold text-xs text-center transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <span>Claim Early Deal</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-[420px] bg-white border border-[#E5E5E6] rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center gap-3">
                  <div className="size-14 rounded-full bg-[#DEC33A]/20 flex items-center justify-center text-[#B4950A]">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-base font-bold text-black">Early Bird Showcase</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Exclusive hand-curated savings updated daily directly by verified platform sellers.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Category Carousel & Filter Bar ── */}
      <section className="w-full bg-white border-b border-[#E5E5E6] py-3.5 sticky top-[56px] sm:top-[64px] z-20 shadow-2xs">
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider shrink-0 hidden md:inline">
              Categories:
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

            {/* Scrollable Category Pills */}
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
                    ? 'bg-[#DEC33A] text-black border-[#DEC33A] shadow-xs'
                    : 'bg-white text-gray-700 border-[#E5E5E6] hover:border-gray-400 hover:bg-gray-50'
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
                      ? 'bg-[#DEC33A] text-black border-[#DEC33A] shadow-xs'
                      : 'bg-white text-gray-700 border-[#E5E5E6] hover:border-gray-400 hover:bg-gray-50'
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
        
        {/* Search, Sort, and Filter Toolbar */}
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
              placeholder="Search early deals by name, brand, or tag..."
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
            {/* Price Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="early-deals-price" className="text-xs font-semibold text-gray-600 hidden sm:inline">
                Price:
              </label>
              <select
                id="early-deals-price"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-xs font-medium border border-[#E5E5E6] rounded-md bg-white focus:outline-none focus:border-black text-gray-800 cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under50">Under $50</option>
                <option value="50to100">$50 to $100</option>
                <option value="over100">$100 and Above</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="early-deals-sort" className="text-xs font-semibold text-gray-600 hidden sm:inline">
                Sort:
              </label>
              <select
                id="early-deals-sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-xs font-medium border border-[#E5E5E6] rounded-md bg-white focus:outline-none focus:border-black text-gray-800 cursor-pointer"
              >
                <option value="createdAt:desc">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount-desc">Biggest Discount %</option>
                <option value="name-asc">Product Name: A to Z</option>
              </select>
            </div>

            {/* Reset Filters button */}
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

        {/* Active Filters Pill Bar */}
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
                  {priceRange === 'under50'
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
          </div>
        )}

        {/* ── 5. Product Grid ── */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`skeleton-card-${i}`}
                  className="bg-white border border-[#E5E5E6] rounded-[4px] p-2 sm:p-3 flex flex-col gap-3 animate-pulse"
                >
                  <div className="w-full h-[180px] bg-gray-200 rounded-[2px]" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#E5E5E6] rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 sm:my-12 shadow-xs">
              <div className="size-16 rounded-full bg-[#DEC33A]/20 flex items-center justify-center text-[#B4950A] mb-4">
                <Flame size={32} />
              </div>
              <h3 className="text-xl font-bold text-black mb-1">
                No Early Deals Matching Your Selection
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                We couldn&apos;t find any active early deal items with these specific filters. Try resetting your search or exploring our complete catalog.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#DEC33A] text-black font-bold text-xs rounded-sm hover:bg-[#cbb130] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
                <Link
                  href="/products"
                  className="px-5 py-2.5 bg-gray-100 text-gray-800 font-semibold text-xs rounded-sm hover:bg-gray-200 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
              {products.map((product) => {
                const card = mapProductToCarousel(product);
                return (
                  <Link
                    key={product.id}
                    href={card.href || `/products/${product.slug}`}
                    className="flex h-full group focus-visible:outline-none"
                  >
                    <ProductCard
                      title={card.title}
                      imageSrc={card.imageSrc}
                      imageAlt={card.imageAlt}
                      price={card.price}
                      originalPrice={card.originalPrice}
                      badgeText={card.badgeText || 'Early Deal'}
                      badgeLabel={card.badgeLabel}
                      offerText={card.offerText}
                      shippingText={card.shippingText}
                      rating={card.rating}
                      reviewCount={card.reviewCount}
                      buttonVariant="see-options"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 6. Pagination Controls ── */}
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
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-sm border border-[#E5E5E6] hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-black transition-colors"
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
                          className={`size-7 text-xs font-bold rounded-sm transition-colors ${
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
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-sm border border-[#E5E5E6] hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-black transition-colors"
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
