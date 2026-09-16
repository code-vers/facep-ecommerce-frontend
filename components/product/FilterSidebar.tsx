'use client';

import { useProductFacets } from '@/hooks/api/useProduct';
import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

const COLOR_HEX_MAP: Record<string, string> = {
  black: '#111827',
  'obsidian black': '#0f172a',
  white: '#ffffff',
  'warm white': '#fef9c3',
  gold: '#eab308',
  'matte gold': '#d97706',
  'rose gold': '#b76e79',
  silver: '#94a3b8',
  gray: '#6b7280',
  grey: '#6b7280',
  blue: '#2563eb',
  red: '#dc2626',
  green: '#16a34a',
  yellow: '#facc15',
  brown: '#78350f',
  purple: '#9333ea',
  pink: '#ec4899',
  orange: '#ea580c',
};

const resolveColorSwatch = (colorName: string): string => {
  const lower = colorName.toLowerCase().trim();
  return COLOR_HEX_MAP[lower] || '#9ca3af';
};

interface FilterRadioItemProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}

function FilterRadioItem({
  id,
  label,
  checked,
  onChange,
  count,
}: FilterRadioItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      id={id}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange();
        }
      }}
      className="group flex cursor-pointer items-center justify-between py-1 text-left select-none outline-none focus-visible:ring-1 focus-visible:ring-black"
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex size-3.75 items-center justify-center rounded-full border transition-all ${
            checked
              ? 'border-[#165DD0] bg-[#165DD0]'
              : 'border-gray-400 bg-white group-hover:border-black'
          }`}
        >
          {checked && <div className="size-1.25 rounded-full bg-white" />}
        </div>
        <span
          className={`text-[13px] leading-[1.3] sm:text-[14px] ${
            checked
              ? 'font-bold text-black'
              : 'text-gray-700 group-hover:text-black'
          }`}
        >
          {label}
        </span>
      </div>
      {typeof count === 'number' && (
        <span className="text-[12px] text-gray-400">({count})</span>
      )}
    </div>
  );
}

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const { data } = useProductFacets();

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllVendors, setShowAllVendors] = useState(false);

  const selectedCategory = searchParams.get('category') ?? '';
  const selectedVendor = searchParams.get('vendor') ?? searchParams.get('vendorId') ?? '';
  const selectedCondition = (searchParams.get('condition') ?? '').toUpperCase();
  const selectedColor = searchParams.get('color') ?? '';
  const selectedHasDiscount = searchParams.get('hasDiscount') === 'true';
  const selectedInStock = searchParams.get('inStock') === 'true';

  const minPriceParam = searchParams.get('minPrice') ?? '';
  const maxPriceParam = searchParams.get('maxPrice') ?? '';

  const [customMin, setCustomMin] = useState(minPriceParam);
  const [customMax, setCustomMax] = useState(maxPriceParam);

  const updateParams = (updates: Record<string, string | undefined | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    next.delete('page');
    startTransition(() => {
      router.push(`/products?${next.toString()}`);
    });
  };

  const handleClearAll = () => {
    const search = searchParams.get('search');
    if (search) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    } else {
      router.push('/products');
    }
  };

  const isPriceActive = (min?: string, max?: string) => {
    const curMin = minPriceParam || undefined;
    const curMax = maxPriceParam || undefined;
    return curMin === min && curMax === max;
  };

  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({
      minPrice: customMin ? customMin.trim() : '',
      maxPrice: customMax ? customMax.trim() : '',
    });
  };

  const categories = data?.categories ?? [];
  const vendors = data?.vendors ?? [];
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);
  const visibleVendors = showAllVendors ? vendors : vendors.slice(0, 5);

  const isCategorySelected = (cat: { id: string; name: string }) => {
    if (!selectedCategory) return false;
    return (
      selectedCategory === cat.id ||
      selectedCategory.toLowerCase() === cat.name.toLowerCase()
    );
  };

  const isVendorSelected = (ven: { id: string; name: string }) => {
    if (!selectedVendor) return false;
    return (
      selectedVendor === ven.id ||
      selectedVendor.toLowerCase() === ven.name.toLowerCase()
    );
  };

  return (
    <aside className="w-full shrink-0 space-y-6 pb-10 lg:w-55">
      {/* Header with Clear button */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-[16px] font-bold text-black">Filter by</h3>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-[12px] font-semibold text-[#CB1B1B] hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* 1. Deals & Discounts */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Deals &amp; Discounts</h4>
        <div className="space-y-0.5">
          <FilterRadioItem
            id="discount-all"
            label="All Items"
            checked={!selectedHasDiscount}
            onChange={() => updateParams({ hasDiscount: '' })}
          />
          <FilterRadioItem
            id="discount-active"
            label="Today's Deals & Discounts"
            checked={selectedHasDiscount}
            onChange={() => updateParams({ hasDiscount: 'true' })}
          />
        </div>
      </div>

      {/* 2. Availability */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Availability</h4>
        <div className="space-y-0.5">
          <FilterRadioItem
            id="stock-all"
            label="All Items"
            checked={!selectedInStock}
            onChange={() => updateParams({ inStock: '' })}
          />
          <FilterRadioItem
            id="stock-available"
            label="In Stock Only"
            checked={selectedInStock}
            onChange={() => updateParams({ inStock: 'true' })}
          />
        </div>
      </div>

      {/* 3. Category */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Category</h4>
        <div className="space-y-0.5">
          <FilterRadioItem
            id="category-all"
            label="All Categories"
            checked={!selectedCategory}
            onChange={() => updateParams({ category: '', subcategory: '' })}
          />
          {visibleCategories.map((cat) => (
            <FilterRadioItem
              key={cat.id}
              id={`category-${cat.id}`}
              label={cat.name}
              checked={isCategorySelected(cat)}
              count={cat._count?.products}
              onChange={() =>
                updateParams({
                  category: isCategorySelected(cat) ? '' : cat.id,
                  subcategory: '',
                })
              }
            />
          ))}
        </div>
        {categories.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="mt-2 flex items-center gap-1 text-[13px] font-semibold text-[#165DD0] hover:underline"
          >
            {showAllCategories ? 'See less' : `See more (${categories.length - 5})`}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                showAllCategories ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* 4. Price */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Price</h4>
        <div className="space-y-0.5">
          <FilterRadioItem
            id="price-all"
            label="All Prices"
            checked={!minPriceParam && !maxPriceParam}
            onChange={() => {
              setCustomMin('');
              setCustomMax('');
              updateParams({ minPrice: '', maxPrice: '' });
            }}
          />
          <FilterRadioItem
            id="price-under-50"
            label="Under $50"
            checked={isPriceActive(undefined, '50')}
            onChange={() => {
              setCustomMin('');
              setCustomMax('50');
              updateParams({ minPrice: '', maxPrice: '50' });
            }}
          />
          <FilterRadioItem
            id="price-50-100"
            label="$50 - $100"
            checked={isPriceActive('50', '100')}
            onChange={() => {
              setCustomMin('50');
              setCustomMax('100');
              updateParams({ minPrice: '50', maxPrice: '100' });
            }}
          />
          <FilterRadioItem
            id="price-100-500"
            label="$100 - $500"
            checked={isPriceActive('100', '500')}
            onChange={() => {
              setCustomMin('100');
              setCustomMax('500');
              updateParams({ minPrice: '100', maxPrice: '500' });
            }}
          />
          <FilterRadioItem
            id="price-500-1000"
            label="$500 - $1,000"
            checked={isPriceActive('500', '1000')}
            onChange={() => {
              setCustomMin('500');
              setCustomMax('1000');
              updateParams({ minPrice: '500', maxPrice: '1000' });
            }}
          />
          <FilterRadioItem
            id="price-1000-2000"
            label="$1,000 - $2,000"
            checked={isPriceActive('1000', '2000')}
            onChange={() => {
              setCustomMin('1000');
              setCustomMax('2000');
              updateParams({ minPrice: '1000', maxPrice: '2000' });
            }}
          />
          <FilterRadioItem
            id="price-over-2000"
            label="$2,000 & Above"
            checked={isPriceActive('2000', undefined)}
            onChange={() => {
              setCustomMin('2000');
              setCustomMax('');
              updateParams({ minPrice: '2000', maxPrice: '' });
            }}
          />
        </div>

        {/* Custom Price Range Form */}
        <form onSubmit={handleCustomPriceSubmit} className="mt-3 flex items-center gap-1.5">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">
              $
            </span>
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              className="w-full rounded border border-gray-300 py-1 pr-1 pl-5 text-[12px] text-black outline-none focus:border-black"
              aria-label="Minimum price"
            />
          </div>
          <span className="text-[12px] text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">
              $
            </span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={customMax}
              onChange={(e) => setCustomMax(e.target.value)}
              className="w-full rounded border border-gray-300 py-1 pr-1 pl-5 text-[12px] text-black outline-none focus:border-black"
              aria-label="Maximum price"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded bg-[#DEC33A] px-2.5 py-1 text-[12px] font-bold text-black transition-colors hover:bg-[#d0b530]"
          >
            Go
          </button>
        </form>
      </div>

      {/* 5. Colors */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Colors</h4>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => updateParams({ color: '' })}
            className={`cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium transition-all ${
              !selectedColor
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {(data?.colors ?? []).map((color) => {
            const isSelected =
              selectedColor.toLowerCase() === color.toLowerCase();
            const hex = resolveColorSwatch(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() =>
                  updateParams({ color: isSelected ? '' : color })
                }
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-all ${
                  isSelected
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                }`}
                title={`Filter by ${color}`}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full border border-black/15"
                  style={{ backgroundColor: hex }}
                />
                <span>{color}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Condition */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Condition</h4>
        <div className="space-y-0.5">
          <FilterRadioItem
            id="condition-all"
            label="All Conditions"
            checked={!selectedCondition}
            onChange={() => updateParams({ condition: '' })}
          />
          {(data?.conditions ?? ['NEW', 'RENEWED', 'USED']).map((condition) => (
            <FilterRadioItem
              key={condition}
              id={`condition-${condition}`}
              label={condition.charAt(0) + condition.slice(1).toLowerCase()}
              checked={selectedCondition === condition}
              onChange={() =>
                updateParams({
                  condition: selectedCondition === condition ? '' : condition,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* 7. Sellers (Vendors) */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Sellers</h4>
        <div className="space-y-0.5">
          <FilterRadioItem
            id="seller-all"
            label="All Sellers"
            checked={!selectedVendor}
            onChange={() => updateParams({ vendor: '', vendorId: '' })}
          />
          {visibleVendors.map((vendor) => (
            <FilterRadioItem
              key={vendor.id}
              id={`seller-${vendor.id}`}
              label={vendor.name}
              checked={isVendorSelected(vendor)}
              count={vendor._count?.products}
              onChange={() =>
                updateParams({
                  vendor: isVendorSelected(vendor) ? '' : vendor.id,
                  vendorId: '',
                })
              }
            />
          ))}
        </div>
        {vendors.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllVendors((prev) => !prev)}
            className="mt-2 flex items-center gap-1 text-[13px] font-semibold text-[#165DD0] hover:underline"
          >
            {showAllVendors ? 'See less' : `See more (${vendors.length - 5})`}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                showAllVendors ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>
    </aside>
  );
}
