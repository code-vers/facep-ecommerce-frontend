/**
 * @fileoverview Hot Deals Today carousel component.
 * Displays limited-time high-discount offers.
 *
 * @module components/todays-deal/TodaysDealHotDeals
 */

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HOT_DEALS } from '@/lib/todays-deal-data';

/**
 * TodaysDealHotDeals component.
 * Features highly styled product cards with badge highlights and horizontal scroll support.
 */
export default function TodaysDealHotDeals() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full py-8 md:py-12 bg-[#F4F4F5]">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative">
        
        {/* Header section with nav controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-[20px] sm:text-[24px] font-bold text-[#0a0a0a] tracking-tight">
              Hot Deals Today
            </h2>
            <span className="hidden sm:inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 ring-1 ring-inset ring-red-600/10 animate-pulse">
              Ends Today
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E6] bg-white text-black transition-colors hover:bg-gray-50 active:bg-gray-100 hover:shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E6] bg-white text-black transition-colors hover:bg-gray-50 active:bg-gray-100 hover:shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-4 select-none -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:mx-0 lg:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {HOT_DEALS.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[200px] sm:w-[220px] md:w-[240px] bg-white border border-[#E5E5E6] rounded overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Product Image */}
              <Link href={`/product/deals/${product.id}`} className="relative w-full h-[160px] sm:h-[180px] bg-gray-50 overflow-hidden">
                <Image
                  src={product.imageSrc}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Product details */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2 bg-white">
                {/* Badges block */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center bg-[#CC0C39] px-2 py-0.5 rounded-[2px] text-[11px] sm:text-[12px] font-bold text-white">
                    {product.discountBadge}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#CC0C39] uppercase">
                    {product.offerLabel}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/product/deals/${product.id}`} className="text-[13px] sm:text-[14px] text-gray-900 font-medium hover:text-[#dec33a] line-clamp-2 min-h-[38px] leading-tight">
                  {product.title}
                </Link>

                {/* Price block */}
                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-[18px] sm:text-[20px] font-bold text-black">
                    ${product.price}
                  </span>
                  <span className="text-[13px] sm:text-[14px] text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
