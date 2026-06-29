'use client';

import React from 'react';
import { ChevronDown, X } from 'lucide-react';

interface ProductBasicsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ProductBasics({ onNext, onBack }: ProductBasicsProps) {
  return (
    <div className="border border-[#e5e5e6] border-solid flex flex-col items-start w-full relative shrink-0">
      {/* Form Content */}
      <div className="flex flex-col gap-4 md:gap-[24px] items-start p-4 md:p-[24px] w-full relative shrink-0">
        {/* Basic Product Information */}
        <div className="flex flex-col gap-[18px] items-start w-full">
          <p className="font-semibold leading-[1.2] text-[20px] text-black">
            Basic Product Information
          </p>
          
          <div className="flex flex-col gap-4 md:gap-[18px] w-full">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              {/* Store / Brand */}
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Store / Brand
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative">
                  <input
                    type="text"
                    placeholder="Plant House"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] pr-6"
                  />
                  <ChevronDown className="size-4 text-black absolute right-3 pointer-events-none" />
                </div>
              </div>
              
              {/* Product Type */}
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Product Type
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    placeholder="Plant"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>

            {/* Short Product Summary */}
            <div className="flex flex-col gap-2 w-full">
              <p className="font-normal leading-[1.2] text-[16px] text-black">
                Short Product Summary
              </p>
              <div className="border border-[#e5e5e6] bg-white flex items-start h-[84px] px-3 py-2.5 rounded-sm w-full">
                <textarea
                  placeholder="Brief product description"
                  className="w-full h-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category & Filter Information */}
        <div className="flex flex-col gap-[18px] items-start w-full mt-2">
          <p className="font-semibold leading-[1.2] text-[20px] text-black">
            Category & Filter Information
          </p>
          
          <div className="flex flex-col gap-4 md:gap-[18px] w-full">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              {/* Main Category */}
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Main Category
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    placeholder="Plant"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
              
              {/* Subcategory */}
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Subcategory
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    placeholder="Cactus"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>

            {/* Product Tags */}
            <div className="flex flex-col gap-2 w-full">
              <p className="font-normal leading-[1.2] text-[16px] text-black">
                Product Tags
              </p>
              <div className="flex items-center gap-2 flex-wrap w-full">
                {['Cactus', 'Cactus', 'Cactus', 'Cactus', 'Cactus'].map((tag, i) => (
                  <div key={i} className="flex items-center gap-1 bg-[#f2f2f3] border border-[#e5e5e6] px-2 py-1 rounded-sm">
                    <span className="text-[12px] text-[#42454d] font-normal">{tag}</span>
                    <X className="size-3 text-[#686f7d] cursor-pointer" />
                  </div>
                ))}
                <button className="text-[14px] text-[#165dd0] font-normal hover:underline ml-1">
                  Add Tag +
                </button>
              </div>
            </div>

            {/* Condition */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <p className="font-normal leading-[1.2] text-[16px] text-black">
                Condition
              </p>
              <div className="flex items-center gap-6 w-full">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="condition" className="w-4 h-4 border-gray-300 focus:ring-[#f09000] text-[#f09000]" defaultChecked />
                  <span className="text-[14px] text-[#42454d]">New</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="condition" className="w-4 h-4 border-gray-300 focus:ring-[#f09000] text-[#f09000]" />
                  <span className="text-[14px] text-[#42454d]">Renewed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="condition" className="w-4 h-4 border-gray-300 focus:ring-[#f09000] text-[#f09000]" />
                  <span className="text-[14px] text-[#42454d]">Used</span>
                </label>
              </div>
            </div>

            {/* Available Color Filters */}
            <div className="flex flex-col gap-2 w-full mt-2">
              <p className="font-normal leading-[1.2] text-[16px] text-black">
                Available Color Filters
              </p>
              <div className="flex items-center gap-2 flex-wrap w-full">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#f2f2f3] border border-[#e5e5e6] px-2 py-1 rounded-sm">
                    <span className="text-[12px] text-[#42454d] font-normal">Green</span>
                    <div className="w-2.5 h-2.5 bg-[#229a4e] rounded-sm" />
                  </div>
                ))}
                <button className="text-[14px] text-[#165dd0] font-normal hover:underline ml-1">
                  Add Color +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
