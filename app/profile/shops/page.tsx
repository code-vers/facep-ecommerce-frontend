'use client';

import React from 'react';
import { Heart } from 'lucide-react';

export default function ProfileShopsPage() {
  return (
    <div className="border border-[#e5e5e6] rounded bg-white p-6 space-y-6 text-left">
      <div className="border-b border-[#e5e5e6] pb-3 flex items-center gap-2">
        <Heart className="w-5 h-5 text-black" />
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          Favourite Shops
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shop 1 */}
        <div className="border border-gray-150 rounded-lg p-5 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-black text-white font-bold flex items-center justify-center text-[18px]">
              E
            </div>
            <div>
              <h4 className="text-[16px] text-black font-semibold">ElectroLand</h4>
              <p className="text-[13px] text-gray-500">Computers & Tech Gadgets</p>
              <p className="text-[12px] text-[#dec33a] font-medium">★ 4.9 (1.2k reviews)</p>
            </div>
          </div>
          <button type="button" className="border border-[#686f7d] px-3.5 py-1.5 rounded text-[13px] font-semibold text-black hover:bg-gray-50 cursor-pointer">
            Visit Shop
          </button>
        </div>

        {/* Shop 2 */}
        <div className="border border-gray-150 rounded-lg p-5 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-[#4a8] text-white font-bold flex items-center justify-center text-[18px]">
              G
            </div>
            <div>
              <h4 className="text-[16px] text-black font-semibold">GreenHouse</h4>
              <p className="text-[13px] text-gray-500">Home Flowers & Plants</p>
              <p className="text-[12px] text-[#dec33a] font-medium">★ 4.8 (850 reviews)</p>
            </div>
          </div>
          <button type="button" className="border border-[#686f7d] px-3.5 py-1.5 rounded text-[13px] font-semibold text-black hover:bg-gray-50 cursor-pointer">
            Visit Shop
          </button>
        </div>
      </div>
    </div>
  );
}
