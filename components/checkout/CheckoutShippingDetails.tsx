/**
 * @fileoverview Shipping Details section of the Checkout form.
 * Renders shipping destination location fields and special instructions textarea.
 *
 * @module components/checkout/CheckoutShippingDetails
 */

import React from 'react';

interface CheckoutShippingDetailsProps {
  formData: {
    country: string;
    city: string;
    location: string;
    note: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

/**
 * CheckoutShippingDetails component.
 * Grid input fields for shipping destination and order notes.
 */
export default function CheckoutShippingDetails({
  formData,
  onChange,
  errors,
}: CheckoutShippingDetailsProps) {
  return (
    <div className="w-full border border-[#e5e5e6] rounded bg-white p-6 space-y-6">
      {/* Title Header */}
      <div className="border-b border-[#e5e5e6] pb-3">
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          Shipping Details
        </h2>
      </div>

      {/* Inputs container */}
      <div className="space-y-6 w-full">
        {/* Country & City row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Country */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="country" className="text-[16px] text-black font-normal">
              Country
            </label>
            <input
              id="country"
              type="text"
              required
              value={formData.country}
              onChange={(e) => onChange('country', e.target.value)}
              placeholder="e.g. Canada"
              className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
            />
            {errors.country && (
              <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.country}</p>
            )}
          </div>

          {/* City */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="city" className="text-[16px] text-black font-normal">
              City
            </label>
            <input
              id="city"
              type="text"
              required
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="e.g. Toronto"
              className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
            />
            {errors.city && (
              <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Location (State/Zip/Region) */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="location" className="text-[16px] text-black font-normal">
            Location
          </label>
          <input
            id="location"
            type="text"
            required
            value={formData.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="e.g. Ontario"
            className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
          />
          {errors.location && (
            <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.location}</p>
          )}
        </div>

        {/* Note */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="note" className="text-[16px] text-black font-normal">
            Note
          </label>
          <textarea
            id="note"
            rows={4}
            value={formData.note}
            onChange={(e) => onChange('note', e.target.value)}
            placeholder="Any special instructions"
            className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
