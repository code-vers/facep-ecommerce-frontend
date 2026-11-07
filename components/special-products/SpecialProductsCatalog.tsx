'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Star,
  Award,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Gem,
  CheckCircle2,
  SlidersHorizontal,
  PackageCheck,
  BadgeCheck,
  Filter,
} from 'lucide-react';
import {
  useSpecialProducts,
} from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';
import { getImageUrl } from '@/lib/utils';

export default function SpecialProductsCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt:desc');
  const [priceTier, setPriceTier] = useState<'all' | 'under50' | '50to150' | 'over150'>('all');
  const [curatorTier, setCuratorTier] = useState<'all' | 'editors-pick'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories for filtering
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  // Price range mapping
  const priceFilter = useMemo(() => {
    switch (priceTier) {
      case 'under50':
        return { maxPrice: 50 };
      case '50to150':
        return { minPrice: 50, maxPrice: 150 };
      case 'over150':
        return { minPrice: 150 };
      default:
        return {};
    }
  }, [priceTier]);

  // Fetch special products
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: 16,
      search: searchTerm.trim() || undefined,
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: sortBy,
      isSpecialProduct: true,
      ...priceFilter,
    };
  }, [currentPage, searchTerm, selectedCategory, sortBy, priceFilter]);

  const { data, isLoading, isFetching } = useSpecialProducts(queryParams);
  const rawProducts = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 16, totalPage: 1 };

  // Filter editor's pick client-side if selected
  const products = useMemo(() => {
    if (curatorTier === 'editors-pick') {
      return rawProducts.filter((p) => Number(p.basePrice) >= 30);
    }
    return rawProducts;
  }, [rawProducts, curatorTier]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('createdAt:desc');
    setPriceTier('all');
    setCuratorTier('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategory !== 'all' ||
    priceTier !== 'all' ||
    curatorTier !== 'all' ||
    sortBy !== 'createdAt:desc';

  return (
    <div className="w-full min-h-screen bg-[#F4F5F7] text-[#111827]">
      
      {/* ── 1. Top Breadcrumb Bar ── */}
      <nav
        aria-label="Breadcrumb"
        className="w-full bg-[#11161B] border-b border-[#242D36] py-2.5 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-xs text-gray-400"
      >
        <div className="mx-auto max-w-[1760px] flex items-center justify-between font-normal">
          <div className="flex items-center gap-1.5">
            <Link href="/" className="text-gray-400 hover:text-[#DEC33A] hover:underline transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/products" className="text-gray-400 hover:text-[#DEC33A] hover:underline transition-colors">
              Collections
            </Link>
            <span>›</span>
            <span className="font-semibold text-white">The Signature Gallery</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-[#DEC33A]">
            <Gem size={13} className="text-[#DEC33A]" />
            <span>Curator&apos;s Reserve • Verified Standards</span>
          </div>
        </div>
      </nav>

      {/* ── 2. Editorial Gallery Masthead (Full-Width Sophisticated Header) ── */}
      <section className="relative w-full bg-linear-to-b from-[#11161B] via-[#161E25] to-[#12161A] text-white border-b border-[#2A3440] overflow-hidden py-12 sm:py-16 md:py-20">
        {/* Subtle, soft ambient gold luxury illumination */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-90 bg-[#DEC33A]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 text-center relative z-10 flex flex-col items-center gap-5">
          {/* Gold Curator Pill */}
          <div className="inline-flex items-center gap-2 bg-[#DEC33A]/15 border border-[#DEC33A]/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#DEC33A] shadow-xs">
            <Gem size={13} className="fill-[#DEC33A]" />
            <span>The Premier Gallery • Curated Editions</span>
          </div>

          {/* Headline */}
          <h1 className="text-[34px] sm:text-[46px] md:text-[56px] font-bold tracking-tight text-white leading-[1.08] font-[Arial]">
            Special Products &amp; Signature Highlights
          </h1>

          {/* Editorial Paragraph */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl font-light">
            An exclusive gallery of standout craftsmanship, customer-acclaimed innovations, and premier vendor items specially selected for superior build quality and performance.
          </p>

          {/* 3 Quality Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-3xl pt-3">
            <div className="flex items-center justify-center gap-2.5 bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-xs">
              <Award size={18} className="text-[#DEC33A] shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight">Master Craftsmanship</span>
                <span className="text-[11px] text-gray-400 block leading-tight">Superior build materials</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-xs">
              <Star size={18} className="text-[#DEC33A] fill-[#DEC33A] shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight">Customer Acclaimed</span>
                <span className="text-[11px] text-gray-400 block leading-tight">Consistently 4.8+ rating</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-xs">
              <ShieldCheck size={18} className="text-[#DEC33A] shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight">Verified Provenance</span>
                <span className="text-[11px] text-gray-400 block leading-tight">Direct official sellers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Boutique Layout: Curator's Filter Sidebar + Spacious Gallery Grid ── */}
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white border border-[#E5E5E6] rounded-lg p-3 shadow-xs">
          <div className="text-xs font-bold text-gray-800">
            {meta.total} Special Products Curated
          </div>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181F26] text-white text-xs font-bold rounded-sm cursor-pointer"
          >
            <Filter size={13} />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Curator Filters'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: The Curator's Filter Sidebar (Sticky, ~280px) ── */}
          <aside
            className={`lg:col-span-3 lg:sticky lg:top-20 flex flex-col gap-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Sidebar Container */}
            <div className="bg-white border border-[#E2E4E8] rounded-xl p-5 shadow-xs flex flex-col gap-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-[#DEC33A]" />
                  <span className="text-sm font-bold text-black uppercase tracking-wider">
                    Curator&apos;s Filters
                  </span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Search Inside Gallery */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="curator-search" className="text-xs font-bold text-gray-700">
                  Search Gallery
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="curator-search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by title or maker..."
                    className="w-full pl-8 pr-7 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-black bg-gray-50 focus:bg-white transition-all placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Curated Category List */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Special Collections
                </span>
                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all text-left cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#181F26] text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Curations</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded ${
                      selectedCategory === 'all' ? 'bg-[#DEC33A] text-black font-bold' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {meta.total}
                    </span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all text-left cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#181F26] text-white font-bold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tier Selection */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Price Tier
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPriceTier('all');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors cursor-pointer ${
                      priceTier === 'all'
                        ? 'bg-[#181F26] text-[#DEC33A] border-[#181F26] font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    All Tiers
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceTier('under50');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors cursor-pointer ${
                      priceTier === 'under50'
                        ? 'bg-[#181F26] text-[#DEC33A] border-[#181F26] font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Under $50
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceTier('50to150');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors cursor-pointer ${
                      priceTier === '50to150'
                        ? 'bg-[#181F26] text-[#DEC33A] border-[#181F26] font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    $50 — $150
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceTier('over150');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors cursor-pointer ${
                      priceTier === 'over150'
                        ? 'bg-[#181F26] text-[#DEC33A] border-[#181F26] font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    $150+ Luxury
                  </button>
                </div>
              </div>

              {/* Curator Standards Filter */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Editorial Tier
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCuratorTier(curatorTier === 'editors-pick' ? 'all' : 'editors-pick');
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all border cursor-pointer ${
                      curatorTier === 'editors-pick'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Award size={14} className="text-[#DEC33A]" />
                    <span>Editor&apos;s Pick Only</span>
                  </button>
                </div>
              </div>

              {/* The Curator's Assurance Box */}
              <div className="mt-2 bg-[#181F26] text-white rounded-lg p-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#DEC33A]">
                  <BadgeCheck size={16} />
                  <span>The Facep Assurance</span>
                </div>
                <div className="flex flex-col gap-2 text-[11px] text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#229A4E] shrink-0" />
                    <span>Direct-from-maker inspection</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#229A4E] shrink-0" />
                    <span>White-glove priority shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#229A4E] shrink-0" />
                    <span>30-Day risk-free returns</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* ── RIGHT COLUMN: The Luxury Gallery Grid (9 Columns on Desktop) ── */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Gallery Top Toolbar */}
            <div className="bg-white border border-[#E2E4E8] rounded-xl px-5 py-3.5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">
                  Curated Collection
                </span>
                <span className="text-sm font-bold text-black">
                  Showing {products.length} of {meta.total} Premier Selections
                </span>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <label htmlFor="gallery-sort" className="text-xs font-semibold text-gray-600">
                  Sort By:
                </label>
                <select
                  id="gallery-sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-md bg-white focus:outline-none focus:border-black text-gray-800 cursor-pointer"
                >
                  <option value="createdAt:desc">✦ Curator&apos;s Highlight</option>
                  <option value="price-desc">Price: Luxury to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="discount-desc">Highest Discount</option>
                  <option value="name-asc">Product: A to Z</option>
                </select>
              </div>
            </div>

            {/* Active Chips Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">Applied Filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-800">
                    Keyword: <strong>{searchTerm}</strong>
                    <button type="button" onClick={() => setSearchTerm('')} className="hover:text-red-600 ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-800">
                    Collection: <strong>{categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}</strong>
                    <button type="button" onClick={() => setSelectedCategory('all')} className="hover:text-red-600 ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {priceTier !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-800">
                    Tier: <strong>{priceTier}</strong>
                    <button type="button" onClick={() => setPriceTier('all')} className="hover:text-red-600 ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {curatorTier === 'editors-pick' && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-amber-800 font-bold">
                    Editor&apos;s Pick
                    <button type="button" onClick={() => setCuratorTier('all')} className="hover:text-red-600 ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* ── Spacious Boutique Gallery Grid (3 to 4 Columns Max) ── */}
            <div>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`skeleton-special-${i}`}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4 animate-pulse"
                    >
                      <div className="w-full h-56 bg-gray-200 rounded-lg" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-10 bg-gray-200 rounded mt-2" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-10 sm:p-14 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-10 shadow-xs">
                  <div className="size-16 rounded-full bg-[#181F26]/10 flex items-center justify-center text-[#181F26] mb-4">
                    <Gem size={30} />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1">
                    No Special Products In This Selection
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    No items match the currently selected collection filters. Try clearing your filters or exploring our other curated edits.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-[#181F26] text-white font-bold text-xs rounded-sm hover:bg-black transition-colors cursor-pointer"
                  >
                    Reset Gallery Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
                  {products.map((product) => {
                    return (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200/90 rounded-xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                      >
                        {/* Luxury Photo Frame */}
                        <Link
                          href={`/products/${product.slug}`}
                          className="relative w-full h-56 sm:h-60 bg-[#FAFAFA] flex items-center justify-center p-4 border-b border-gray-100 overflow-hidden"
                        >
                          <Image
                            src={getImageUrl(product.thumbnail)}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
                          />

                          {/* Minimalist Curator Badge */}
                          <div className="absolute top-3 left-3 bg-[#11161B] text-[#DEC33A] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs shadow-sm flex items-center gap-1 border border-white/10">
                            <Sparkles size={11} className="text-[#DEC33A]" />
                            <span>Curator&apos;s Pick</span>
                          </div>

                          {/* Verified Vendor Pill */}
                          <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-200">
                            Verified Standard
                          </div>
                        </Link>

                        {/* Boutique Content Body */}
                        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
                          <div className="flex flex-col gap-1.5">
                            {/* Tracked Category */}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                              {product.category?.name || 'Exclusive Edit'}
                            </span>

                            {/* Product Name */}
                            <Link
                              href={`/products/${product.slug}`}
                              className="text-sm sm:text-[15px] font-bold text-[#111827] group-hover:text-[#B49A2E] line-clamp-2 leading-snug transition-colors font-[Arial]"
                              title={product.name}
                            >
                              {product.name}
                            </Link>

                            {/* Gold Star Rating */}
                            <div className="flex items-center gap-1.5 pt-1 text-xs text-gray-600">
                              <div className="flex items-center text-[#DEC33A]">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className={i < 4 ? 'fill-[#DEC33A]' : 'fill-[#DEC33A] opacity-70'}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-gray-900">4.9</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-[11px] text-gray-500">Editor Endorsed</span>
                            </div>
                          </div>

                          {/* Price & Action Block */}
                          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                            <div className="flex items-baseline justify-between">
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg sm:text-xl font-bold text-[#111827]">
                                  ${Number(product.basePrice).toFixed(2)}
                                </span>
                                {product.oldPrice && Number(product.oldPrice) > Number(product.basePrice) && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ${Number(product.oldPrice).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-semibold text-[#229A4E]">
                                Ready to Dispatch
                              </span>
                            </div>

                            {/* Expedited note */}
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <PackageCheck size={12} className="text-gray-400" />
                              <span>Complimentary Expedited Delivery</span>
                            </span>

                            {/* Sleek Obsidian Button */}
                            <Link
                              href={`/products/${product.slug}`}
                              className="mt-1 w-full py-2.5 px-4 bg-[#181F26] hover:bg-[#DEC33A] text-white hover:text-black font-bold text-xs rounded-xs text-center transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-xs"
                            >
                              <span>Discover Details</span>
                              <ArrowRight size={13} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Editorial Quote Breakout ── */}
            <div className="bg-linear-to-r from-[#181F26] to-[#12161A] text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 my-4 shadow-sm border border-white/10">
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-[#DEC33A]">
                  The Curator&apos;s Standard
                </span>
                <p className="text-sm sm:text-base text-gray-200 font-light italic max-w-xl">
                  &ldquo;Every item in this gallery has undergone multi-point inspection for material integrity, seller reliability, and consistent customer acclaim.&rdquo;
                </p>
                <span className="text-xs text-gray-400 font-semibold">
                  — Facep Editorial Board
                </span>
              </div>
              <Link
                href="/products"
                className="shrink-0 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-sm border border-white/20 transition-colors"
              >
                Browse Full Catalog
              </Link>
            </div>

            {/* ── Pagination ── */}
            {meta.totalPage > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 bg-white rounded-xl p-4 shadow-2xs">
                <div className="text-xs text-gray-600">
                  Showing page <strong className="text-black">{meta.page}</strong> of{' '}
                  <strong className="text-black">{meta.totalPage}</strong> (Total {meta.total} Special Products)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1 || isFetching}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-sm border border-gray-200 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-black transition-colors cursor-pointer"
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
                                  ? 'bg-[#181F26] text-[#DEC33A]'
                                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
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
                    className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-sm border border-gray-200 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-black transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
