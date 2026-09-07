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
        "relative flex flex-col bg-white p-6 rounded-lg border border-[#E5E5E6] shadow-sm",
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
          {products.map((product) => {
            const productHref =
              product.href || (product.slug ? `/products/${product.slug}` : `/products/${product.id}`);
            return (
              <Link 
                key={product.id} 
                href={productHref}
                className="flex w-49.75 shrink-0 group focus-visible:outline-none"
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
            );
          })}
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

export function ProductCarouselSkeleton({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex flex-col bg-white p-6 rounded-lg border border-[#E5E5E6] shadow-sm animate-pulse",
        className
      )}
    >
      {title ? (
        <h3 className="text-[20px] font-bold leading-[1.2] text-black mb-4 truncate">
          {title}
        </h3>
      ) : (
        <div className="h-6 w-64 bg-gray-200 rounded mb-4" />
      )}
      <div className="flex gap-4 overflow-hidden pb-4 items-stretch">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex w-49.75 shrink-0 flex-col gap-2 rounded-lg border border-[#E5E5E6] p-2"
          >
            <div className="h-45 w-full bg-gray-200 rounded-lg" />
            <div className="h-4 w-3/4 bg-gray-200 rounded mt-2" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
            <div className="h-5 w-1/3 bg-gray-200 rounded mt-1" />
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-[#F4F4F5] pt-4">
        <div className="h-4 w-28 bg-gray-200 rounded" />
      </div>
    </section>
  );
}
