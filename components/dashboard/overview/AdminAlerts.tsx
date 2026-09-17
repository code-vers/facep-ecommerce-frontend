'use client';

import React from 'react';
import Link from 'next/link';
import { Store, Box, MessageCircleQuestion } from 'lucide-react';
import type { IOverviewAlerts } from '@/lib/api/dashboard';

interface AdminAlertsProps {
  alerts?: IOverviewAlerts;
}

export default function AdminAlerts({ alerts }: AdminAlertsProps) {
  const pendingStores = alerts?.pendingStoresCount ?? 0;
  const pendingProducts = alerts?.pendingProductsCount ?? 0;
  const supportInquiries = alerts?.supportInquiriesCount ?? 0;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Stores Alert */}
      <div className="bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col justify-between min-h-[154px]">
        <div className="flex gap-4 items-start">
          <Store className="size-6 text-[#cb1b1b] shrink-0" />
          <div className="flex flex-col gap-2">
            <h3 className="text-[18px] text-[#cb1b1b] leading-[1.2]">Pending Approvals For New Vendors/Stores</h3>
            <p className="text-[22px] font-semibold text-[#42454d] leading-[1.2]">{pendingStores}</p>
          </div>
        </div>
        <Link
          href="/dashboard/vendors?status=pending"
          className="w-full mt-4 border border-[#686f7d] rounded-[2px] py-2 flex items-center justify-center text-[14px] text-black hover:bg-gray-50 transition-colors"
        >
          Manage Pending Stores
        </Link>
      </div>

      {/* Products Alert */}
      <div className="bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col justify-between min-h-[154px]">
        <div className="flex gap-4 items-start">
          <Box className="size-6 text-[#cb1b1b] shrink-0" />
          <div className="flex flex-col gap-2">
            <h3 className="text-[18px] text-[#cb1b1b] leading-[1.2]">Pending Approvals For New Products</h3>
            <p className="text-[22px] font-semibold text-[#42454d] leading-[1.2]">{pendingProducts}</p>
          </div>
        </div>
        <Link
          href="/dashboard/products"
          className="w-full mt-4 border border-[#686f7d] rounded-[2px] py-2 flex items-center justify-center text-[14px] text-black hover:bg-gray-50 transition-colors"
        >
          Manage Pending Products
        </Link>
      </div>

      {/* Support Inquiries Alert */}
      <div className="bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col justify-between min-h-[154px]">
        <div className="flex gap-4 items-start">
          <MessageCircleQuestion className="size-6 text-[#165dd0] shrink-0" />
          <div className="flex flex-col gap-2">
            <h3 className="text-[18px] text-[#165dd0] leading-[1.2]">Support Inquiries</h3>
            <p className="text-[22px] font-semibold text-[#42454d] leading-[1.2]">{supportInquiries}</p>
          </div>
        </div>
        <Link
          href="/dashboard/support"
          className="w-full mt-4 border border-[#686f7d] rounded-[2px] py-2 flex items-center justify-center text-[14px] text-black hover:bg-gray-50 transition-colors"
        >
          Reply to Inquiries
        </Link>
      </div>

    </div>
  );
}
