'use client';

import React from 'react';
import { CircleAlert } from 'lucide-react';

export default function LowStockAlert() {
  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col h-auto 2xl:h-[154px] gap-4 items-start justify-between min-w-px p-4 rounded bg-white">
      <div className="flex gap-4 items-start shrink-0">
        <div className="shrink-0 size-6 text-[#cb1b1b]">
          <CircleAlert className="size-6" strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-1 items-start shrink-0 whitespace-nowrap">
          <p className="leading-[1.2] shrink-0 text-[18px] text-[#cb1b1b]">
            Low Stock Alert
          </p>
          <p className="leading-[1.3] shrink-0 text-[14px] text-[#42454d]">
            12 products are running low on stock
          </p>
        </div>
      </div>
      <button className="border border-[#686f7d] flex items-center justify-center p-2 rounded-sm shrink-0 w-full hover:bg-gray-50 transition-colors">
        <p className="font-normal leading-[1.2] shrink-0 text-[14px] text-black whitespace-nowrap">
          View Inventory
        </p>
      </button>
    </div>
  );
}
