/**
 * @fileoverview Order Summary component of the Checkout page.
 * Displays items in the order, calculates subtotals, shipping, and total,
 * and provides action buttons.
 *
 * @module components/checkout/CheckoutOrderSummary
 */

import React from 'react';
import Link from 'next/link';
import { CheckoutItem } from '@/lib/checkout-data';

interface CheckoutOrderSummaryProps {
  items: CheckoutItem[];
  shippingFee: number;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

/**
 * Format helper for currency.
 */
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * CheckoutOrderSummary component.
 * Displays final pricing layout.
 */
export default function CheckoutOrderSummary({
  items,
  shippingFee,
  onPlaceOrder,
  isSubmitting,
}: CheckoutOrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingFee;

  return (
    <div className="w-full lg:w-[450px] border border-[#e5e5e6] rounded bg-[#f2f2f3] p-6 flex flex-col gap-8 shrink-0">
      {/* Title */}
      <h3 className="text-[22px] font-normal text-black text-left">
        Order Summary
      </h3>

      {/* Cart Items List */}
      <div className="divide-y divide-[#e5e5e6] border-b border-[#e5e5e6]">
        {items.map((item) => (
          <div key={item.id} className="py-4 flex gap-4 items-center">
            {/* Product Image */}
            <div className="w-[100px] h-[100px] bg-white border border-[#e5e5e6] rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageSrc}
                alt={item.title}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col gap-4 items-start text-left flex-1 min-w-0">
              <div className="w-full">
                <p className="text-[18px] text-black font-normal leading-snug break-words">
                  {item.title}{' '}
                  <span className="text-[12px] font-normal text-gray-500 whitespace-nowrap ml-1">
                    x {item.quantity}
                  </span>
                </p>
              </div>
              <p className="text-[22px] text-black font-normal">
                {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Calculation */}
      <div className="flex flex-col gap-3 text-[18px] text-black font-normal border-b border-[#e5e5e6] pb-4">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="font-bold">{formatPrice(shippingFee)}</span>
        </div>
      </div>

      {/* Total Order Cost */}
      <div className="flex justify-between items-end pb-2">
        <span className="text-[18px] text-black font-bold">Total</span>
        <span className="text-[22px] text-black font-bold">{formatPrice(total)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        {/* Place Order */}
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting}
          className="w-full bg-[#dec33a] border border-[#dec33a] hover:bg-[#c9b030] hover:border-[#c9b030] text-black text-[16px] font-semibold py-3.5 px-4 rounded transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>

        {/* Continue Shopping */}
        <Link
          href="/products"
          className="w-full border border-[#686f7d] hover:bg-[#686f7d]/5 text-black text-[16px] font-normal py-3.5 px-4 rounded transition-all text-center flex items-center justify-center cursor-pointer"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
