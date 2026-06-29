'use client';

import React from 'react';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  trendUp?: boolean;
  period: string;
  isPrimary?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  period,
  isPrimary = false,
}: StatCardProps) {
  return (
    <div
      className={`border border-[#e5e5e6] flex flex-[1_0_0] flex-col gap-6 h-full items-start min-w-px p-4 relative rounded ${
        isPrimary ? 'bg-[#f2f2f3]' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between shrink-0 w-full">
        <div className="bg-[#ede7de] flex items-center p-[10px] rounded-sm shrink-0">
          <Icon className="size-4 text-black" />
        </div>
        <div className="flex flex-col gap-[6px] items-end shrink-0">
          <div className="flex gap-2 items-center py-[2px] rounded shrink-0 cursor-pointer">
            <p className="font-normal leading-[1.3] shrink-0 text-xs text-[#848995] whitespace-nowrap">
              {period}
            </p>
            <ChevronDown className="size-3 text-[#848995]" />
          </div>
          <div
            className={`flex gap-1 items-center px-[10px] py-[2px] rounded-sm shrink-0 w-full ${
              trendUp ? 'bg-[#e0ebe4] text-[#229a4e]' : 'bg-[#fcece6] text-[#e34935]'
            }`}
          >
            {trendUp ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            <p className="font-normal leading-[1.3] shrink-0 text-xs whitespace-nowrap">
              {trend}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-start shrink-0 whitespace-nowrap">
        <p className="font-sans leading-[1.2] text-[24px] text-black">
          {value}
        </p>
        <p className="font-normal leading-[1.3] text-[14px] text-[#42454d]">
          {title}
        </p>
      </div>
    </div>
  );
}
