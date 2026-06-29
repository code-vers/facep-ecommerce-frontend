/**
 * @fileoverview Step 2 – Reason for Return.
 * Allows users to select the current state of the product and the reason
 * for returning it. Matches Figma design node 2142-4400.
 *
 * @module components/profile/refunds/RefundReasonForm
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReturnableItem } from './RefundSelectProducts';

const RETURN_REASONS = [
  'The product quality is unsatisfactory.',
  'The customer service experience was disappointing.',
  'The delivery time exceeded expectations.',
  'The pricing is competitive and reasonable.',
  'The user interface is intuitive and easy to navigate.',
  'The product features are innovative and useful.',
  'Something else',
] as const;

const PRODUCT_STATES = [
  'sealed product.',
  'damaged product.',
  'broken product.',
  'opened product.',
  'expired product.',
  'defective product.',
  'Something else',
] as const;

export interface ReturnReasonData {
  productState: string;
  returnReason: string;
}

interface RefundReasonFormProps {
  selectedItems: ReturnableItem[];
  onNext: (data: ReturnReasonData) => void;
  onBack: () => void;
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

/**
 * Step 2: Reason for return form (new layout).
 */
export default function RefundReasonForm({ selectedItems, onNext, onBack }: RefundReasonFormProps) {
  const [productState, setProductState] = useState('');
  const [returnReason, setReturnReason] = useState('');

  const isValid = productState && returnReason;

  return (
    <div className="flex flex-col gap-[36px] w-full">
      <h2 className="text-[22px] font-normal text-[#232a39] leading-[1.2]">
        Select the reason for your return
      </h2>

      <div className="flex flex-col gap-[36px] w-full">
        {/* Selected Product(s) */}
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="border border-[#e5e5e6] rounded-[2px] p-6 flex items-center gap-4 w-full"
          >
            <div className="relative w-[100px] h-[100px] rounded-[2px] shrink-0 overflow-hidden bg-gray-100">
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col gap-4">
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

                <div className="flex items-center gap-1.5 shrink-0">
                  <StarRating rating={item.rating} />
                  <span className="text-[12px] text-black leading-[1.3]">
                    {item.rating} ({item.reviewCount})
                  </span>
                </div>
              </div>
              <span className="text-[22px] font-normal text-black leading-[1.2]">
                {item.price}
              </span>
            </div>
          </div>
        ))}

        {/* Radio Columns */}
        <div className="flex gap-[160px] items-start w-full">
          {/* Primary Reason */}
          <div className="flex flex-col gap-6">
            <p className="text-[18px] font-normal text-[#101828] leading-[1.2]">
              What is the primary reason for returning the product?
            </p>
            <div className="flex flex-col gap-4">
              {RETURN_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-[12px] cursor-pointer group"
                >
                  <div className="relative shrink-0 w-[18px] h-[18px]">
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full border-[1.125px] border-black transition-colors',
                      )}
                    />
                    {returnReason === reason && (
                      <div className="absolute left-[3.38px] top-[3.38px] w-[11.25px] h-[11.25px]">
                        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="6" cy="6" r="5.625" fill="black" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="returnReason"
                    value={reason}
                    checked={returnReason === reason}
                    onChange={() => setReturnReason(reason)}
                    className="sr-only"
                  />
                  <span className="text-[18px] font-normal text-[#344054] leading-[1.2]">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Current Condition */}
          <div className="flex flex-col gap-6">
            <p className="text-[18px] font-normal text-[#101828] leading-[1.2]">
              What is the product's current condition?
            </p>
            <div className="flex flex-col gap-4">
              {PRODUCT_STATES.map((state) => (
                <label
                  key={state}
                  className="flex items-center gap-[12px] cursor-pointer group"
                >
                  <div className="relative shrink-0 w-[18px] h-[18px]">
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full border-[1.125px] border-black transition-colors',
                      )}
                    />
                    {productState === state && (
                      <div className="absolute left-[3.38px] top-[3.38px] w-[11.25px] h-[11.25px]">
                        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="6" cy="6" r="5.625" fill="black" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="productState"
                    value={state}
                    checked={productState === state}
                    onChange={() => setProductState(state)}
                    className="sr-only"
                  />
                  <span className="text-[18px] font-normal text-[#344054] leading-[1.2]">
                    {state}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-end gap-[16px] mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center py-[12px] px-[16px] rounded-[2px] border-[0.75px] border-[#686f7d] text-black hover:bg-gray-50 transition-all cursor-pointer min-w-[80px]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={() => isValid && onNext({ productState, returnReason })}
          className={cn(
            'flex items-center justify-center py-[12px] px-[16px] rounded-[2px] transition-all min-w-[80px]',
            isValid
              ? 'bg-[#dec33a] border border-[#dec33a] text-black hover:bg-[#c9b034] cursor-pointer'
              : 'bg-[#e5e5e6] border border-[#e5e5e6] text-[#848995] cursor-not-allowed'
          )}
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
