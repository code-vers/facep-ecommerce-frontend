'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfileOrdersPage() {
  return (
    <div className="border border-[#e5e5e6] rounded bg-white p-6 space-y-6 text-left">
      <div className="border-b border-[#e5e5e6] pb-3 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-black" />
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          My Orders
        </h2>
      </div>
      <div className="space-y-4">
        {/* Order Card 1 */}
        <div className="border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-all flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2 text-[14px]">
            <p className="text-gray-500">Order ID: <span className="font-semibold text-black">#FCP-748923</span></p>
            <span className="bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1 rounded-full text-[12px] font-semibold">
              On the way
            </span>
          </div>
          <div className="flex gap-4 items-center border-t border-b border-gray-50 py-3.5">
            <div className="relative w-16 h-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
              <Image src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=150" alt="S25 Ultra" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-[16px] text-black font-semibold">Samsung Galaxy S25 Ultra</h4>
              <p className="text-[13px] text-gray-500">Quantity: 1 • Color: Titanium Gray</p>
            </div>
            <p className="text-[18px] text-black font-bold">$1,649.99</p>
          </div>
          <div className="flex justify-between items-center text-[14px] flex-wrap gap-2">
            <span className="text-gray-400">Placed on June 26, 2026</span>
            <Link href="/orders" className="text-[#165dd0] hover:underline font-medium">Track Order</Link>
          </div>
        </div>

        {/* Order Card 2 */}
        <div className="border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-all flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2 text-[14px]">
            <p className="text-gray-500">Order ID: <span className="font-semibold text-black">#FCP-528347</span></p>
            <span className="bg-green-50 border border-green-200 text-green-600 px-3 py-1 rounded-full text-[12px] font-semibold">
              Delivered
            </span>
          </div>
          <div className="flex gap-4 items-center border-t border-b border-gray-50 py-3.5">
            <div className="relative w-16 h-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
              <Image src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=150" alt="Plant" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-[16px] text-black font-semibold">Plant (White Vase)</h4>
              <p className="text-[13px] text-gray-500">Quantity: 2 • Size: Medium</p>
            </div>
            <p className="text-[18px] text-black font-bold">$59.98</p>
          </div>
          <div className="flex justify-between items-center text-[14px] flex-wrap gap-2">
            <span className="text-gray-400">Placed on June 15, 2026</span>
            <button type="button" className="text-[#dec33a] hover:underline font-medium cursor-pointer">Write a Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}
