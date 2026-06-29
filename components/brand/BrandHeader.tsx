/**
 * @fileoverview BrandHeader sub-component for Brand Store Front.
 * Renders logo, search inputs, follow action, policy links, and description.
 *
 * @module components/brand/BrandHeader
 */

import Link from 'next/link';
import { Heart, Search, ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandHeaderProps {
  searchInputValue: string;
  setSearchInputValue: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isFollowed: boolean;
  setIsFollowed: (val: boolean) => void;
}

export default function BrandHeader({
  searchInputValue,
  setSearchInputValue,
  onSearchSubmit,
  isFollowed,
  setIsFollowed,
}: BrandHeaderProps) {
  return (
    <section className="bg-white border-b border-[#E5E5E6] py-6 sm:py-8">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10 flex flex-col gap-6">
        {/* Logo & Search Bar Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Brand Identity & Follow Button */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-[8px] bg-emerald-700 flex items-center justify-center shadow-md border border-emerald-600">
              <span className="text-white text-3xl font-serif font-bold italic tracking-wider select-none">
                P
              </span>
              <div className="absolute bottom-1 right-1 size-2 rounded-full bg-[#dec33a] animate-pulse" />
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">
              <h2 className="text-[24px] sm:text-[32px] font-bold leading-none text-black tracking-tight font-sans">
                Plant House
              </h2>
              <p className="text-[14px] text-emerald-800 font-medium">Official Premium Storefront</p>
            </div>
            <button
              type="button"
              onClick={() => setIsFollowed(!isFollowed)}
              className={cn(
                "flex items-center gap-2 h-10 px-5 rounded-[2px] text-[14px] font-bold transition-all duration-200 cursor-pointer shadow-xs border focus-visible:outline-hidden",
                isFollowed
                  ? "bg-[#E5E5E6] border-[#CACACE] text-gray-700 hover:bg-gray-200"
                  : "bg-[#dec33a] border-[#dec33a] text-black hover:bg-[#C9B034] hover:border-[#C9B034] active:bg-[#B49A2E]"
              )}
            >
              <Heart size={16} fill={isFollowed ? "currentColor" : "none"} />
              <span>{isFollowed ? "Favourites Added" : "Add to Favourites"}</span>
            </button>
          </div>

          {/* Right: Search Box */}
          <form onSubmit={onSearchSubmit} className="flex min-w-0 w-full lg:max-w-xl items-center border border-[#CACACE] rounded-[2px] bg-white shadow-xs focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
            <div className="hidden sm:flex h-11 shrink-0 items-center gap-1.5 rounded-l-sm bg-gray-100 px-3.5 border-r border-[#CACACE] text-[14px] text-[#42454d]">
              <span>All</span>
              <ChevronDown size={14} />
            </div>
            <div className="flex h-11 min-w-0 flex-1 items-center px-3.5">
              <input
                type="text"
                placeholder="Search Products In This Store"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-black outline-hidden placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="flex h-11 w-12 shrink-0 items-center justify-center rounded-r-sm bg-[#dec33a] hover:bg-[#C9B034] transition-colors text-black cursor-pointer"
              aria-label="Search Store"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Description Copy */}
        <div className="flex flex-col gap-4">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 max-w-5xl">
            Immerse yourself in nature with Plant House. Enjoy premium, organic house plants that bring clean air, focus, and a serene atmosphere to your space. Each plant is meticulously nurtured, hand-selected, and shipped with absolute care to guarantee robust health and a stunning layout straight out of the box. Whether decorating your living room, desk, or looking for premium pots and soil blends, we guide you at every step of your plant parent journey.
          </p>

          {/* Policy Row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-1">
            <Link
              href="#"
              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#165DD0] hover:underline"
            >
              <span>Return Policy</span>
              <ExternalLink size={14} />
            </Link>
            <Link
              href="#"
              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#165DD0] hover:underline"
            >
              <span>Shipping Policy</span>
              <ExternalLink size={14} />
            </Link>
            <Link
              href="#"
              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#165DD0] hover:underline"
            >
              <span>Warranty Information</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
