'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function ProductInventorySection() {
  return (
    <div className="flex flex-col gap-[24px] items-start w-full relative shrink-0">
      <h4 className="font-semibold leading-[1.2] text-[18px] md:text-[20px] text-black font-sans">
        Product Inventory
      </h4>
      
      <div className="flex flex-col gap-4 md:gap-[18px] w-full">
        {/* Row 1: ID, Stock Quantity, Stock Status */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
          <div className="flex flex-col gap-2 flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              ID
            </p>
            <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
              <input
                type="text"
                defaultValue="ORA-AIR-PRO2-YEL"
                className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Stock Quantity
            </p>
            <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
              <input
                type="text"
                defaultValue="500"
                className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Stock Status
            </p>
            <div className="border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative">
              <select
                className="w-full bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6"
                defaultValue="Available"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <ChevronDown className="size-4 text-black absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Low Stock Alert Quantity, Minimum Order Quantity, Maximum Order Quantity */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
          <div className="flex flex-col gap-2 flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Low Stock Alert Quantity
            </p>
            <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
              <input
                type="text"
                defaultValue="10"
                className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Minimum Order Quantity
            </p>
            <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
              <input
                type="text"
                defaultValue="1"
                className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 flex-1 w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Maximum Order Quantity
            </p>
            <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
              <input
                type="text"
                defaultValue="100"
                className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Inventory Managed By, Warehouse Location */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
          <div className="flex flex-col gap-2 flex-[0.66] w-full">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Inventory Managed By
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative">
                  <select
                    className="w-full bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6"
                    defaultValue="John Doe"
                  >
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                  </select>
                  <ChevronDown className="size-4 text-black absolute right-3 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Warehouse Location
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative">
                  <select
                    className="w-full bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6"
                    defaultValue="texas"
                  >
                    <option value="texas">Texas</option>
                    <option value="california">California</option>
                    <option value="new_york">New York</option>
                  </select>
                  <ChevronDown className="size-4 text-black absolute right-3 pointer-events-none" />
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
