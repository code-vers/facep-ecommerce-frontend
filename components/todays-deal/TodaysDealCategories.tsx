/**
 * @fileoverview Shop deals by category carousel component.
 * Allows users to filter deals by e-commerce categories.
 *
 * @module components/todays-deal/TodaysDealCategories
 */

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { DEAL_CATEGORIES } from '@/lib/todays-deal-data';

/**
 * TodaysDealCategories component.
 * Horizontally scrollable category list with side navigation buttons.
 */
export default function TodaysDealCategories() {
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
    <section className="w-full py-8 md:py-12 bg-white border-b border-[#E5E5E6]">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 relative">
        {/* Title and navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-[#0a0a0a] tracking-tight">
            Shop deals by category
          </h2>
          
          {/* Navigation Controls */}
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

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-2 select-none -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:mx-0 lg:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {DEAL_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex-none w-[170px] sm:w-[199px] h-[222px] bg-white border border-[#E5E5E6] rounded overflow-hidden hover:border-[#ffd014] transition-all hover:shadow-md duration-300"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Product Category Image */}
              <div className="relative w-full h-[180px] bg-gray-50 overflow-hidden">
                <Image
                  src={category.imageSrc}
                  alt={category.title}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Arrow */}
              <div className="h-10 px-3 flex items-center justify-between bg-white">
                <span className="text-[14px] font-semibold text-[#0a0a0a] truncate max-w-[80%]">
                  {category.title}
                </span>
                <ArrowRight
                  size={15}
                  className="text-black group-hover:translate-x-1 transition-transform duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
