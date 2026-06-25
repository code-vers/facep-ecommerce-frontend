/**
 * @fileoverview Facep Homepage implementation matching Figma Node 2008:4268.
 * Replaces the initial showcase homepage with production-ready, highly responsive Sections.
 *
 * @module app/page
 */

"use client";

import CategoryGridCard from "@/components/homepage/CategoryGridCard";
import HeroSection from "@/components/homepage/HeroSection";
import ProductCarousel from "@/components/homepage/ProductCarousel";
import BrowsingHistory from "@/components/product/BrowsingHistory";
import SignUpBanner from "@/components/product/SignUpBanner";
import {
  CAROUSEL_BEAUTY_ITEMS,
  CAROUSEL_BEST_CLOTHING_ITEMS,
  CAROUSEL_CANADA_ITEMS,
  CAROUSEL_CLOTHES_SHOES_ITEMS,
  CAROUSEL_HOME_ITEMS,
  CAROUSEL_VIEWED_ITEMS,
  CAROUSEL_WIRELESS_ITEMS,
  CATEGORY_GRIDS_1,
  CATEGORY_GRIDS_2,
  CATEGORY_GRIDS_3,
  CATEGORY_GRIDS_4,
} from "@/lib/homepage-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4F4F5]">
      {/* ── 1. Hero Section ── */}
      <HeroSection />

      {/* Main Content Layout Container */}
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-10 space-y-12 md:space-y-16 pb-16">

        {/* ── 2. Category Grid 1 ── */}
        <section aria-label="Home and Decor Categories" className="-mt-16 sm:-mt-32 md:-mt-48 lg:-mt-64 xl:-mt-80 relative z-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_GRIDS_1.map((grid) => (
              <CategoryGridCard key={grid.id} data={grid} />
            ))}
          </div>
        </section>

        {/* ── 3. Category Grid 2 ── */}
        <section aria-label="Kitchen, Fashion, and Gaming Categories">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_GRIDS_2.map((grid) => (
              <CategoryGridCard key={grid.id} data={grid} />
            ))}
          </div>
        </section>

        {/* ── 4. Carousel 1 — Related to items you've viewed ── */}
        <ProductCarousel
          title="Related to items you’ve viewed"
          products={CAROUSEL_VIEWED_ITEMS}
          exploreHref="/products?filter=related"
        />

        {/* ── 5. Carousel 2 — Popular products in Beauty internationally ── */}
        <ProductCarousel
          title="Popular products in Beauty internationally"
          products={CAROUSEL_BEAUTY_ITEMS}
          exploreHref="/products?category=beauty"
        />

        {/* ── 6. Category Grid 3 ── */}
        <section aria-label="Merchandise, Travel, and Toys Categories">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_GRIDS_3.map((grid) => (
              <CategoryGridCard key={grid.id} data={grid} />
            ))}
          </div>
        </section>

        {/* ── 7. Carousel 3 — Best Sellers in Clothing, Shoes & Jewelry ── */}
        <ProductCarousel
          title="Best Sellers in Clothing, Shoes & Jewelry"
          products={CAROUSEL_BEST_CLOTHING_ITEMS}
          exploreHref="/products?category=clothing"
        />

        {/* ── 8. Carousel 4 — Top picks for Canada ── */}
        <ProductCarousel
          title="Top picks for Canada"
          products={CAROUSEL_CANADA_ITEMS}
          exploreHref="/products?filter=canada-picks"
        />

        {/* ── 9. Carousel 5 — Best sellers in cloths, shoes & jewelleries ── */}
        <ProductCarousel
          title="Best sellers in cloths , shoes & jewelleries"
          products={CAROUSEL_CLOTHES_SHOES_ITEMS}
          exploreHref="/products?category=apparel"
        />

        {/* ── 10. Carousel 6 — International top sellers in Home ── */}
        <ProductCarousel
          title="International top sellers in Home"
          products={CAROUSEL_HOME_ITEMS}
          exploreHref="/products?category=home"
        />

        {/* ── 11. Category Grid 4 ── */}
        <section aria-label="Tech and Deals Categories">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_GRIDS_4.map((grid) => (
              <CategoryGridCard key={grid.id} data={grid} />
            ))}
          </div>
        </section>

        {/* ── 12. Carousel 7 — Popular products in Wireless internationally ── */}
        <ProductCarousel
          title="Popular products in Wireless internationally"
          products={CAROUSEL_WIRELESS_ITEMS}
          exploreHref="/products?category=wireless"
        />
      </div>

      {/* ── 13. Browsing History Section ── */}
      <BrowsingHistory />

      {/* ── 14. Sign In Section ── */}
      <div className="mt-8">
        <SignUpBanner />
      </div>
    </main>
  );
}
