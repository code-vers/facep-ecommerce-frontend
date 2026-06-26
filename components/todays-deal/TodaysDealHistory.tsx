/**
 * @fileoverview Inspired by your browsing history component.
 * Displays tailored products for the user using premium grid & carousel behaviors.
 *
 * @module components/todays-deal/TodaysDealHistory
 */

'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';

const IMG1 = '/ImageWithFallback.png';
const IMG2 = '/ImageWithFallback2.png';

const PRODUCTS = Array.from({ length: 24 }).map((_, i) => ({
  id: `bh-td-${i}`,
  title: i % 2 === 0 ? 'Gaming Setup' : 'Office Chair',
  price: i % 2 === 0 ? '$299.99' : '$199.99',
  offerText: i % 2 === 0 ? 'Up to 30% off' : 'Free Shipping on orders over $50',
  rating: 4.5,
  reviewCount: '624+',
  shippingText: '$36 Shipping',
  imageSrc: i % 2 === 0 ? IMG1 : IMG2,
}));

/**
 * TodaysDealHistory component.
 * Shows personal browsing suggestions with carousel paging indicator.
 */
export default function TodaysDealHistory() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      // Mock page tracking
      setCurrentPage((prev) => {
        if (direction === 'left') {
          return prev > 1 ? prev - 1 : 1;
        } else {
          return prev < totalPages ? prev + 1 : totalPages;
        }
      });
    }
  };

  return (
    <section className="w-full border-t border-[#E5E5E6] bg-white py-12">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-black tracking-tight">
            Inspired by your browsing history
          </h2>
          <div className="text-[14px] text-gray-500 font-semibold">
            Page {currentPage}/{totalPages}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/bh">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-none select-none"
          >
            {PRODUCTS.map((product, idx) => (
              <div key={idx} className="flex w-[176px] sm:w-[199px] shrink-0">
                <ProductCard
                  imageSrc={product.imageSrc}
                  imageAlt={product.title}
                  title={product.title}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  price={product.price}
                  offerText={product.offerText}
                  shippingText={product.shippingText}
                  buttonVariant="none"
                  className='border border-black/5'
                />
              </div>
            ))}
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            type="button"
            className="absolute -left-3 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-all hover:bg-gray-50 hover:scale-105 z-20 opacity-0 group-hover/bh:opacity-100 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-black" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            type="button"
            className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-all hover:bg-gray-50 hover:scale-105 z-20 opacity-0 group-hover/bh:opacity-100 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-black" />
          </button>
        </div>

        {/* Explore More Button */}
        <div className="mt-8 flex justify-center">
          <button className="h-[43px] w-[211px] items-center justify-center rounded-[2px] bg-[#dec33a] hover:bg-[#c9b034] text-[16px] font-normal text-black transition-colors cursor-pointer shadow-sm">
            Explore More
          </button>
        </div>

      </div>
    </section>
  );
}
