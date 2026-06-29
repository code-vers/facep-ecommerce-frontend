'use client';

import React from 'react';
import { Store, TrendingUp } from 'lucide-react';

export default function StoreManagementStats() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Total Stores */}
      <div className="w-full bg-[#f2f2f3] border border-[#e5e5e6] rounded-[4px] p-5 flex flex-col gap-8 justify-between h-[140px]">
        <div className="w-[36px] h-[36px] bg-[#eadecd] rounded-[4px] flex items-center justify-center">
          <Store size={18} className="text-[#42454d]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[24px] font-semibold text-black leading-tight">4</h2>
          <span className="text-[13px] text-[#848995]">Total Stores</span>
        </div>
      </div>

      {/* Active Stores */}
      <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-5 flex flex-col gap-8 justify-between h-[140px]">
        <div className="w-[36px] h-[36px] bg-[#d8eadc] rounded-[4px] flex items-center justify-center">
          <Store size={18} className="text-[#229a4e]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[24px] font-semibold text-black leading-tight">3</h2>
          <span className="text-[13px] text-[#848995]">Active Stores</span>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-5 flex flex-col gap-8 justify-between h-[140px]">
        <div className="w-[36px] h-[36px] bg-[#eadecd] rounded-[4px] flex items-center justify-center">
          <TrendingUp size={18} className="text-[#42454d]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[24px] font-semibold text-black leading-tight">$ 300000</h2>
          <span className="text-[13px] text-[#848995]">Total Revenue</span>
        </div>
      </div>

    </div>
  );
}
