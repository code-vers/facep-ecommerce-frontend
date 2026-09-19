/**
 * @fileoverview Main Container Component: BrandStoreFront.
 * Coordinates all the sub-sections of the storefront: Hero, Header, Filters, and Product Grid.
 * Manages filter state in client memory with silent URL synchronization (zero scroll-to-top jump).
 *
 * @module components/brand/BrandStoreFront
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import BrandHero from './BrandHero';
import BrandHeader from './BrandHeader';
import BrandFilters from './BrandFilters';
import BrandProductGrid from './BrandProductGrid';
import SignUpBanner from '@/components/shared/SignUpBanner';
import { usePublicStorefront } from '@/hooks/api/useStorefront';
import { useProducts } from '@/hooks/api/useProduct';
import { BRAND_PRODUCTS } from '@/lib/brand-data';
import type { Product, ProductQueryParams } from '@/lib/api/product';
import { ArrowUpDown, X } from 'lucide-react';

interface BrandStoreFrontProps {
  vendorId?: string;
}

const numberParam = (value: string | null | undefined) => {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'discount-desc', label: 'Biggest Discount' },
  { value: 'oldest', label: 'Oldest' },
];

export default function BrandStoreFront({ vendorId = '1' }: BrandStoreFrontProps) {
  const searchParams = useSearchParams();

  // Fetch real storefront data for this vendor / brand
  const { data: storefront } = usePublicStorefront(vendorId);

  // Use the vendorId resolved by the backend or fallback to the prop
  const resolvedVendorId = storefront?.vendorId || (vendorId !== '1' ? vendorId : undefined);

  // Local filter states initialized from initial URL search params
  const [page, setPage] = useState<number>(() => numberParam(searchParams.get('page')) ?? 1);
  const [search, setSearch] = useState<string>(() => searchParams.get('search') || '');
  const [searchInputValue, setSearchInputValue] = useState<string>(() => searchParams.get('search') || '');
  const [category, setCategory] = useState<string>(() => searchParams.get('category') || '');
  const [condition, setCondition] = useState<string>(() => searchParams.get('condition') || '');
  const [color, setColor] = useState<string>(() => searchParams.get('color') || '');
  const [minPrice, setMinPrice] = useState<number | undefined>(() => numberParam(searchParams.get('minPrice')));
  const [maxPrice, setMaxPrice] = useState<number | undefined>(() => numberParam(searchParams.get('maxPrice')));
  const [hasDiscount, setHasDiscount] = useState<boolean>(() => searchParams.get('hasDiscount') === 'true');
  const [inStock, setInStock] = useState<boolean>(() => searchParams.get('inStock') === 'true');
  const [sort, setSort] = useState<string>(() => searchParams.get('sort') || 'newest');
  const [isFollowed, setIsFollowed] = useState(false);

  // Silent URL synchronization: updates the browser URL bar without triggering Next.js RSC scroll/reload
  const syncUrl = useCallback(
    (updates: Record<string, string | number | boolean | undefined | null>) => {
      if (typeof window === 'undefined') return;
      const currentParams = new URLSearchParams(window.location.search);
      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '' || val === false) {
          currentParams.delete(key);
        } else {
          currentParams.set(key, String(val));
        }
      });
      const queryString = currentParams.toString();
      const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.replaceState(null, '', nextUrl);
    },
    []
  );

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const newPage = numberParam(params.get('page')) ?? 1;
      const newSearch = params.get('search') || '';
      const newCat = params.get('category') || '';
      const newCond = params.get('condition') || '';
      const newColor = params.get('color') || '';
      const newMin = numberParam(params.get('minPrice'));
      const newMax = numberParam(params.get('maxPrice'));
      const newDiscount = params.get('hasDiscount') === 'true';
      const newStock = params.get('inStock') === 'true';
      const newSort = params.get('sort') || 'newest';

      setPage(newPage);
      setSearch(newSearch);
      setSearchInputValue(newSearch);
      setCategory(newCat);
      setCondition(newCond);
      setColor(newColor);
      setMinPrice(newMin);
      setMaxPrice(newMax);
      setHasDiscount(newDiscount);
      setInStock(newStock);
      setSort(newSort);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Query filtered products scoped to this vendor
  const queryParams: ProductQueryParams = useMemo(
    () => ({
      vendorId: resolvedVendorId,
      page,
      limit: 20,
      search: search || undefined,
      category: category || undefined,
      condition: condition || undefined,
      color: color || undefined,
      minPrice,
      maxPrice,
      hasDiscount: hasDiscount ? true : undefined,
      inStock: inStock ? true : undefined,
      sort,
    }),
    [resolvedVendorId, page, search, category, condition, color, minPrice, maxPrice, hasDiscount, inStock, sort]
  );

  const query = useProducts(resolvedVendorId ? queryParams : undefined, Boolean(resolvedVendorId));

  // Query the vendor's products catalog to dynamically derive categories and colors
  const { data: allVendorProducts } = useProducts(
    resolvedVendorId ? { vendorId: resolvedVendorId, limit: 100 } : undefined,
    Boolean(resolvedVendorId)
  );

  // Extract categories present in this vendor's catalog with real product counts
  const availableCategories = useMemo(() => {
    const rawList = allVendorProducts?.data || [];
    const counts: Record<string, { id: string; name: string; count: number }> = {};

    rawList.forEach((p) => {
      const catId = p.category?.id || p.categoryId;
      const catName = p.category?.name || 'General';
      if (catId) {
        if (!counts[catId]) {
          counts[catId] = { id: catId, name: catName, count: 0 };
        }
        counts[catId].count += 1;
      }
    });

    return Object.values(counts);
  }, [allVendorProducts]);

  // Extract colors present in this vendor's catalog
  const availableColors = useMemo(() => {
    const rawList = allVendorProducts?.data || [];
    const colorSet = new Set<string>();
    rawList.forEach((p) => {
      (p.availableColors || []).forEach((c) => {
        if (c && c.trim()) colorSet.add(c.trim());
      });
    });
    return Array.from(colorSet).sort();
  }, [allVendorProducts]);

  // Demo fallback for default demo route (/brand/1) if database has no products
  const demoProductsMapped: Product[] = useMemo(() => {
    if (resolvedVendorId && resolvedVendorId !== '1') return [];
    return (BRAND_PRODUCTS.map((bp) => ({
      id: bp.id,
      name: bp.title,
      slug: bp.slug || bp.id,
      sku: bp.id,
      isActive: true,
      publishedAt: new Date().toISOString(),
      categoryId: bp.category,
      category: {
        id: bp.category,
        name: bp.category.charAt(0).toUpperCase() + bp.category.slice(1),
        imageUrl: null,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      },
      tags: [],
      condition: 'NEW',
      availableColors: [],
      thumbnail: bp.imageSrc,
      previewImages: [bp.imageSrc],
      hasVariants: false,
      variants: [],
      specifications: [],
      basePrice: bp.price,
      oldPrice: bp.originalPrice ?? null,
      discountType: bp.originalPrice ? 'FIXED' : null,
      discountValue: bp.originalPrice ? bp.originalPrice - bp.price : null,
      dealBadgeText: bp.badgeLabel || null,
      shipsFrom: 'Warehouse',
      minDeliveryDays: 2,
      maxDeliveryDays: 5,
      shippingFeeType: 'FREE',
      shippingCost: null,
      deliveryStandard: true,
      deliveryCod: true,
      deliveryExpress: false,
      deliveryReturnPickup: false,
      stockQuantity: 100,
      stockStatus: 'AVAILABLE',
      lowStockAlertQuantity: 10,
      minOrderQuantity: 1,
      maxOrderQuantity: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as unknown) as Product[];
  }, [resolvedVendorId]);

  // Filter actions that update local state and sync URL silently (NO page jump)
  const handleSelectCategory = (catId: string) => {
    setCategory(catId);
    setPage(1);
    syncUrl({ category: catId, page: undefined });
  };

  const handleSelectCondition = (cond: string) => {
    setCondition(cond);
    setPage(1);
    syncUrl({ condition: cond, page: undefined });
  };

  const handleSelectColor = (col: string) => {
    setColor(col);
    setPage(1);
    syncUrl({ color: col, page: undefined });
  };

  const handleSelectHasDiscount = (val: boolean) => {
    setHasDiscount(val);
    setPage(1);
    syncUrl({ hasDiscount: val ? 'true' : undefined, page: undefined });
  };

  const handleSelectInStock = (val: boolean) => {
    setInStock(val);
    setPage(1);
    syncUrl({ inStock: val ? 'true' : undefined, page: undefined });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
    syncUrl({ minPrice: min, maxPrice: max, page: undefined });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    syncUrl({ page: newPage > 1 ? newPage : undefined });
  };

  // Header Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInputValue.trim();
    setSearch(trimmed);
    setPage(1);
    syncUrl({ search: trimmed || undefined, page: undefined });
  };

  // Sort dropdown change
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
    syncUrl({ sort: newSort === 'newest' ? undefined : newSort, page: undefined });
  };

  // Remove individual filter pill
  const removeFilterParam = (keys: string[]) => {
    const updates: Record<string, string | number | boolean | undefined | null> = { page: undefined };
    keys.forEach((key) => {
      if (key === 'category') {
        setCategory('');
        updates.category = undefined;
      }
      if (key === 'condition') {
        setCondition('');
        updates.condition = undefined;
      }
      if (key === 'color') {
        setColor('');
        updates.color = undefined;
      }
      if (key === 'minPrice') {
        setMinPrice(undefined);
        updates.minPrice = undefined;
      }
      if (key === 'maxPrice') {
        setMaxPrice(undefined);
        updates.maxPrice = undefined;
      }
      if (key === 'hasDiscount') {
        setHasDiscount(false);
        updates.hasDiscount = undefined;
      }
      if (key === 'inStock') {
        setInStock(false);
        updates.inStock = undefined;
      }
      if (key === 'search') {
        setSearch('');
        setSearchInputValue('');
        updates.search = undefined;
      }
    });
    setPage(1);
    syncUrl(updates);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setCategory('');
    setCondition('');
    setColor('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setHasDiscount(false);
    setInStock(false);
    setSearch('');
    setSearchInputValue('');
    setSort('newest');
    setPage(1);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Compute Active Filter Chips
  const activeChips: { id: string; label: string; remove: () => void }[] = [];

  if (category) {
    const catObj = availableCategories.find(
      (c) => c.id === category || c.name.toLowerCase() === category.toLowerCase()
    );
    activeChips.push({
      id: 'category',
      label: `Category: ${catObj?.name || category}`,
      remove: () => removeFilterParam(['category']),
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    let priceLabel = 'Price: ';
    if (minPrice !== undefined && maxPrice !== undefined) {
      priceLabel += `$${minPrice} - $${maxPrice}`;
    } else if (minPrice !== undefined) {
      priceLabel += `$${minPrice}+`;
    } else if (maxPrice !== undefined) {
      priceLabel += `Under $${maxPrice}`;
    }
    activeChips.push({
      id: 'price',
      label: priceLabel,
      remove: () => removeFilterParam(['minPrice', 'maxPrice']),
    });
  }

  if (color) {
    activeChips.push({
      id: 'color',
      label: `Color: ${color}`,
      remove: () => removeFilterParam(['color']),
    });
  }

  if (condition) {
    activeChips.push({
      id: 'condition',
      label: `Condition: ${condition.charAt(0) + condition.slice(1).toLowerCase()}`,
      remove: () => removeFilterParam(['condition']),
    });
  }

  if (hasDiscount) {
    activeChips.push({
      id: 'hasDiscount',
      label: 'Deals Only',
      remove: () => removeFilterParam(['hasDiscount']),
    });
  }

  if (inStock) {
    activeChips.push({
      id: 'inStock',
      label: 'In Stock Only',
      remove: () => removeFilterParam(['inStock']),
    });
  }

  const meta = query.data?.meta;
  const totalCount = meta?.total ?? (demoProductsMapped.length > 0 ? demoProductsMapped.length : 0);
  const start = totalCount > 0 && meta ? (meta.page - 1) * meta.limit + 1 : totalCount > 0 ? 1 : 0;
  const end = meta ? Math.min(meta.page * meta.limit, totalCount) : totalCount;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
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

      {/* Catalog & Filter Section */}
      <section className="mx-auto max-w-[1760px] w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8 flex-1">
        {/* Top Header Row */}
        <div className="flex h-auto w-full flex-col items-start justify-between gap-4 border-b border-[#E5E5E6] bg-white py-4 sm:h-14.25 sm:flex-row sm:items-center sm:gap-0 sm:py-0">
          <h1 className="text-[15px] sm:text-[16px] text-black">
            Showing <span className="font-semibold">{start}-{end}</span> of{' '}
            <span className="font-semibold">{totalCount}</span> results
            {search ? (
              <>
                {' '}for <span className="font-bold">&ldquo;{search}&rdquo;</span>
              </>
            ) : null}
          </h1>

          {/* Sort By Dropdown Control */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="brand-sort-by-select"
              className="group flex h-9 items-center gap-2 rounded border border-[#E5E5E6] bg-white px-3 transition-colors hover:border-black focus-within:border-black focus-within:ring-1 focus-within:ring-black"
            >
              <span className="text-[13px] sm:text-[14px] font-bold text-black shrink-0 select-none">
                Sort By:
              </span>
              <select
                id="brand-sort-by-select"
                value={sort}
                onChange={(event) => handleSortChange(event.target.value)}
                className="cursor-pointer bg-transparent text-[13px] sm:text-[14px] font-medium text-[#111827] outline-none select-none"
                aria-label="Sort products by"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="text-black bg-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown size={14} className="text-[#6B7280] transition-colors group-hover:text-black shrink-0" />
            </label>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2 border-b border-gray-100">
            <span className="text-[13px] font-semibold text-gray-500 mr-1">Active filters:</span>
            {activeChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.remove}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#F3F4F6] px-3 py-1 text-[12px] font-medium text-gray-800 transition-colors hover:bg-gray-200"
                title="Remove filter"
              >
                <span>{chip.label}</span>
                <X size={13} className="text-gray-500 hover:text-black" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="cursor-pointer text-[12px] font-semibold text-[#CB1B1B] hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Layout: Filter Sidebar + Product Grid */}
        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          <BrandFilters
            categories={availableCategories}
            colors={availableColors}
            selectedCategory={category}
            onSelectCategory={handleSelectCategory}
            selectedCondition={condition}
            onSelectCondition={handleSelectCondition}
            selectedColor={color}
            onSelectColor={handleSelectColor}
            selectedHasDiscount={hasDiscount}
            onSelectHasDiscount={handleSelectHasDiscount}
            selectedInStock={inStock}
            onSelectInStock={handleSelectInStock}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            onClearAll={clearAllFilters}
          />
          <div className="min-w-0 flex-1">
            <BrandProductGrid
              query={query}
              storeName={storefront?.storeName}
              onClearFilters={clearAllFilters}
              demoProducts={demoProductsMapped}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>

      {/* Sign In / Sign Up Banner */}
      <div className="w-full">
        <SignUpBanner />
      </div>
    </div>
  );
}
