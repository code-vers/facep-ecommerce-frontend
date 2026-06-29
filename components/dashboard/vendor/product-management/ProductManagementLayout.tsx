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
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[1760px] mx-auto pb-12">
      {/* ── Section 1: Dashboard Analytics Summary Cards ── */}
      <section aria-label="Product Analytics Summary">
        <StatsCards stats={VENDOR_STATS} />
      </section>

      {/* ── Section 2: Products Catalog Table ── */}
      <section aria-label="Vendor Products Catalog">
        <ProductTable products={VENDOR_PRODUCTS} />
      </section>
    </div>
  );
}
