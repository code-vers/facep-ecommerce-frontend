/**
 * @fileoverview PricingAndInventory component for Step 3 of the Add New Product flow.
 * Matches Figma Node 2179:15342 layout and styles.
 *
 * @module components/dashboard/add-new-product/PricingAndInventory
 */

'use client';

import React from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

export default function PricingAndInventory() {
  return (
    <div className="border border-[#e5e5e6] border-solid bg-white flex flex-col items-start w-full relative shrink-0">
      <div className="flex flex-col gap-6 md:gap-[24px] items-start p-4 md:p-[24px] w-full relative shrink-0">
        
        {/* ── SECTION 1: Pricing & Deals ── */}
        <div className="flex flex-col gap-[18px] items-start w-full">
          <h3 className="font-semibold leading-[1.2] text-[20px] text-black font-sans">
            Pricing & Deals
          </h3>
          
          <div className="flex flex-col gap-4 md:gap-[18px] w-full">
            {/* Base Price & Old Price */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Base Price
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    defaultValue="26.00"
                    placeholder="0.00"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Old Price
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    defaultValue="30.00"
                    placeholder="0.00"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>

            {/* Discount Type & Discount % */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Discount Type
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative">
                  <select
                    className="w-full bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6"
                    defaultValue=""
                  >
                    <option value="" disabled>Select discount type</option>
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount Discount</option>
                  </select>
                  <ChevronDown className="size-4 text-black absolute right-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Discount %
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    defaultValue="40%"
                    placeholder="0%"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>

            {/* Deal Badge Text */}
            <div className="flex flex-col gap-2 w-full">
              <p className="font-normal leading-[1.2] text-[16px] text-black">
                Deal Badge Text
              </p>
              <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                <input
                  type="text"
                  placeholder="Enter deal badge text (e.g. Black Friday Sale)"
                  className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                />
              </div>
            </div>

            {/* Deal Start & End Date */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Deal start Date
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center gap-2 px-3 py-2.5 rounded-sm w-full relative">
                  <Calendar size={16} className="text-[#848995] shrink-0" />
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Deal End Date
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center gap-2 px-3 py-2.5 rounded-sm w-full relative">
                  <Calendar size={16} className="text-[#848995] shrink-0" />
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Tax & Additional Charges ── */}
        <div className="flex flex-col gap-[18px] items-start w-full mt-4">
          <h3 className="font-semibold leading-[1.2] text-[20px] text-black font-sans">
            Tax & Additional Charges
          </h3>
          
          <div className="flex flex-col gap-4 md:gap-[18px] w-full">
            {/* Tax Included & VAT / GST */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Tax Included
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    defaultValue="26.00"
                    placeholder="0.00"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  VAT / GST (%)
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    defaultValue="30.00"
                    placeholder="0.00"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>

            {/* Import Charges & Handling Fee */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Import Charges
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="text"
                    placeholder="0.00"
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
                    placeholder="0%"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>

            {/* Deal Badge Text (Repeated inside Tax section as per Figma) */}
            <div className="flex flex-col gap-2 w-full">
              <p className="font-normal leading-[1.2] text-[16px] text-black">
                Deal Badge Text
              </p>
              <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                <input
                  type="text"
                  placeholder="Enter deal badge text"
                  className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                />
              </div>
            </div>

            {/* Deal Start & End Date (Repeated inside Tax section as per Figma) */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Deal start Date
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center gap-2 px-3 py-2.5 rounded-sm w-full relative">
                  <Calendar size={16} className="text-[#848995] shrink-0" />
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Deal End Date
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center gap-2 px-3 py-2.5 rounded-sm w-full relative">
                  <Calendar size={16} className="text-[#848995] shrink-0" />
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
