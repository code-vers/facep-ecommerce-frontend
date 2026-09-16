/**
 * @fileoverview Facep Homepage implementation matching Figma Node 2008:4268.
 * Replaces the initial showcase homepage with production-ready, highly responsive Sections.
 *
 * @module app/page
 */

"use client";

import CategoryGridCard, { CategoryGridCardSkeleton } from "@/components/homepage/CategoryGridCard";
import HeroSection from "@/components/homepage/HeroSection";
import ProductCarousel, { ProductCarouselSkeleton } from "@/components/homepage/ProductCarousel";
import SignUpBanner from "@/components/product/SignUpBanner";
import { useHomepageCategoryGrids } from "@/hooks/api/useCategory";
import {
  mapProductToCarousel,
  useRelatedToViewedProducts,
  useTopCategoriesShowcase,
} from "@/hooks/api/useProduct";
import {
  CAROUSEL_BEST_CLOTHING_ITEMS,
  CAROUSEL_VIEWED_ITEMS,
  CATEGORY_GRIDS_1,
  CATEGORY_GRIDS_2,
} from "@/lib/homepage-data";

export default function Home() {
  const { grid1, grid2, hasData: hasCategoryData, isLoading: isCategoryLoading } = useHomepageCategoryGrids();
  const {
    products: viewedProducts,
    isLoading: isViewedLoading,
    hasData: hasViewedData,
  } = useRelatedToViewedProducts();
  const {
    data: topCategories,
    isLoading: isTopCategoriesLoading,
  } = useTopCategoriesShowcase();
  const hasTopCategoriesData = Boolean(topCategories && topCategories.length > 0);

  const displayGrid1 = hasCategoryData ? grid1 : CATEGORY_GRIDS_1;
  const displayGrid2 = hasCategoryData ? grid2 : CATEGORY_GRIDS_2;

  return (
    <main className="min-h-screen bg-[#F4F4F5]">
      {/* ── 1. Hero Section ── */}
      <HeroSection />

      {/* Main Content Layout Container */}
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-10 space-y-12 md:space-y-16 pb-16">

        {/* ── 2. Category Grid 1 ── */}
        <section aria-label="Featured Categories Grid 1" className="-mt-16 sm:-mt-32 md:-mt-48 lg:-mt-64 xl:-mt-80 relative z-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isCategoryLoading && !hasCategoryData
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CategoryGridCardSkeleton key={`skeleton-grid-1-${i}`} />
                ))
              : displayGrid1.map((grid) => (
                  <CategoryGridCard key={grid.id} data={grid} />
                ))}
          </div>
        </section>

        {/* ── 3. Category Grid 2 ── */}
        <section aria-label="Featured Categories Grid 2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isCategoryLoading && !hasCategoryData
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CategoryGridCardSkeleton key={`skeleton-grid-2-${i}`} />
                ))
              : displayGrid2.map((grid) => (
                  <CategoryGridCard key={grid.id} data={grid} />
                ))}
          </div>
        </section>

        {/* ── 4. Carousel 1 — Related to items you've viewed ── */}
        {isViewedLoading && !hasViewedData ? (
          <ProductCarouselSkeleton title="Related to items you’ve viewed" />
        ) : (
          <ProductCarousel
            title="Related to items you’ve viewed"
            products={hasViewedData ? viewedProducts : CAROUSEL_VIEWED_ITEMS}
            exploreHref="/products"
          />
        )}

        {/* ── 5. Best Sellers ── */}
        <ProductCarousel
          title="Best Sellers"
          products={CAROUSEL_BEST_CLOTHING_ITEMS}
          exploreHref="/products?category=clothing"
        />

        {/* ── 6. Top 5 Categories with Highest Product Count ── */}
        {isTopCategoriesLoading && !hasTopCategoriesData
          ? Array.from({ length: 5 }).map((_, i) => (
              <ProductCarouselSkeleton key={`top-cat-skeleton-${i}`} />
            ))
          : topCategories?.map((cat) => (
              <ProductCarousel
                key={cat.id}
                title={`Top picks in ${cat.name}`}
                products={cat.products.map(mapProductToCarousel)}
                exploreHref={`/products?category=${encodeURIComponent(cat.name)}`}
              />
            ))}
      </div>

      {/* ── Sign In Section ── */}
      <div className="">
        <SignUpBanner />
      </div>
    </main>
  );
}
