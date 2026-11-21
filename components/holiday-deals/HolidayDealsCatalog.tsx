'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gift,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Filter,
  BadgeCheck,
  Truck,
  RotateCcw,
  Tag,
} from 'lucide-react';
import { useHolidayDeals } from '@/hooks/api/useProduct';
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

export default function HolidayDealsCatalog() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt:desc');
  const [priceTier, setPriceTier] = useState<
    'all' | 'under25' | 'under50' | '50to150' | 'over150'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories for filtering
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  // Price range mapping
  const priceFilter = useMemo(() => {
    switch (priceTier) {
      case 'under25':
        return { maxPrice: 25 };
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

  // Fetch holiday deal products
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: 16,
      search: searchTerm.trim() || undefined,
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: sortBy,
      isHolidayDeal: true,
      ...priceFilter,
    };
  }, [currentPage, searchTerm, selectedCategory, sortBy, priceFilter]);

  const { data, isLoading } = useHolidayDeals(queryParams);
  const products = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 16, totalPage: 1 };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('createdAt:desc');
    setPriceTier('all');
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
    sortBy !== 'createdAt:desc';

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#0F1111]">
      {/* ── 1. Top Breadcrumb Bar (Matches /coupons and /special-products) ── */}
      <nav
        aria-label="Breadcrumb"
        className="w-full bg-white border-b border-[#E5E5E6] py-2.5 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 text-xs text-[#565959]"
      >
        <div className="mx-auto max-w-[1760px] flex items-center justify-between font-normal">
          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="hover:text-[#165DD0] hover:underline transition-colors"
            >
              Home
            </Link>
            <span>›</span>
            <Link
              href="/products"
              className="hover:text-[#165DD0] hover:underline transition-colors"
            >
              Deals
            </Link>
            <span>›</span>
            <span className="font-semibold text-black">Holiday Deals</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            <Gift size={12} className="text-rose-600" />
            <span>Festive Season Deals • Verified Discounts</span>
          </div>
        </div>
      </nav>

      {/* ── 2. Distinctive Promo Hero Section (Matches /coupons lighter gold gradient) ── */}
      <section className="relative w-full bg-linear-to-r from-[#FFFDF2] via-[#FEF7D9] to-[#FCEEB7] border-b border-[#E8DFB8] overflow-hidden py-8 sm:py-12 md:py-14">
        {/* Subtle festive background glow */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#DEC33A]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative z-10">
          <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
            {/* Live Ticker Badge */}
            <div className="inline-flex items-center gap-2 bg-[#CC0C39] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-[3px] shadow-xs">
              <Gift size={13} className="fill-white" />
              <span>Holiday Deals Festival • Limited-Time Event</span>
            </div>

            {/* Headline */}
            <h1 className="text-[32px] sm:text-[42px] md:text-[50px] font-extrabold tracking-tight text-[#0A0A0A] leading-[1.1] font-[Arial]">
              Holiday Deals &amp; Seasonal Specials
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed font-normal">
              Unwrap festive savings on top gifts, seasonal decorations, gadgets, and department favorites. Enjoy holiday-exclusive prices verified for authentic value.
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
                placeholder="Search holiday deals, gifts, electronics, toys..."
                className="w-full pl-11 pr-10 py-3 sm:py-3.5 text-xs sm:text-sm bg-white border-2 border-gray-300 focus:border-black rounded-lg shadow-sm focus:outline-none placeholder:text-gray-400 text-black"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Quick 3-Pillar Holiday Assurance Strip ── */}
      <section className="w-full bg-[#181F26] text-white py-4 border-b border-[#2A3440] shadow-2xs">
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 items-center text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                <Truck size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Guaranteed Delivery</span>
                <span className="text-[11px] text-gray-400">Timely priority seasonal shipping</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                <RotateCcw size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Extended Holiday Returns</span>
                <span className="text-[11px] text-gray-400">Hassle-free return window until Jan 31</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="size-8 rounded-full bg-[#DEC33A] text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                <Tag size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Best Holiday Price Guarantee</span>
                <span className="text-[11px] text-gray-400">Verified discounts directly from verified sellers</span>
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
            {meta.total} Holiday Deals Available
          </div>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-sm cursor-pointer"
          >
            <Filter size={13} />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Deals'}</span>
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
                  <Gift size={16} className="text-rose-600" />
                  <span className="font-bold text-sm text-black">Filter Holiday Deals</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[#165DD0] hover:underline font-medium cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Department Categories Filter */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Departments
                </span>
                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-colors text-left cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-black text-[#DEC33A] font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Departments</span>
                    {selectedCategory === 'all' && <CheckCircle2 size={13} />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-colors text-left cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-black text-[#DEC33A] font-bold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      {selectedCategory === cat.id && (
                        <CheckCircle2 size={13} className="shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tier Filter */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Holiday Budget
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
                    All Budgets
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceTier('under25');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors cursor-pointer ${
                      priceTier === 'under25'
                        ? 'bg-black text-[#DEC33A] border-black font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Under $25
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
                    className={`py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors col-span-2 cursor-pointer ${
                      priceTier === 'over150'
                        ? 'bg-black text-[#DEC33A] border-black font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    $150 &amp; Above
                  </button>
                </div>
              </div>

              {/* Holiday Assurance Box */}
              <div className="mt-2 bg-[#181F26] text-white rounded-lg p-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#DEC33A]">
                  <BadgeCheck size={16} />
                  <span>The Holiday Guarantee</span>
                </div>
                <div className="flex flex-col gap-2 text-[11px] text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#229A4E] shrink-0" />
                    <span>Real-time festive discount verification</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#229A4E] shrink-0" />
                    <span>Gift wrapping available at checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#229A4E] shrink-0" />
                    <span>Fast track carrier fulfillment</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT COLUMN: Products Grid ── */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            {/* Top Controls Bar */}
            <div className="bg-white border border-[#E5E5E6] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="text-xs text-gray-600">
                Showing{' '}
                <strong className="text-black font-bold">
                  {meta.total ? (currentPage - 1) * 16 + 1 : 0}–
                  {Math.min(currentPage * 16, meta.total)}
                </strong>{' '}
                of <strong className="text-black font-bold">{meta.total}</strong> holiday
                specials
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <label htmlFor="holiday-sort" className="text-xs text-gray-500 font-medium">
                  Sort:
                </label>
                <select
                  id="holiday-sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-1.5 px-2.5 text-xs border border-[#E5E5E6] rounded-sm focus:border-black focus:outline-none bg-white text-black font-medium cursor-pointer"
                >
                  <option value="createdAt:desc">Newest Deals First</option>
                  <option value="price:asc">Price: Low to High</option>
                  <option value="price:desc">Price: High to Low</option>
                  <option value="discountValue:desc">Biggest Discounts</option>
                  <option value="name:asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500 font-semibold">Active:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-800">
                    Keyword: <strong>{searchTerm}</strong>
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="hover:text-red-600 ml-0.5 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-800">
                    Department:{' '}
                    <strong>
                      {categories.find((c) => c.id === selectedCategory)?.name ||
                        selectedCategory}
                    </strong>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="hover:text-red-600 ml-0.5 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {priceTier !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-800">
                    Budget: <strong>{priceTier}</strong>
                    <button
                      type="button"
                      onClick={() => setPriceTier('all')}
                      className="hover:text-red-600 ml-0.5 cursor-pointer"
                    >
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
                      key={`skeleton-holiday-${i}`}
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
                  <div className="size-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
                    <Gift size={30} />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1">
                    No Holiday Deals In This Selection
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    No items match the currently selected holiday filters. Try clearing your filters or exploring our other seasonal categories.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-[#DEC33A] hover:bg-[#c9b034] text-black font-bold text-xs rounded-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    Reset Deal Filters
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
                            originalPrice={
                              hasDiscount ? formatPrice(product.basePrice) : undefined
                            }
                            badgeText={
                              hasDiscount
                                ? `${product.discountValue}${
                                    product.discountType === 'PERCENTAGE' ? '%' : ''
                                  } off`
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

            {/* ── Pagination Controls ── */}
            {meta.totalPage > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-semibold rounded border border-[#E5E5E6] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1 text-xs font-semibold">
                  {Array.from({ length: meta.totalPage }).map((_, i) => {
                    const p = i + 1;
                    if (
                      p === 1 ||
                      p === meta.totalPage ||
                      (p >= currentPage - 1 && p <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={`page-btn-${p}`}
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`size-8 rounded border transition-colors cursor-pointer ${
                            currentPage === p
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-white text-gray-700 border-[#E5E5E6] hover:bg-gray-100'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                    if (p === currentPage - 2 || p === currentPage + 2) {
                      return (
                        <span key={`dots-${p}`} className="px-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= meta.totalPage}
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPage, p + 1))}
                  className="px-3 py-1.5 text-xs font-semibold rounded border border-[#E5E5E6] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
