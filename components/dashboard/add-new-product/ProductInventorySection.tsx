'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function ProductInventorySection() {
  return (
    <div className="flex flex-col gap-[18px] items-start w-full relative shrink-0">
      <h4 className="font-semibold leading-[1.2] text-[20px] text-black font-sans">
        Product Inventory
      </h4>
      
      <div className="flex flex-col gap-[24px] w-full">
        {/* Row 1: ID, Stock Quantity, Stock Status */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-[24px] w-full">
          <div className="flex flex-col gap-[8px] flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              ID
            </p>
            <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
              <input
                type="text"
                defaultValue="ORA-AIR-PRO2-YEL"
                className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-[8px] flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Stock Quantity
            </p>
            <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
              <input
                type="number"
                defaultValue="500"
                className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-[8px] flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Stock Status
            </p>
            <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
              <select
                className="flex-1 bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6 w-full"
                defaultValue="Available"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <ChevronDown className="size-4 text-[#848995] absolute right-[12px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Low Stock Alert Quantity, Minimum Order Quantity, Maximum Order Quantity */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-[24px] w-full">
          <div className="flex flex-col gap-[8px] flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Low Stock Alert Quantity
            </p>
            <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
              <input
                type="number"
                defaultValue="10"
                className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-[8px] flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Minimum Order Quantity
            </p>
            <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
              <input
                type="number"
                defaultValue="1"
                className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-[8px] flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Maximum Order Quantity
            </p>
            <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
              <input
                type="number"
                defaultValue="100"
                className="flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Inventory Managed By, Warehouse Location */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-[24px] w-full">
          <div className="flex flex-col gap-[24px] flex-[0.66] w-full">
            <div className="flex flex-col md:flex-row gap-4 md:gap-[24px] w-full">
              <div className="flex flex-col gap-[8px] flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Inventory Managed By
                </p>
                <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
                  <select
                    className="flex-1 bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6 w-full"
                    defaultValue="John Doe"
                  >
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                  </select>
                  <ChevronDown className="size-4 text-[#848995] absolute right-[12px] pointer-events-none" />
                </div>
              </div>
              
              <div className="flex flex-col gap-[8px] flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Warehouse Location
                </p>
                <div className="bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
                  <select
                    className="flex-1 bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6 w-full"
                    defaultValue="texas"
                  >
                    <option value="texas">Texas</option>
                    <option value="california">California</option>
                    <option value="new_york">New York</option>
                  </select>
                  <ChevronDown className="size-4 text-[#848995] absolute right-[12px] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-[0.33]"></div>
        </div>

      </div>
    </div>
  );
}
