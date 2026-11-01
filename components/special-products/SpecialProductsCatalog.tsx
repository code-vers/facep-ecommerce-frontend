'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import {
  useSpecialProducts,
  mapProductToCarousel,
} from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';

export default function SpecialProductsCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt:desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories for filtering
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  // Fetch special products
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: 16,
      search: searchTerm.trim() || undefined,
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: sortBy,
      isSpecialProduct: true,
    };
  }, [currentPage, searchTerm, selectedCategory, sortBy]);

  const { data, isLoading, isFetching } = useSpecialProducts(queryParams);
  const products = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 16, totalPage: 1 };

  return (
    <div className="w-full min-h-screen bg-[#F4F4F5]">
      {/* ── 1. Hero / Promotional Section ── */}
      <section className="relative w-full bg-gradient-to-r from-[#2b323b] via-[#1f242b] to-[#121519] py-12 md:py-16 overflow-hidden text-white">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#DEC33A_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative z-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#DEC33A] text-black px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit shadow-xs">
              <Star size={14} className="fill-black" />
              <span>Curated Selection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Special Products & Premier Highlights
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-medium">
              Explore hand-selected top quality items and best-rated products specially featured for you.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Filter & Toolbar Section ── */}
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 py-6">
        <div className="bg-white border border-[#E5E5E6] rounded-lg p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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
              placeholder="Search special products..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-[#E5E5E6] rounded-md focus:outline-none focus:border-black placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="special-products-category" className="text-xs font-semibold text-gray-600 hidden sm:inline">
                Category:
              </label>
              <select
                id="special-products-category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs font-medium border border-[#E5E5E6] rounded-md bg-white focus:outline-none focus:border-black text-gray-700 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="special-products-sort" className="text-xs font-semibold text-gray-600 hidden sm:inline">
                Sort by:
              </label>
              <select
                id="special-products-sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs font-medium border border-[#E5E5E6] rounded-md bg-white focus:outline-none focus:border-black text-gray-700 cursor-pointer"
              >
                <option value="createdAt:desc">Newest Arrivals</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="name:asc">Product: A to Z</option>
              </select>
            </div>

            {(searchTerm || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── 3. Products Grid ── */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`skeleton-card-${i}`}
                  className="bg-white border border-[#E5E5E6] rounded-sm p-3 flex flex-col gap-3 animate-pulse"
                >
                  <div className="w-full h-[180px] bg-gray-200 rounded-sm" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#E5E5E6] rounded-lg p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12">
              <div className="h-16 w-16 rounded-full bg-[#DEC33A]/20 flex items-center justify-center text-[#B4950A] mb-4">
                <Star size={32} className="fill-[#DEC33A]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-1">
                No Special Products Selected Yet
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Featured products will appear here once marked in the admin dashboard. In the meantime, browse our full collection.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#DEC33A] text-black font-bold text-sm rounded-sm hover:bg-[#cbb130] transition-colors"
              >
                <span>Browse All Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map((product) => {
                const card = mapProductToCarousel(product);
                return (
                  <Link
                    key={product.id}
                    href={card.href || `/products/${product.slug}`}
                    className="block group"
                  >
                    <ProductCard
                      title={card.title}
                      imageSrc={card.imageSrc}
                      imageAlt={card.imageAlt}
                      price={card.price}
                      originalPrice={card.originalPrice}
                      badgeText={card.badgeText || 'Special'}
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

        {/* ── 4. Pagination Controls ── */}
        {meta.totalPage > 1 && (
          <div className="flex items-center justify-between border-t border-[#E5E5E6] bg-white rounded-lg p-4 mt-8 shadow-xs">
            <div className="text-xs text-gray-500">
              Showing page <span className="font-semibold text-black">{meta.page}</span> of{' '}
              <span className="font-semibold text-black">{meta.totalPage}</span> ({meta.total} Special Products)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || isFetching}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded border border-[#E5E5E6] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-black cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <button
                type="button"
                disabled={currentPage >= meta.totalPage || isFetching}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded border border-[#E5E5E6] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-black cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
