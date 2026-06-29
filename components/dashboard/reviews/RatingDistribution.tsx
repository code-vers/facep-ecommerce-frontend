'use client';

import React from 'react';
import { Star } from 'lucide-react';

export default function RatingDistribution() {
  const ratings = [
    { label: '5 star', count: 874, percent: 20 },
    { label: '4 star', count: 874, percent: 10 },
    { label: '3 star', count: 874, percent: 20 },
    { label: '2 star', count: 874, percent: 30 },
    { label: '1 star', count: 874, percent: 12 },
  ];

  return (
    <div className="flex-1 bg-white border border-[#e5e5e6] rounded-[4px] p-[24px] flex flex-col gap-[24px]">
      
      {/* Header */}
      <div className="flex flex-col gap-[12px]">
        <h3 className="font-semibold text-[20px] text-black">Average Rating Distribution</h3>
        <div className="flex items-center gap-[4px]">
          {/* 5 Stars */}
          <div className="flex gap-[2px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="size-10 rounded-sm bg-transparent flex items-center justify-center">
                <Star className="size-[28px] text-[#f09000] fill-[#f09000]" strokeWidth={1} />
              </div>
            ))}
          </div>
          <p className="text-[18px] text-black ml-2">4.1 out of 5</p>
        </div>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-[16px] w-full">
        {ratings.map((item, idx) => (
          <div key={idx} className="flex items-center gap-[24px] w-full">
            <span className="w-[60px] text-[18px] text-black shrink-0">{item.label}</span>
            <div className="flex-1 h-[8px] bg-[#ede7de] rounded-[2px] relative overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 left-0 bg-[#f09000] rounded-[2px]" 
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className="w-[40px] text-[18px] text-[#848995] shrink-0 text-right">{item.count}</span>
            <span className="w-[40px] text-[18px] text-black shrink-0 text-right">{item.percent}%</span>
          </div>
        ))}
      </div>

    </div>
  );
}
