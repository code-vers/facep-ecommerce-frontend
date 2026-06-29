/**
 * @fileoverview Step 4 – Review & Submit.
 * Shows a summary of the return request for user confirmation before
 * submitting. Exactly matches the Figma design for node 2149-3977.
 *
 * @module components/profile/refunds/RefundReviewSubmit
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReturnableItem } from './RefundSelectProducts';
import { ReturnReasonData } from './RefundReasonForm';
import { PickupMethodData } from './RefundPickupMethod';

interface RefundReviewSubmitProps {
  selectedItems: ReturnableItem[];
  reasonData: ReturnReasonData;
  pickupData: PickupMethodData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-4 h-4',
            star <= Math.round(rating)
              ? 'fill-[#dec33a] text-[#dec33a]'
              : 'fill-[#e5e5e6] text-[#e5e5e6]'
          )}
        />
      ))}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 items-start text-[18px] font-normal leading-[1.2]">
      <span className="text-[#848995] shrink-0">{label}</span>
      <span className="text-black">{value}</span>
    </div>
  );
}

/**
 * Step 4: Review & Submit return request.
 */
export default function RefundReviewSubmit({
  selectedItems,
  reasonData,
  pickupData,
  onBack,
  onSubmit,
  isSubmitted,
}: RefundReviewSubmitProps) {
  // Map stored shipping value back to display label
  const shippingLabel: Record<string, string> = {
    standard: 'Standard Shipping - $40',
    express: 'Express Shipping - $75',
    'in-store': 'Drop off at store - Free',
  };
  const refundLabel: Record<string, string> = {
    replacement: 'I would like a replacement product',
    'store-credit': 'Store credit (wallet)',
    'original-payment': 'Refund to original payment method',
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <CheckCircle2 className="w-16 h-16 text-[#dec33a]" />
        <h2 className="text-[28px] font-normal text-black leading-[1.2]">
          Return Request Submitted!
        </h2>
        <p className="text-[16px] text-[#848995] max-w-md leading-[1.5]">
          Your return request has been received. We will review it and get back
          to you within 2–3 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-9 w-full">
      <h2 className="text-[22px] font-normal text-[#232a39] leading-[1.2]">
        Review your return request
      </h2>

      <div className="flex flex-col gap-9 w-full">
        {/* Product cards */}
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="border border-[#e5e5e6] rounded-[2px] p-6 flex flex-col gap-9 w-full"
          >
            {/* Product summary row */}
            <div className="flex items-center gap-4 w-full">
              {/* Image */}
              <div className="relative w-[100px] h-[100px] rounded-[2px] shrink-0 overflow-hidden bg-gray-100">
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                {/* Name, date & rating */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-6 flex-wrap">
                      <span className="text-[18px] font-normal text-black leading-[1.2]">
                        {item.name}
                      </span>
                      <span className="text-[12px] text-[#848995] leading-[1.3]">
                        Order Received - {item.orderDate}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#848995] leading-[1.3]">
                      {item.seller}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StarRating rating={item.rating} />
                    <span className="text-[12px] text-black leading-[1.3]">
                      {item.rating} ({item.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <span className="text-[22px] font-normal text-black leading-[1.2]">
                  {item.price}
                </span>
              </div>
            </div>

            {/* Review detail rows */}
            <div className="flex flex-col gap-3 w-full">
              <ReviewRow
                label="Current state of the product:"
                value={reasonData.productState}
              />
              <ReviewRow
                label="Main reason for returning the product:"
                value={reasonData.returnReason}
              />
              <ReviewRow
                label="Method for returning the product:"
                value={shippingLabel[pickupData.returnShipping] || pickupData.returnShipping}
              />
              <ReviewRow
                label="Method for receiving the product:"
                value={refundLabel[pickupData.refundMethod] || pickupData.refundMethod}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center p-3 rounded-[2px] border border-[#686f7d] text-[#686f7d] hover:bg-gray-50 transition-all cursor-pointer min-w-[48px]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="px-4 py-3 rounded-[2px] bg-[#dec33a] border border-[#dec33a] text-black text-[16px] font-normal leading-[1.2] hover:bg-[#c9b034] transition-all cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
