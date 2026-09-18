'use client';

import React from 'react';
import Link from 'next/link';
import { CircleAlert, CheckCircle2 } from 'lucide-react';

interface LowStockAlertProps {
  count?: number;
}

export default function LowStockAlert({ count = 0 }: LowStockAlertProps) {
  const isLow = count > 0;

  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col h-auto 2xl:h-[154px] gap-4 items-start justify-between min-w-px p-4 rounded bg-white">
      <div className="flex gap-4 items-start shrink-0">
        <div className={`shrink-0 size-6 ${isLow ? 'text-[#cb1b1b]' : 'text-[#229a4e]'}`}>
          {isLow ? (
            <CircleAlert className="size-6" strokeWidth={2} />
          ) : (
            <CheckCircle2 className="size-6" strokeWidth={2} />
          )}
        </div>
        <div className="flex flex-col gap-1 items-start shrink-0 whitespace-nowrap">
          <p className={`leading-[1.2] shrink-0 text-[18px] ${isLow ? 'text-[#cb1b1b]' : 'text-[#229a4e]'}`}>
            {isLow ? 'Low Stock Alert' : 'Stock Status Good'}
          </p>
          <p className="leading-[1.3] shrink-0 text-[14px] text-[#42454d]">
            {isLow
              ? `${count} product${count === 1 ? '' : 's'} running low on stock`
              : 'All products are sufficiently in stock'}
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/products"
        className="border border-[#686f7d] flex items-center justify-center p-2 rounded-sm shrink-0 w-full hover:bg-gray-50 transition-colors"
      >
        <span className="font-normal leading-[1.2] text-[14px] text-black whitespace-nowrap">
          View Inventory
        </span>
      </Link>
    </div>
  );
}
