/**
 * @fileoverview BrandFilters sub-component for Brand Store Front.
 * Renders the filter options sidebar (Category, price range, review stars, deals).
 *
 * @module components/brand/BrandFilters
 */

import { Filter, Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND_CATEGORIES } from '@/lib/brand-data';

interface BrandFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedDiscount: 'all' | 'deals';
  setSelectedDiscount: (disc: 'all' | 'deals') => void;
  selectedReviewRating: number | null;
  setSelectedReviewRating: (rating: number | null) => void;
  onClearFilters: () => void;
}

export default function BrandFilters({
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  selectedDiscount,
  setSelectedDiscount,
  selectedReviewRating,
  setSelectedReviewRating,
  onClearFilters,
}: BrandFiltersProps) {
  return (
    <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6 bg-white border border-[#E5E5E6] rounded-[4px] p-5 h-fit shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E5E5E6] pb-3">
        <h3 className="text-[18px] font-bold text-black flex items-center gap-2">
          <Filter size={16} className="text-emerald-700" />
          <span>Filter By</span>
        </h3>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-[13px] font-semibold text-[#165DD0] hover:underline cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Filter: Deals & Discounts */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[15px] font-bold text-black">Deals & Discounts</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2.5 text-[14px] text-gray-700 cursor-pointer select-none">
            <input
              type="radio"
              name="discount"
              checked={selectedDiscount === 'all'}
              onChange={() => setSelectedDiscount('all')}
              className="size-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
            />
            <span>All Discounts</span>
          </label>
          <label className="flex items-center gap-2.5 text-[14px] text-gray-700 cursor-pointer select-none">
            <input
              type="radio"
              name="discount"
              checked={selectedDiscount === 'deals'}
              onChange={() => setSelectedDiscount('deals')}
              className="size-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
            />
            <span>Today's Deals Only</span>
          </label>
        </div>
      </div>

      {/* Filter: Price */}
      <div className="flex flex-col gap-3 border-t border-[#E5E5E6] pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[15px] font-bold text-black">Price Limit</h4>
          <span className="text-[14px] font-bold text-emerald-800">
            Up to ${maxPrice}
          </span>
        </div>
        
        {/* Range Slider */}
        <div className="w-full px-1">
          <input
            type="range"
            min="10"
            max="3000"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#dec33a]"
          />
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
            <span>$10</span>
            <span>$3,000</span>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            type="button"
            onClick={() => setMaxPrice(3000)}
            className={cn(
              "text-left text-[14px] py-0.5 hover:text-[#165DD0] cursor-pointer",
              maxPrice === 3000 ? "font-bold text-emerald-800" : "text-gray-600"
            )}
          >
            All Price Ranges
          </button>
          <button
            type="button"
            onClick={() => setMaxPrice(15)}
            className={cn(
              "text-left text-[14px] py-0.5 hover:text-[#165DD0] cursor-pointer",
              maxPrice === 15 ? "font-bold text-emerald-800" : "text-gray-600"
            )}
          >
            Under $15
          </button>
          <button
            type="button"
            onClick={() => setMaxPrice(30)}
            className={cn(
              "text-left text-[14px] py-0.5 hover:text-[#165DD0] cursor-pointer",
              maxPrice === 30 ? "font-bold text-emerald-800" : "text-gray-600"
            )}
          >
            Under $30
          </button>
          <button
            type="button"
            onClick={() => setMaxPrice(50)}
            className={cn(
              "text-left text-[14px] py-0.5 hover:text-[#165DD0] cursor-pointer",
              maxPrice === 50 ? "font-bold text-emerald-800" : "text-gray-600"
            )}
          >
            Under $50
          </button>
        </div>
      </div>

      {/* Filter: Reviews */}
      <div className="flex flex-col gap-3 border-t border-[#E5E5E6] pt-4">
        <h4 className="text-[15px] font-bold text-black">Customer Review</h4>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setSelectedReviewRating(null)}
            className={cn(
              "text-left text-[14px] hover:text-[#165DD0] cursor-pointer",
              selectedReviewRating === null ? "font-bold text-emerald-800" : "text-gray-600"
            )}
          >
            All Ratings
          </button>
          <button
            type="button"
            onClick={() => setSelectedReviewRating(4.5)}
            className="flex items-center gap-1.5 hover:text-[#165DD0] cursor-pointer text-left"
          >
            <div className="flex items-center text-[#dec33a]">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} strokeWidth={1.5} className="text-[#dec33a]" />
              ))}
            </div>
            <span className={cn("text-[13px]", selectedReviewRating === 4.5 ? "font-bold text-emerald-800" : "text-gray-600")}>
              4.5 & Up
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedReviewRating(4.7)}
            className="flex items-center gap-1.5 hover:text-[#165DD0] cursor-pointer text-left"
          >
            <div className="flex items-center text-[#dec33a]">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} fill={i < 5 ? "currentColor" : "none"} strokeWidth={1.5} className="text-[#dec33a]" />
              ))}
            </div>
            <span className={cn("text-[13px]", selectedReviewRating === 4.7 ? "font-bold text-emerald-800" : "text-gray-600")}>
              4.7 & Up
            </span>
          </button>
        </div>
      </div>

      {/* Filter: Categories */}
      <div className="flex flex-col gap-3 border-t border-[#E5E5E6] pt-4">
        <h4 className="text-[15px] font-bold text-black">Category</h4>
        <div className="flex flex-col gap-2">
          {BRAND_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center justify-between text-left text-[14px] py-1 cursor-pointer transition-colors hover:text-[#165DD0]",
                selectedCategory === cat.id
                  ? "font-bold text-emerald-800 border-l-2 border-emerald-700 pl-2"
                  : "text-gray-600"
              )}
            >
              <span>{cat.label}</span>
              {selectedCategory === cat.id && <Check size={14} className="text-emerald-700" />}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
