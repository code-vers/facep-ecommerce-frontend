'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Gem,
  CheckCircle2,
  SlidersHorizontal,
  BadgeCheck,
  Filter,
} from 'lucide-react';
import { useSpecialProducts } from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';
import { useCartStore } from '@/contexts/CartContext';
import { recordProductView } from '@/lib/view-history';
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/lib/api/product';
import { toast } from 'sonner';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);
const imageUrl = (value?: string | null) =>
  !value
    ? '/placeholder.png'
    : value.startsWith('http')
      ? value
      : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;

const formatPrice = (value: number | string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

const effectivePrice = (product: Product) => {
  const base = Number(product.basePrice);
  const value = Number(product.discountValue ?? 0);
  if (!product.discountType || !value) return base;
  const now = Date.now();
  if (product.dealStartDate && now < new Date(product.dealStartDate).getTime()) return base;
  if (product.dealEndDate && now > new Date(product.dealEndDate).getTime()) return base;
  return product.discountType === 'PERCENTAGE'
    ? Math.max(0, base - (base * value) / 100)
    : Math.max(0, base - value);
};

export default function SpecialProductsCatalog() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

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

  const handleAddToCart = (product: Product, price: number) => {
    addToCart({
      id: product.id,
      cartItemId: `${product.id}---`,
      name: product.name,
      slug: product.slug,
      price,
      quantity: 1,
      image: imageUrl(product.thumbnail),
      sellerName: product.vendor?.storefront?.storeName || 'Facep Store',
    });

    toast.success(`Added "${product.name}" to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategory !== 'all' ||
    priceTier !== 'all' ||
    curatorTier !== 'all' ||
    sortBy !== 'createdAt:desc';

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#0F1111]">
      
      {/* ── 1. Top Breadcrumb Bar (Matches /coupons) ── */}
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
            <Link href="/products" className="hover:text-[#165DD0] hover:underline transition-colors">
              Collections
            </Link>
            <span>›</span>
            <span className="font-semibold text-black">Special Products</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Curator&apos;s Reserve • Verified Standards</span>
          </div>
        </div>
      </nav>

      {/* ── 2. Distinctive Promo Hero Section (Matches /coupons lighter gold gradient) ── */}
      <section className="relative w-full bg-linear-to-r from-[#FFFDF2] via-[#FEF7D9] to-[#FCEEB7] border-b border-[#E8DFB8] overflow-hidden py-8 sm:py-12 md:py-14">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#DEC33A]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative z-10">
          <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
            
            {/* Live Ticker Badge */}
            <div className="inline-flex items-center gap-2 bg-[#CC0C39] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-[3px] shadow-xs">
              <Sparkles size={13} className="fill-white" />
              <span>The Premier Gallery • Curated Editions</span>
            </div>

            {/* Headline */}
            <h1 className="text-[32px] sm:text-[42px] md:text-[50px] font-extrabold tracking-tight text-[#0A0A0A] leading-[1.1] font-[Arial]">
              Special Products &amp; Signature Highlights
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed font-normal">
              An exclusive gallery of standout craftsmanship, customer-acclaimed innovations, and premier vendor items specially selected for superior build quality and performance.
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search special products by title, maker, or department..."
                className="w-full pl-11 pr-10 py-3 sm:py-3.5 text-xs sm:text-sm bg-white border-2 border-gray-300 focus:border-black rounded-lg shadow-sm focus:outline-none placeholder:text-gray-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Quick 3-Pillar Assurance Strip (Matches /coupons 3-step strip) ── */}
      <section className="w-full bg-[#181F26] text-white py-4 border-b border-[#2A3440] shadow-2xs">
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 items-center text-center sm:text-left">
            
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Master Craftsmanship</span>
                <span className="text-[11px] text-gray-400">Superior build materials &amp; design</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Customer Acclaimed</span>
                <span className="text-[11px] text-gray-400">Consistently 4.8+ verified rating</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Verified Provenance</span>
                <span className="text-[11px] text-gray-400">Direct official sellers &amp; guarantee</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Main Gallery Section ── */}
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 py-8">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white border border-[#E5E5E6] rounded-xl p-3 shadow-xs">
          <div className="text-xs font-bold text-gray-800">
            {meta.total} Special Products Curated
          </div>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-sm cursor-pointer"
          >
            <Filter size={13} />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Products'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: Filter Sidebar ── */}
          <aside
            className={`lg:col-span-3 lg:sticky lg:top-20 flex flex-col gap-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Sidebar Container */}
            <div className="bg-white border border-[#E5E5E6] rounded-xl p-5 shadow-xs flex flex-col gap-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-[#DEC33A]" />
                  <span className="text-sm font-bold text-black uppercase tracking-wider">
                    Filters
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
                  Search Within Results
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
                    placeholder="Search by title..."
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
                        ? 'bg-black text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Collections</span>
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
                          ? 'bg-black text-white font-bold'
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
                  Price Range
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
                        ? 'bg-black text-[#DEC33A] border-black font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    All Prices
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceTier('under50');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors cursor-pointer ${
                      priceTier === 'under50'
                        ? 'bg-black text-[#DEC33A] border-black font-bold'
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
                        ? 'bg-black text-[#DEC33A] border-black font-bold'
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
                        ? 'bg-black text-[#DEC33A] border-black font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    $150 &amp; Above
                  </button>
                </div>
              </div>

              {/* Curator Standards Filter */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Curated Tier
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
                        ? 'bg-[#DEC33A]/20 border-[#DEC33A] text-black font-bold'
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

          {/* ── RIGHT COLUMN: Products Grid ── */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Gallery Top Toolbar */}
            <div className="bg-white border border-[#E5E5E6] rounded-xl px-5 py-3.5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">
                  Curated Collection
                </span>
                <span className="text-sm font-bold text-black">
                  Showing {products.length} of {meta.total} Special Products
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
                  <option value="price-desc">Price: High to Low</option>
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

            {/* ── Official Facep Product Cards Grid (Matches /products) ── */}
            <div>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={`skeleton-special-${i}`}
                      className="bg-white border border-[#E5E5E6] rounded-lg p-2.5 flex flex-col gap-2 animate-pulse"
                    >
                      <div className="w-full h-45 bg-gray-200 rounded-t-lg" />
                      <div className="h-3.5 bg-gray-200 rounded w-3/4 mt-1" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-8 bg-gray-200 rounded-xs mt-auto" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white border border-[#E5E5E6] rounded-xl p-10 sm:p-14 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-10 shadow-xs">
                  <div className="size-16 rounded-full bg-[#DEC33A]/20 flex items-center justify-center text-black mb-4">
                    <Gem size={30} className="text-[#9e8316]" />
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
                    className="px-5 py-2.5 bg-[#DEC33A] hover:bg-[#c9b034] text-black font-bold text-xs rounded-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    Reset Gallery Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {products.map((product) => {
                    const price = effectivePrice(product);
                    const hasDiscount = price < Number(product.basePrice);

                    return (
                      <div key={product.id} className="flex h-full w-full">
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => recordProductView(product)}
                          className="flex h-full w-full"
                        >
                          <ProductCard
                            imageSrc={imageUrl(product.thumbnail)}
                            imageAlt={product.name}
                            title={product.name}
                            price={formatPrice(price)}
                            originalPrice={hasDiscount ? formatPrice(product.basePrice) : undefined}
                            badgeText={
                              hasDiscount
                                ? `${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : ''} off`
                                : undefined
                            }
                            offerText={product.dealBadgeText || undefined}
                            shippingText={
                              product.shippingFeeType === 'FREE'
                                ? 'Free Shipping'
                                : product.shippingCost
                                  ? `${formatPrice(product.shippingCost)} Shipping`
                                  : 'Shipping available'
                            }
                            buttonVariant={product.hasVariants ? 'see-options' : 'add-to-cart'}
                            onAddToCart={() => handleAddToCart(product, price)}
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Editorial Quote Breakout (Matches /coupons styling) ── */}
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
                className="shrink-0 px-5 py-2.5 bg-[#DEC33A] hover:bg-[#c9b034] text-black font-bold text-xs rounded-xs transition-colors shadow-2xs"
              >
                Browse Full Catalog
              </Link>
            </div>

            {/* ── Pagination ── */}
            {meta.totalPage > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#E5E5E6] bg-white rounded-xl p-4 shadow-2xs">
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
                                  ? 'bg-black text-[#DEC33A]'
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
