'use client';

import BrowsingHistory from '@/components/product/BrowsingHistory';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductGrid from '@/components/product/ProductGrid';
import SignUpBanner from '@/components/shared/SignUpBanner';
import { useProductFacets, useProducts } from '@/hooks/api/useProduct';
import type { ProductQueryParams } from '@/lib/api/product';
import { ArrowUpDown, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const numberParam = (value: string | null) => {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
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

export default function PublicProductsCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { data: facets } = useProductFacets();

  const params: ProductQueryParams = {
    page: numberParam(searchParams.get('page')) ?? 1,
    limit: 49,
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    condition: searchParams.get('condition') || undefined,
    color: searchParams.get('color') || undefined,
    minPrice: numberParam(searchParams.get('minPrice')),
    maxPrice: numberParam(searchParams.get('maxPrice')),
    hasDiscount: searchParams.get('hasDiscount') === 'true',
    inStock: searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') || 'newest',
    vendor: searchParams.get('vendor') || searchParams.get('vendorId') || undefined,
  };

  const query = useProducts(params);
  const meta = query.data?.meta;
  const start = meta?.total ? (meta.page - 1) * meta.limit + 1 : 0;
  const end = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  const handleSortChange = (newSort: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (newSort === 'newest') {
      next.delete('sort');
    } else {
      next.set('sort', newSort);
    }
    next.delete('page');
    startTransition(() => {
      router.push(`/products?${next.toString()}`);
    });
  };

  const removeFilterParam = (keys: string[]) => {
    const next = new URLSearchParams(searchParams.toString());
    keys.forEach((key) => next.delete(key));
    next.delete('page');
    startTransition(() => {
      router.push(`/products?${next.toString()}`);
    });
  };

  const clearAllFilters = () => {
    const search = searchParams.get('search');
    if (search) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    } else {
      router.push('/products');
    }
  };

  // Resolve human-readable labels for active filter pills
  const activeChips: { id: string; label: string; remove: () => void }[] = [];

  if (params.category) {
    const catName =
      facets?.categories.find(
        (c) =>
          c.id === params.category ||
          c.name.toLowerCase() === params.category?.toLowerCase(),
      )?.name || params.category;
    activeChips.push({
      id: 'category',
      label: `Category: ${catName}`,
      remove: () => removeFilterParam(['category', 'subcategory']),
    });
  }

  if (params.vendor) {
    const venName =
      facets?.vendors.find(
        (v) =>
          v.id === params.vendor ||
          v.name.toLowerCase() === params.vendor?.toLowerCase(),
      )?.name || params.vendor;
    activeChips.push({
      id: 'vendor',
      label: `Seller: ${venName}`,
      remove: () => removeFilterParam(['vendor', 'vendorId']),
    });
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    let priceLabel = 'Price: ';
    if (params.minPrice !== undefined && params.maxPrice !== undefined) {
      priceLabel += `$${params.minPrice} - $${params.maxPrice}`;
    } else if (params.minPrice !== undefined) {
      priceLabel += `$${params.minPrice}+`;
    } else if (params.maxPrice !== undefined) {
      priceLabel += `Under $${params.maxPrice}`;
    }
    activeChips.push({
      id: 'price',
      label: priceLabel,
      remove: () => removeFilterParam(['minPrice', 'maxPrice']),
    });
  }

  if (params.color) {
    activeChips.push({
      id: 'color',
      label: `Color: ${params.color}`,
      remove: () => removeFilterParam(['color']),
    });
  }

  if (params.condition) {
    activeChips.push({
      id: 'condition',
      label: `Condition: ${params.condition.charAt(0) + params.condition.slice(1).toLowerCase()}`,
      remove: () => removeFilterParam(['condition']),
    });
  }

  if (params.hasDiscount) {
    activeChips.push({
      id: 'hasDiscount',
      label: 'Deals Only',
      remove: () => removeFilterParam(['hasDiscount']),
    });
  }

  if (params.inStock) {
    activeChips.push({
      id: 'inStock',
      label: 'In Stock Only',
      remove: () => removeFilterParam(['inStock']),
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <section className="flex-1 pb-20">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10">
          {/* Top Header Row */}
          <div className="flex h-auto w-full flex-col items-start justify-between gap-4 border-b border-[#E5E5E6] bg-white py-4 sm:h-14.25 sm:flex-row sm:items-center sm:gap-0 sm:py-0">
            <h1 className="text-[15px] sm:text-[16px] text-black">
              Showing <span className="font-semibold">{start}-{end}</span> of{' '}
              <span className="font-semibold">{meta?.total ?? 0}</span> results
              {params.search ? (
                <>
                  {' '}for <span className="font-bold">&ldquo;{params.search}&rdquo;</span>
                </>
              ) : null}
            </h1>

            {/* Sort By Dropdown Control */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-by-select"
                className="group flex h-9 items-center gap-2 rounded border border-[#E5E5E6] bg-white px-3 transition-colors hover:border-black focus-within:border-black focus-within:ring-1 focus-within:ring-black"
              >
                <span className="text-[13px] sm:text-[14px] font-bold text-black shrink-0 select-none">
                  Sort By:
                </span>
                <select
                  id="sort-by-select"
                  value={params.sort}
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
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] px-3 py-1 text-[12px] font-medium text-gray-800 transition-colors hover:bg-gray-200"
                  title="Remove filter"
                >
                  <span>{chip.label}</span>
                  <X size={13} className="text-gray-500 hover:text-black" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[12px] font-semibold text-[#CB1B1B] hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Main Layout: Filter Sidebar + Product Grid */}
          <div className="mt-6 flex flex-col gap-8 lg:flex-row">
            <FilterSidebar />
            <div className="min-w-0 flex-1">
              <ProductGrid query={query} />
            </div>
          </div>
        </div>
      </section>

      <BrowsingHistory />
      <SignUpBanner />
    </div>
  );
}
