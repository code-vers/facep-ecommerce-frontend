'use client';

import { useVendorProductStats } from '@/hooks/api/useProduct';
import StatsCards from './StatsCards';
import ProductTable from './ProductTable';

export default function ProductManagementLayout() {
  const { data } = useVendorProductStats();
  const stats = {
    totalProducts: { value: data?.total ?? 0, trend: '', period: '' },
    lowStock: data?.lowStock ?? 0,
    outOfStock: data?.outOfStock ?? 0,
    inStock: data?.inStock ?? 0,
  };
  return (
    <div className="flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white">
      {/* ── Section 1: Dashboard Analytics Summary Cards ── */}
      <section aria-label="Product Analytics Summary" className="w-full">
      <StatsCards stats={stats} />
      </section>

      {/* ── Section 2: Products Catalog Table ── */}
      <section aria-label="Products Catalog" className="w-full overflow-hidden">
        <ProductTable />
      </section>
    </div>
  );
}
