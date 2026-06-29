'use client';

import React from 'react';
import { CirclePlus, Wrench } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col h-auto 2xl:h-[154px] items-start min-w-px p-4 rounded bg-white">
      <div className="flex flex-col gap-4 items-start shrink-0 w-full">
        <p className="font-semibold leading-[1.2] shrink-0 text-[20px] text-black w-full">
          Quick Actions
        </p>
        <button className="bg-[#f09000] border border-[#f09000] flex gap-1 items-center justify-center p-2 rounded-sm shrink-0 w-full hover:bg-[#d98200] transition-colors">
          <p className="font-normal leading-[1.2] shrink-0 text-[14px] text-black whitespace-nowrap">
            Add Product
          </p>
          <CirclePlus className="size-4 text-black" />
        </button>
        <button className="bg-[#e3cfb0] border border-[#f09000] flex gap-1 items-center justify-center p-2 rounded-sm shrink-0 w-full hover:bg-[#d6c19f] transition-colors">
          <p className="font-normal leading-[1.2] shrink-0 text-[14px] text-black whitespace-nowrap">
            Edit Store Profile
          </p>
          <Wrench className="size-4 text-black" />
        </button>
      </div>
    </div>
  );
}
