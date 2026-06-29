/**
 * @fileoverview StatsCards component for the Vendor Product Management dashboard.
 * Displays total products (with monthly filtering & growth trend), low stock, out of stock, and in stock metrics.
 *
 * @module components/dashboard/vendor/product-management/StatsCards
 */

'use client';

import { Boxes, ChevronDown, TrendingUp, AlertCircle, Box } from 'lucide-react';
import type { VendorStats } from '@/lib/vendor-data';

interface StatsCardsProps {
  stats: VendorStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total Products */}
      <div className="flex flex-col justify-between h-[153px] p-4 bg-[#F2F2F3] border border-[#E5E5E6] rounded-[4px] shadow-sm">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center justify-center p-2.5 bg-[#EDE7DE] rounded-[2px] text-black">
            <Boxes size={16} />
          </div>
          
          <div className="flex flex-col items-end gap-1.5">
            {/* Tag/Filter Dropdown */}
            <div className="flex items-center gap-1 py-0.5 px-1.5 rounded cursor-pointer hover:bg-black/5 transition-colors">
              <span className="text-[12px] text-[#848995] font-normal leading-[1.3]">
                {stats.totalProducts.period}
              </span>
              <ChevronDown size={12} className="text-[#848995]" />
            </div>
            
            {/* Trend Indicator */}
            <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#E0EBE4] rounded-[2px] w-fit">
              <TrendingUp size={12} className="text-[#229A4E]" />
              <span className="text-[12px] font-normal leading-[1.3] text-[#229A4E]">
                {stats.totalProducts.trend}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 select-none">
          <span className="font-sans text-[24px] font-bold leading-[1.2] text-black">
            {stats.totalProducts.value}
          </span>
          <span className="font-sans text-[14px] font-normal leading-[1.3] text-[#42454D]">
            Total Products
          </span>
        </div>
      </div>

      {/* Card 2: Low Stock */}
      <div className="flex flex-col justify-between h-[153px] p-4 bg-white border border-[#E5E5E6] rounded-[4px] shadow-sm">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center justify-center p-2.5 bg-[#EEEBE2] rounded-[2px] text-[#EBAF0A]">
            <AlertCircle size={16} />
          </div>
        </div>

        <div className="flex flex-col gap-1 select-none">
          <span className="font-sans text-[24px] font-bold leading-[1.2] text-black">
            {stats.lowStock}
          </span>
          <span className="font-sans text-[14px] font-normal leading-[1.3] text-[#42454D]">
            Low Stock
          </span>
        </div>
      </div>

      {/* Card 3: Out of Stock */}
      <div className="flex flex-col justify-between h-[153px] p-4 bg-white border border-[#E5E5E6] rounded-[4px] shadow-sm">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center justify-center p-2.5 bg-[#ECDFDF] rounded-[2px] text-[#CB1B1B]">
            <AlertCircle size={16} />
          </div>
        </div>

        <div className="flex flex-col gap-1 select-none">
          <span className="font-sans text-[24px] font-bold leading-[1.2] text-black">
            {stats.outOfStock}
          </span>
          <span className="font-sans text-[14px] font-normal leading-[1.3] text-[#42454D]">
            Out of Stock
          </span>
        </div>
      </div>

      {/* Card 4: In Stock */}
      <div className="flex flex-col justify-between h-[153px] p-4 bg-white border border-[#E5E5E6] rounded-[4px] shadow-sm">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center justify-center p-2.5 bg-[#E0EBE4] rounded-[2px] text-[#229A4E]">
            <Box size={16} />
          </div>
        </div>

        <div className="flex flex-col gap-1 select-none">
          <span className="font-sans text-[24px] font-bold leading-[1.2] text-black">
            {stats.inStock}
          </span>
          <span className="font-sans text-[14px] font-normal leading-[1.3] text-[#42454D]">
            In Stock
          </span>
        </div>
      </div>
    </div>
  );
}
