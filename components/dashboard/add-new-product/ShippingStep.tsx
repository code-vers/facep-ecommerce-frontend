/**
 * @fileoverview ShippingStep component for Step 4 of the Add New Product flow.
 * Matches Figma Node 2180:4207 layout and styles.
 *
 * @module components/dashboard/add-new-product/ShippingStep
 */

'use client';

import React, { useState } from 'react';

export default function ShippingStep() {
  const [feeType, setFeeType] = useState<'free' | 'standard'>('free');
  
  const [deliveryOptions, setDeliveryOptions] = useState({
    standard: false,
    cod: true,
    express: true,
    returnPickup: false,
  });

  const toggleOption = (key: keyof typeof deliveryOptions) => {
    setDeliveryOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="border border-[#e5e5e6] border-solid bg-white flex flex-col items-start w-full relative shrink-0">
      <div className="flex flex-col gap-6 md:gap-[24px] items-start p-4 md:p-[24px] w-full relative shrink-0">
        
        {/* ── SECTION: Shipping & Delivery ── */}
        <div className="flex flex-col gap-[18px] items-start w-full">
          <h3 className="font-semibold leading-[1.2] text-[20px] text-black font-sans">
            Shipping & Delivery
          </h3>
          
          <div className="flex flex-col gap-4 md:gap-[18px] w-full">
            
            {/* Ships From */}
            <div className="flex flex-col gap-2 w-full">
              <p className="font-normal leading-[1.2] text-[16px] text-black">
                Ships From
              </p>
              <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                <input
                  type="text"
                  defaultValue="26.00"
                  placeholder="Enter departure zip code or city"
                  className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                />
              </div>
            </div>

            {/* Min & Max Delivery Days */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Minimum Delivery Days
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="number"
                    defaultValue={2}
                    placeholder="Min days"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full">
                <p className="font-normal leading-[1.2] text-[16px] text-black">
                  Maximum Delivery Days
                </p>
                <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                  <input
                    type="number"
                    defaultValue={4}
                    placeholder="Max days"
                    className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Fee Type (Radio option group) */}
            <div className="flex flex-col gap-3 w-full">
              <p className="font-normal leading-[1.2] text-[16px] text-[#101828]">
                Shipping Fee Type
              </p>
              <div className="flex items-center gap-6">
                
                {/* Free option */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="shippingFeeType"
                    checked={feeType === 'free'}
                    onChange={() => setFeeType('free')}
                    className="sr-only"
                  />
                  <div className={`size-[18px] rounded-full border flex items-center justify-center transition-all ${
                    feeType === 'free' ? 'border-[#f09000]' : 'border-black'
                  }`}>
                    {feeType === 'free' && (
                      <div className="size-2 rounded-full bg-[#f09000]" />
                    )}
                  </div>
                  <span className="text-[14px] font-normal leading-[1.3] text-[#344054]">
                    Free
                  </span>
                </label>

                {/* Standard option */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="shippingFeeType"
                    checked={feeType === 'standard'}
                    onChange={() => setFeeType('standard')}
                    className="sr-only"
                  />
                  <div className={`size-[18px] rounded-full border flex items-center justify-center transition-all ${
                    feeType === 'standard' ? 'border-[#f09000]' : 'border-black'
                  }`}>
                    {feeType === 'standard' && (
                      <div className="size-2 rounded-full bg-[#f09000]" />
                    )}
                  </div>
                  <span className="text-[14px] font-normal leading-[1.3] text-[#344054]">
                    Standard
                  </span>
                </label>
              </div>
            </div>

            {/* Shipping Cost */}
            <div className="flex flex-col gap-2 w-full">
              <p className="font-normal leading-[1.2] text-[16px] text-black">
                Shipping Cost
              </p>
              <div className="border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full">
                <input
                  type="text"
                  placeholder="0.00"
                  disabled={feeType === 'free'}
                  className="w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Delivery Options Checkbox Group */}
            <div className="flex flex-col gap-3 w-full">
              <p className="font-normal leading-[1.2] text-[16px] text-[#101828]">
                Delivery Options
              </p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-1">
                
                {/* Standard Delivery */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deliveryOptions.standard}
                    onChange={() => toggleOption('standard')}
                    className="sr-only"
                  />
                  <div className={`size-4 rounded-[4px] border flex items-center justify-center transition-all ${
                    deliveryOptions.standard ? 'bg-[#f09000] border-[#f09000] text-white' : 'border-black bg-white'
                  }`}>
                    {deliveryOptions.standard && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span className="text-[14px] font-normal leading-[1.3] text-[#344054]">
                    Standard Delivery
                  </span>
                </label>

                {/* Cash On Delivery */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deliveryOptions.cod}
                    onChange={() => toggleOption('cod')}
                    className="sr-only"
                  />
                  <div className={`size-4 rounded-[4px] border flex items-center justify-center transition-all ${
                    deliveryOptions.cod ? 'bg-[#f09000] border-[#f09000] text-white' : 'border-black bg-white'
                  }`}>
                    {deliveryOptions.cod && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span className="text-[14px] font-normal leading-[1.3] text-[#344054]">
                    Cash On Delivery
                  </span>
                </label>

                {/* Express Delivery */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deliveryOptions.express}
                    onChange={() => toggleOption('express')}
                    className="sr-only"
                  />
                  <div className={`size-4 rounded-[4px] border flex items-center justify-center transition-all ${
                    deliveryOptions.express ? 'bg-[#f09000] border-[#f09000] text-white' : 'border-black bg-white'
                  }`}>
                    {deliveryOptions.express && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span className="text-[14px] font-normal leading-[1.3] text-[#344054]">
                    Express Delivery
                  </span>
                </label>

                {/* Return Pickup Available */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deliveryOptions.returnPickup}
                    onChange={() => toggleOption('returnPickup')}
                    className="sr-only"
                  />
                  <div className={`size-4 rounded-[4px] border flex items-center justify-center transition-all ${
                    deliveryOptions.returnPickup ? 'bg-[#f09000] border-[#f09000] text-white' : 'border-black bg-white'
                  }`}>
                    {deliveryOptions.returnPickup && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span className="text-[14px] font-normal leading-[1.3] text-[#344054]">
                    Return Pickup Available
                  </span>
                </label>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
