/**
 * @fileoverview Main Container Component: BrandStoreFront.
 * Coordinates all the sub-sections of the storefront: Hero, Header, Filters, and Product Grid.
 *
 * @module components/brand/BrandStoreFront
 */

'use client';

import { useState, useMemo } from 'react';
import { BRAND_PRODUCTS } from '@/lib/brand-data';
import BrandHero from './BrandHero';
import BrandHeader from './BrandHeader';
import BrandFilters from './BrandFilters';
import BrandProductGrid from './BrandProductGrid';
import BrowsingHistory from '@/components/product/BrowsingHistory';
import SignUpBanner from '@/components/shared/SignUpBanner';

export default function BrandStoreFront() {
  // ─── Filter States ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [selectedDiscount, setSelectedDiscount] = useState<'all' | 'deals'>('all');
  const [selectedReviewRating, setSelectedReviewRating] = useState<number | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ─── Filter Logic ──────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return BRAND_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (
        searchQuery &&
        !product.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Price filter
      if (product.price > maxPrice) {
        return false;
      }

      // Deals filter
      if (selectedDiscount === 'deals' && !product.isTodayDeal) {
        return false;
      }

      // Review filter
      if (selectedReviewRating && product.rating < selectedReviewRating) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, maxPrice, selectedDiscount, selectedReviewRating]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInputValue);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSearchInputValue('');
    setMaxPrice(3000);
    setSelectedDiscount('all');
    setSelectedReviewRating(null);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F4F5]">
      {/* Hero Banner Section */}
      <BrandHero />

      {/* Static Brand Header Section */}
      <BrandHeader
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        onSearchSubmit={handleSearchSubmit}
        isFollowed={isFollowed}
        setIsFollowed={setIsFollowed}
      />

      {/* Main Catalog Grid */}
      <section className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <BrandFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
            maxPrice={maxPrice}
            setMaxPrice={(price) => { setMaxPrice(price); setCurrentPage(1); }}
            selectedDiscount={selectedDiscount}
            setSelectedDiscount={(disc) => { setSelectedDiscount(disc); setCurrentPage(1); }}
            selectedReviewRating={selectedReviewRating}
            setSelectedReviewRating={(rating) => { setSelectedReviewRating(rating); setCurrentPage(1); }}
            onClearFilters={handleClearFilters}
          />

          <BrandProductGrid
            products={paginatedProducts}
            totalResults={filteredProducts.length}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onClearFilters={handleClearFilters}
          />
        </div>
      </section>

      {/* Browsing History */}
      <BrowsingHistory />

      {/* Sign In Banner */}
      <div className="w-full">
        <SignUpBanner />
      </div>
    </div>
  );
}
