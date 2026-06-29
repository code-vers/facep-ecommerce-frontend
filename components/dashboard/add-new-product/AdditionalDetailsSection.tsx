'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export default function AdditionalDetailsSection() {
  return (
    <div className="flex flex-col gap-[24px] items-start w-full relative shrink-0">
      
      {/* Charges & Fees Row */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-[24px] w-full">
        <div className="flex flex-col gap-[8px] flex-1 w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Import Charges
          </p>
          <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
            <input
              type="text"
              placeholder="e.g. 10.00"
              className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-[8px] flex-1 w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Handling Fee
          </p>
          <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
            <input
              type="text"
              defaultValue="4%"
              className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
            />
          </div>
        </div>
      </div>

      {/* Deals Row */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-[24px] w-full">
        <div className="flex flex-col gap-[8px] flex-1 w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Deal Badge Text
          </p>
          <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
            <input
              type="text"
              placeholder="e.g. Black Friday Sale"
              className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-[8px] flex-1 w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Deal start Date
          </p>
          <div className="bg-white border border-[#e5e5e6] flex items-center justify-between overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
            <input
              type="date"
              className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
            />
            <Calendar className="size-4 text-[#848995] pointer-events-none absolute right-[12px]" />
          </div>
        </div>
        
        <div className="flex flex-col gap-[8px] flex-1 w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Deal End Date
          </p>
          <div className="bg-white border border-[#e5e5e6] flex items-center justify-between overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
            <input
              type="date"
              className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
            />
            <Calendar className="size-4 text-[#848995] pointer-events-none absolute right-[12px]" />
          </div>
        </div>
      </div>
      
    </div>
  );
}
