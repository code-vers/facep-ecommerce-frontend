/**
 * @fileoverview Facep Today's Deals Page implementation matching Figma Node 2064:148.
 * Combines Hero banner, Category listings, Hot deals carousel, Catalog with filters, and CTA banners.
 *
 * @module app/todays-deal/page
 */

import TodaysDealHero from '@/components/todays-deal/TodaysDealHero';
import TodaysDealCategories from '@/components/todays-deal/TodaysDealCategories';
import TodaysDealHotDeals from '@/components/todays-deal/TodaysDealHotDeals';
import TodaysDealCatalog from '@/components/todays-deal/TodaysDealCatalog';
import TodaysDealHistory from '@/components/todays-deal/TodaysDealHistory';
import TodaysDealCta from '@/components/todays-deal/TodaysDealCta';

export const metadata = {
  title: 'Today’s Deals — Facep',
  description: 'Shop our daily discount specials, Father’s Day Sales, and limited-time promotional offers.',
};

/**
 * TodaysDealsPage component.
 * Assembles all Daily Deals page elements into a single responsive layout.
 */
export default function TodaysDealsPage() {
  return (
    <main className="min-h-screen bg-[#F4F4F5]">
      {/* ── 1. Hero / Promotional Section ── */}
      <TodaysDealHero />

      {/* ── 2. Category Carousel Section ── */}
      <TodaysDealCategories />

      {/* ── 3. Hot Deals Slider Section ── */}
      <TodaysDealHotDeals />

      {/* ── 4. Main Deals Filterable Catalog Section ── */}
      <TodaysDealCatalog />

      {/* ── 5. Inspired by Browsing History Section ── */}
      <TodaysDealHistory />

      {/* ── 6. Auth Integration CTA Section ── */}
      <TodaysDealCta />
    </main>
  );
}
