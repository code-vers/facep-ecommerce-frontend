/**
 * @fileoverview Main Container Component: BrandStoreFront.
 * Coordinates all the sub-sections of the storefront: Hero, Header, Filters, and Product Grid.
 * Dynamically fetches and displays vendor storefront branding and products.
 *
 * @module components/brand/BrandStoreFront
 */

'use client';

import { useState, useMemo } from 'react';
import { BRAND_PRODUCTS, type BrandProduct } from '@/lib/brand-data';
import BrandHero from './BrandHero';
import BrandHeader from './BrandHeader';
import BrandFilters from './BrandFilters';
import BrandProductGrid from './BrandProductGrid';
import SignUpBanner from '@/components/shared/SignUpBanner';
import { usePublicStorefront } from '@/hooks/api/useStorefront';
import { useProducts } from '@/hooks/api/useProduct';
import { getImageUrl } from '@/lib/utils';

interface BrandStoreFrontProps {
  vendorId?: string;
}

export default function BrandStoreFront({ vendorId }: BrandStoreFrontProps) {
  // Fetch real storefront data for this vendor / brand
  const { data: storefront, isLoading: isStorefrontLoading } = usePublicStorefront(vendorId || '1');

  // Use the vendorId resolved by the backend or fallback to the prop
  const resolvedVendorId = storefront?.vendorId || (vendorId !== '1' ? vendorId : undefined);

  // Fetch real products for this vendor
  const { data: productsData, isLoading: isProductsLoading } = useProducts(
    resolvedVendorId ? { vendorId: resolvedVendorId, limit: 100 } : undefined,
    Boolean(resolvedVendorId)
  );

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

  // Map API products to BrandProduct format
  const dynamicProducts: BrandProduct[] = useMemo(() => {
    const rawList = productsData?.data || [];
    if (rawList.length === 0) {
      // If vendor has no products in DB yet, fallback to sample products only if default demo
      return vendorId === '1' || !vendorId ? BRAND_PRODUCTS : [];
    }

    return rawList.map((p) => {
      const base = Number(p.basePrice);
      const value = Number(p.discountValue ?? 0);
      let effectivePrice = base;
      if (p.discountType && value) {
        effectivePrice =
          p.discountType === 'PERCENTAGE'
            ? Math.max(0, base - (base * value) / 100)
            : Math.max(0, base - value);
      }
      const hasDiscount = effectivePrice < base;

      return {
        id: p.id,
        slug: p.slug,
        title: p.name,
        category: p.category?.name || p.categoryId || 'General',
        imageSrc: getImageUrl(p.thumbnail),
        rating: 4.8,
        reviewCount: 88,
        price: effectivePrice,
        originalPrice: hasDiscount ? base : undefined,
        badgeText: hasDiscount ? `${p.discountValue}${p.discountType === 'PERCENTAGE' ? '%' : ''} off` : undefined,
        badgeLabel: p.dealBadgeText || (hasDiscount ? 'Limited time offer' : undefined),
        shippingText:
          p.shippingFeeType === 'FREE'
            ? 'Free Shipping'
            : p.shippingCost
            ? `$${p.shippingCost} Shipping`
            : 'Standard Shipping',
        isTodayDeal: Boolean(p.dealBadgeText || hasDiscount),
      };
    });
  }, [productsData, vendorId]);

  // Dynamic categories extracted from the available products
  const availableCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(dynamicProducts.map((p) => p.category).filter(Boolean))
    );
    if (uniqueCategories.length === 0) {
      return [{ id: 'all', label: 'All' }];
    }
    return [
      { id: 'all', label: 'All' },
      ...uniqueCategories.map((catName) => ({
        id: catName,
        label: catName.charAt(0).toUpperCase() + catName.slice(1),
      })),
    ];
  }, [dynamicProducts]);

  // ─── Filter Logic ──────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return dynamicProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
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
  }, [dynamicProducts, selectedCategory, searchQuery, maxPrice, selectedDiscount, selectedReviewRating]);

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
      <BrandHero
        title={storefront?.bannerHeadline || 'Buy Your Favorite Products'}
        subtitle={storefront?.bannerSubheadline || `From ${storefront?.storeName || 'Official Storefront'}`}
        bannerImage={storefront?.storeBanner}
      />

      {/* Brand Header Section */}
      <BrandHeader
        storefront={storefront}
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
            categories={availableCategories}
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
            storeName={storefront?.storeName}
            products={paginatedProducts}
            totalResults={filteredProducts.length}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onClearFilters={handleClearFilters}
          />
        </div>
      </section>

      {/* Sign In Banner */}
      <div className="w-full">
        <SignUpBanner />
      </div>
    </div>
  );
}
