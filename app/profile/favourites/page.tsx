'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';

// Generate 10 mock shops to match the 2-row, 5-column grid in Figma
const MOCK_FAVOURITES = Array.from({ length: 10 }).map((_, i) => ({
  id: `shop-${i + 1}`,
  name: 'TC Telecom',
  imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=300'
}));

export default function ProfileFavouritesPage() {
  return (
    <div className="flex flex-col gap-[36px] items-center w-full relative text-left">
      {/* Grid container: 5 columns with 24px horizontal gap and 36px vertical gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[24px] gap-y-[36px] w-full">
        {MOCK_FAVOURITES.map((shop) => (
          <div 
            key={shop.id}
            className="bg-white border border-[#e5e5e6] flex flex-col items-start w-full relative rounded-[4px] overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* Image Header */}
            <div className="h-[180px] w-full relative overflow-hidden bg-gray-50">
              <Image 
                src={shop.imageUrl} 
                alt={shop.name} 
                fill 
                className="object-cover"
              />
              
              {/* Heart Button */}
              <button 
                type="button"
                className="absolute bg-[#dec33a] bottom-[10px] right-[8px] flex items-center justify-center p-[12px] rounded-full w-[30px] h-[30px] hover:bg-[#c9b030] transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-black shrink-0" fill="currentColor" />
              </button>
            </div>
            
            {/* Shop Details */}
            <div className="flex flex-col items-start px-[8px] py-[12px] w-full">
              <p className="font-['Open_Sans'] font-normal text-[14px] text-[#165dd0] leading-[1.3] w-full truncate">
                {shop.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-[4px] items-center justify-center w-full">
        <button type="button" disabled className="flex gap-[4px] items-center justify-center min-w-[80px] px-[12px] py-[8px] rounded-[6px] opacity-50 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4 text-black" />
          <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">Previous</span>
        </button>
        
        <button type="button" className="bg-[#cacace] border border-[#cacbce] flex items-center justify-center w-[40px] h-[40px] rounded-[2px] cursor-pointer">
          <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">1</span>
        </button>
        
        <button type="button" className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] hover:bg-gray-100 cursor-pointer transition-colors">
          <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">2</span>
        </button>
        
        <button type="button" className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] hover:bg-gray-100 cursor-pointer transition-colors">
          <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">3</span>
        </button>
        
        <button type="button" className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] hover:bg-gray-100 cursor-pointer transition-colors">
          <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">4</span>
        </button>

        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px]">
          <Ellipsis className="w-4 h-4 text-black" />
        </div>

        <button type="button" className="flex gap-[4px] items-center justify-center min-w-[80px] px-[12px] py-[8px] rounded-[6px] hover:bg-gray-100 cursor-pointer transition-colors">
          <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">Next</span>
          <ChevronRight className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
}
