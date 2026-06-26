/**
 * @fileoverview User Details section of the Checkout form.
 * Renders name, email, contact, and primary address input fields.
 *
 * @module components/checkout/CheckoutUserDetails
 */

import React from 'react';

interface CheckoutUserDetailsProps {
  formData: {
    fullName: string;
    email: string;
    contactNumber: string;
    address: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

/**
 * CheckoutUserDetails component.
 * Grid input fields for user identity.
 */
export default function CheckoutUserDetails({
  formData,
  onChange,
  errors,
}: CheckoutUserDetailsProps) {
  return (
    <div className="w-full border border-[#e5e5e6] rounded bg-white p-6 space-y-6">
      {/* Title Header */}
      <div className="border-b border-[#e5e5e6] pb-3">
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          User Details
        </h2>
      </div>

      {/* Grid container for inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Full Name */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="fullName" className="text-[16px] text-black font-normal">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="e.g. Alexander von Berg"
            className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
          />
          {errors.fullName && (
            <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="email" className="text-[16px] text-black font-normal">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="alexander@domain.com"
            className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
          />
          {errors.email && (
            <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.email}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="contactNumber" className="text-[16px] text-black font-normal">
            Contact Number
          </label>
          <input
            id="contactNumber"
            type="tel"
            required
            value={formData.contactNumber}
            onChange={(e) => onChange('contactNumber', e.target.value)}
            placeholder="+41 00 000 00 00"
            className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
          />
          {errors.contactNumber && (
            <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.contactNumber}</p>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="address" className="text-[16px] text-black font-normal">
            Address
          </label>
          <input
            id="address"
            type="text"
            required
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="123 Edelweiss Strasse, Zurich"
            className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
          />
          {errors.address && (
            <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  );
}
