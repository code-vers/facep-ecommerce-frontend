"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "@/hooks/api/useCategory";
import { getImageUrl } from "@/lib/utils";

interface HeroCardItem {
  name: string;
  image: string;
  href: string;
}

const FALLBACK_HERO_CATEGORIES: HeroCardItem[] = [
  {
    name: "Lighting Solutions",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Lighting%20Solutions",
  },
  {
    name: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Home%20Decor",
  },
  {
    name: "Smart Home",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Smart%20Home%20%26%20Lighting",
  },
  {
    name: "Home Appliances",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Home%20Appliances",
  },
  {
    name: "Living Room",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Living%20Room%20Furniture",
  },
  {
    name: "Bedroom & Bedding",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Bedroom%20Furniture%20%26%20Bedding",
  },
  {
    name: "Kitchen Appliances",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Kitchen%20Appliances",
  },
  {
    name: "Kitchenware",
    image:
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Kitchenware%20%26%20Utensils",
  },
  {
    name: "Dining Room",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Dining%20Room%20Furniture",
  },
  {
    name: "Office & Setup",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop",
    href: "/products?category=Office%20Furniture%20%26%20Setup",
  },
];

export default function CategoryHeroCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categoriesData } = useCategories(1, 10);

  const apiCategories: HeroCardItem[] = (categoriesData?.data || []).map(
    (cat, idx) => ({
      name: cat.name,
      image: cat.imageUrl
        ? getImageUrl(cat.imageUrl)
        : FALLBACK_HERO_CATEGORIES[idx]?.image || "/banner.png",
      href: `/products?category=${encodeURIComponent(cat.name)}`,
    }),
  );

  // Ensure total of exactly 10 cards
  const cards: HeroCardItem[] = [
    ...apiCategories,
    ...FALLBACK_HERO_CATEGORIES.slice(apiCategories.length),
  ].slice(0, 10);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Card width (300px) + gap (20px) = 320px; scroll 2 cards at a time
      const scrollAmount = 320 * 2;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      aria-label="Featured Categories Carousel"
      className="w-full bg-white pt-6 pb-2 md:pt-8 md:pb-4"
    >
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-10">
        <div className="relative group/hero">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#E5E5E6] bg-white text-black shadow-lg transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none"
            aria-label="Previous categories"
          >
            <ChevronLeft size={24} className="text-black" />
          </button>

          {/* Cards Track */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth py-3 px-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((card, index) => (
              <Link
                key={`${card.name}-${index}`}
                href={card.href}
                className="group relative shrink-0 w-75 h-125 overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer block select-none border border-[#E5E5E6]"
              >
                {/* Full Card Category Image */}
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  unoptimized
                  sizes="300px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Subtle top gradient overlay to guarantee text readability */}
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/15 to-transparent pointer-events-none" />

                {/* Category Name in Top Left Corner */}
                <div className="absolute top-5 left-5 right-5 z-10">
                  <h3 className="text-[24px] sm:text-[26px] font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
                    {card.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#E5E5E6] bg-white text-black shadow-lg transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none"
            aria-label="Next categories"
          >
            <ChevronRight size={24} className="text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}
