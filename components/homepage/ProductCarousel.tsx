"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { CarouselProduct } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  title: string;
  products: CarouselProduct[];
  exploreHref: string;
  className?: string;
}

export default function ProductCarousel({
  title,
  products,
  exploreHref,
  className,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className={cn(
        "relative flex flex-col bg-white p-6 rounded-[4px] border border-[#E5E5E6] shadow-sm",
        className
      )}
    >
      {/* Title */}
      <h3 className="text-[20px] font-bold leading-[1.2] text-black mb-4 truncate">
        {title}
      </h3>

      {/* Carousel Wrapper */}
      <div className="relative group/carousel">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-all hover:bg-gray-50 active:scale-95 z-20 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-black" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide items-stretch"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/product/deals/${product.id}`}
              className="flex w-[199px] shrink-0 group focus-visible:outline-none"
            >
              <ProductCard
                imageSrc={product.imageSrc}
                imageAlt={product.imageAlt}
                title={product.title}
                rating={product.rating}
                reviewCount={product.reviewCount}
                price={product.price}
                originalPrice={product.originalPrice}
                badgeText={product.badgeText}
                badgeLabel={product.badgeLabel}
                offerText={product.offerText}
                shippingText={product.shippingText}
                buttonVariant="none"
              />
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-all hover:bg-gray-50 active:scale-95 z-20 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-black" />
        </button>
      </div>

      {/* Explore More link at the bottom */}
      <div className="mt-4 border-t border-[#F4F4F5] pt-4">
        <Link
          href={exploreHref}
          className="inline-flex items-center gap-1.5 text-[14px] font-normal text-[#165DD0] hover:text-[#0f4494] transition-colors group"
        >
          <span>Explore More</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
