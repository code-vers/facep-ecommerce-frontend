'use client';

import React from 'react';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function ProfileRefundsPage() {
  return (
    <div className="border border-[#e5e5e6] rounded bg-white p-6 space-y-6 text-left">
      <div className="border-b border-[#e5e5e6] pb-3 flex items-center gap-2">
        <ArrowLeftRight className="w-5 h-5 text-black" />
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          Returns & Refunds
        </h2>
      </div>
      <div className="space-y-4">
        {/* Refund Item */}
        <div className="border border-gray-100 rounded-lg p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2 text-[14px]">
            <p className="text-gray-500">Return ID: <span className="font-semibold text-black">#RET-482937</span></p>
            <div className="flex items-center gap-1 text-[#22c55e] bg-green-50 border border-green-200 px-3 py-1 rounded-full text-[12px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Refund Processed</span>
            </div>
          </div>
          <div className="flex gap-4 items-center border-t border-b border-gray-50 py-3.5">
            <div className="relative w-16 h-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
              <Image src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=150" alt="Plant" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-[16px] text-black font-semibold">Plant (Glass Vase)</h4>
              <p className="text-[13px] text-gray-500">Refund Amount: $49.99</p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-semibold text-black">Returned June 10, 2026</p>
              <p className="text-[12px] text-gray-400">Via original card</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
