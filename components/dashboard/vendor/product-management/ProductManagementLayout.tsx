/**
 * @fileoverview Main Layout container for the Vendor Product Management layout.
 * Integrates the StatsCards metrics bar and the ProductTable lists.
 *
 * @module components/dashboard/vendor/product-management/ProductManagementLayout
 */

'use client';

import { VENDOR_PRODUCTS, VENDOR_STATS } from '@/lib/vendor-data';
import StatsCards from './StatsCards';
import ProductTable from './ProductTable';

export default function ProductManagementLayout() {
  return (
    <div className="flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white">
      {/* ── Section 1: Dashboard Analytics Summary Cards ── */}
      <section aria-label="Product Analytics Summary" className="w-full">
        <StatsCards stats={VENDOR_STATS} />
      </section>

      {/* ── Section 2: Products Catalog Table ── */}
      <section aria-label="Vendor Products Catalog" className="w-full overflow-hidden">
        <ProductTable products={VENDOR_PRODUCTS} />
      </section>
    </div>
  );
}
