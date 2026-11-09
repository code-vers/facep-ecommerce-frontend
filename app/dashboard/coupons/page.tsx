'use client';

import React from 'react';
import CouponStatsCards from '@/components/dashboard/coupons/CouponStatsCards';
import CouponsTable from '@/components/dashboard/coupons/CouponsTable';
import { Ticket } from 'lucide-react';

export default function AdminCouponsPage() {

  return (
    <div className="flex w-full flex-col gap-6 bg-white px-4 py-6 md:px-8 md:py-8 2xl:px-11.25 2xl:py-9 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-[#e5e5e6] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-[#DEC33A] text-black flex items-center justify-center shadow-xs">
            <Ticket size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              Coupons &amp; Promotional Vouchers
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              Create, configure, and monitor discount codes, checkout spend rules, and campaign performance.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <CouponStatsCards />

      {/* Main Coupons Management Table */}
      <CouponsTable />
    </div>
  );
}
