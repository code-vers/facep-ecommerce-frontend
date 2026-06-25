"use client";

import React, { useRef } from 'react';
import ProductCard from '@/components/shared/ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const IMG1 = '/ImageWithFallback.png';
const IMG2 = '/ImageWithFallback2.png';

const products = Array.from({ length: 16 }).map((_, i) => ({
  id: `bh-${i}`,
  title: i % 2 === 0 ? 'Gaming Setup' : 'Office Chair',
  price: i % 2 === 0 ? '$299.99' : '$199.99',
  offerText: i % 2 === 0 ? 'Up to 30% off' : 'Free Shipping on orders over $50',
  rating: 4.5,
  reviewCount: '624+',
  shippingText: '$36 Shipping',
  imageSrc: i % 2 === 0 ? IMG1 : IMG2,
}));

export default function BrowsingHistory() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full border-t border-[#E5E5E6] bg-white py-12">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-black">Inspired by your browsing history</h2>
          <div className="text-[14px] text-[#42454D]">Page 1/5</div>
        </div>

        <div className="relative group/bh">
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, idx) => (
              <div key={idx} className="h-full w-[176px] sm:w-[199px] shrink-0">
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
                />
              </div>
            ))}
          </div>

          {/* Nav arrows - visible only on desktop hover */}
          <button 
            onClick={() => scroll('left')}
            type="button"
            className="absolute -left-3 top-[100px] sm:top-[90px] md:top-[90px] lg:top-[90px] xl:top-[90px] hidden md:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-all hover:bg-gray-50 active:scale-95 z-20 opacity-0 group-hover/bh:opacity-100 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-black" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            type="button"
            className="absolute -right-3 top-[100px] sm:top-[90px] md:top-[90px] lg:top-[90px] xl:top-[90px] hidden md:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-all hover:bg-gray-50 active:scale-95 z-20 opacity-0 group-hover/bh:opacity-100 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-black" />
          </button>
        </div>

        {/* Explore More Button */}
        <div className="mt-[36px] flex justify-center">
          <button className="flex h-[43px] w-[211px] items-center justify-center rounded-[2px] border border-[#DEC33A] bg-[#DEC33A] transition-colors hover:bg-[#C9B034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC33A] focus-visible:ring-offset-1 cursor-pointer">
            <span className="text-[16px] font-normal text-black">Explore More</span>
          </button>
        </div>
      </div>
    </section>
  );
}
