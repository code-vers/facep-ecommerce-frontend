/**
 * @fileoverview Facep Homepage implementation matching Figma Node 2008:4268.
 * Replaces the initial showcase homepage with production-ready, highly responsive Sections.
 *
 * @module app/page
 */

"use client";

import CategoryGridCard, { CategoryGridCardSkeleton } from "@/components/homepage/CategoryGridCard";
import CategoryHeroCards from "@/components/homepage/CategoryHeroCards";
// import HeroSection from "@/components/homepage/HeroSection";
import ProductCarousel, { ProductCarouselSkeleton } from "@/components/homepage/ProductCarousel";
import SignUpBanner from "@/components/product/SignUpBanner";
import { useHomepageCategoryGrids } from "@/hooks/api/useCategory";
import {
  mapProductToCarousel,
  useEarlyDeals,
  useSpecialProducts,
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

  const { data: earlyDealsData, isLoading: isEarlyDealsLoading } = useEarlyDeals({ limit: 12 });
  const { data: specialProductsData, isLoading: isSpecialLoading } = useSpecialProducts({ limit: 12 });

  const earlyDealsProducts = earlyDealsData?.data || [];
  const specialProducts = specialProductsData?.data || [];

  const displayGrid1 = hasCategoryData ? grid1 : CATEGORY_GRIDS_1;
  const displayGrid2 = hasCategoryData ? grid2 : CATEGORY_GRIDS_2;

  return (
    <main className="min-h-screen bg-white">
      {/* ── 1. Hero Section (Previous Hero commented, replaced with CategoryHeroCards) ── */}
      {/* <HeroSection /> */}
      <CategoryHeroCards />

      {/* Main Content Layout Container */}
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-10 space-y-12 md:space-y-16 pb-16">

        {/* ── 2. Category Grid 1 ── */}
        <section aria-label="Featured Categories Grid 1" className="relative z-20">
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

        {/* ── Early Deals Carousel ── */}
        {isEarlyDealsLoading ? (
          <ProductCarouselSkeleton title="Early Deals" />
        ) : earlyDealsProducts.length > 0 ? (
          <ProductCarousel
            title="Early Deals"
            products={earlyDealsProducts.map(mapProductToCarousel)}
            exploreHref="/early-deals"
          />
        ) : null}

        {/* ── Special Products Carousel ── */}
        {isSpecialLoading ? (
          <ProductCarouselSkeleton title="Special Products" />
        ) : specialProducts.length > 0 ? (
          <ProductCarousel
            title="Special Products"
            products={specialProducts.map(mapProductToCarousel)}
            exploreHref="/special-products"
          />
        ) : null}

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
