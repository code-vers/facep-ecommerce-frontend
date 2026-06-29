'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export default function AdditionalDetailsSection() {
  return (
    <div className="flex flex-col gap-[24px] items-start w-full relative shrink-0">
      
      {/* Charges & Fees Row */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        <div className="flex flex-col gap-2 flex-1 w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Import Charges
          </p>
          <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
            <input
              type="text"
              placeholder="e.g. 10.00"
              className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-1 w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Handling Fee
          </p>
          <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
            <input
              type="text"
              defaultValue="4%"
              className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
            />
          </div>
        </div>
      </div>

      {/* Deals Row */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        <div className="flex flex-col gap-2 flex-1 w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Deal Badge Text
          </p>
          <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
            <input
              type="text"
              placeholder="e.g. Black Friday Sale"
              className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-[0.5] w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Deal start Date
          </p>
          <div className="border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative">
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
            />
            <Calendar className="size-4 text-[#848995] absolute right-3 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-[0.5] w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Deal End Date
          </p>
          <div className="border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative">
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
            />
            <Calendar className="size-4 text-[#848995] absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

    </div>
  );
}
