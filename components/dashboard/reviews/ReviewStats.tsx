'use client';

import React from 'react';
import { Star, MessageSquareShare, Flag } from 'lucide-react';

export default function ReviewStats() {
  return (
    <div className="w-full flex flex-col md:flex-row gap-[24px]">
      
      {/* Average Rating */}
      <div className="flex-1 bg-[#f2f2f3] border border-[#e5e5e6] rounded-[4px] p-[16px] flex flex-col justify-between min-h-[153px]">
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#ede7de] p-[10px] rounded-[2px] flex items-center justify-center">
            <Star className="size-4 text-black" />
          </div>
        </div>
        <div className="flex flex-col gap-[4px]">
          <p className="text-[24px] text-black leading-[1.2]">4.1</p>
          <p className="text-[14px] text-[#42454d] font-normal">Average Rating</p>
        </div>
      </div>

      {/* Total Reviews */}
      <div className="flex-1 bg-white border border-[#e5e5e6] rounded-[4px] p-[16px] flex flex-col justify-between min-h-[153px]">
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#ede7de] p-[10px] rounded-[2px] flex items-center justify-center">
            <Flag className="size-4 text-black" />
          </div>
        </div>
        <div className="flex flex-col gap-[4px]">
          <p className="text-[24px] text-black leading-[1.2]">3000</p>
          <p className="text-[14px] text-[#42454d] font-normal">Total Reviews</p>
        </div>
      </div>

      {/* Positive */}
      <div className="flex-1 bg-white border border-[#e5e5e6] rounded-[4px] p-[16px] flex flex-col justify-between min-h-[153px]">
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#e0ebe4] p-[10px] rounded-[2px] flex items-center justify-center">
            <Flag className="size-4 text-[#229a4e]" />
          </div>
        </div>
        <div className="flex flex-col gap-[4px]">
          <p className="text-[24px] text-black leading-[1.2]">1500</p>
          <p className="text-[14px] text-[#42454d] font-normal">Positive</p>
        </div>
      </div>

    </div>
  );
}
