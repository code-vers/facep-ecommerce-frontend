/**
 * @fileoverview Step 3 – Pickup & Refund Method.
 * Allows users to select their shipping method and how they want to receive
 * the refund. Matches Figma design node 2149-3445.
 *
 * @module components/profile/refunds/RefundPickupMethod
 */

'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const RETURN_SHIPPING_OPTIONS = [
  { value: 'standard', label: 'Standard Shipping - $40' },
  { value: 'express', label: 'Express Shipping - $75' },
  { value: 'in-store', label: 'Drop off at store - Free' },
] as const;

const REFUND_METHOD_OPTIONS = [
  { value: 'replacement', label: 'I would like a replacement product' },
  { value: 'store-credit', label: 'Store credit (wallet)' },
  { value: 'original-payment', label: 'Refund to original payment method' },
] as const;

export interface PickupMethodData {
  returnShipping: string;
  refundMethod: string;
}

interface RefundPickupMethodProps {
  onNext: (data: PickupMethodData) => void;
  onBack: () => void;
}

/**
 * Step 3: Pickup & Refund Method selection.
 */
export default function RefundPickupMethod({ onNext, onBack }: RefundPickupMethodProps) {
  const [returnShipping, setReturnShipping] = useState('');
  const [refundMethod, setRefundMethod] = useState('');

  const isValid = returnShipping && refundMethod;

  return (
    <div className="flex flex-col gap-9 w-full">
      <h2 className="text-[22px] font-normal text-[#232a39] leading-[1.2]">
        Pickup &amp; Refund Method
      </h2>

      <div className="flex flex-col gap-8 w-full">
        {/* Return shipping method */}
        <div className="flex flex-col gap-4">
          <label className="text-[18px] font-normal text-[#848995] leading-[1.2]">
            Method for returning the product:
          </label>
          <div className="flex flex-col gap-2">
            {RETURN_SHIPPING_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-[2px] border cursor-pointer transition-all',
                  returnShipping === option.value
                    ? 'border-[#dec33a] bg-[#fdf9e8]'
                    : 'border-[#e5e5e6] hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    returnShipping === option.value
                      ? 'border-[#dec33a]'
                      : 'border-[#686f7d]'
                  )}
                >
                  {returnShipping === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#dec33a]" />
                  )}
                </div>
                <input
                  type="radio"
                  name="returnShipping"
                  value={option.value}
                  checked={returnShipping === option.value}
                  onChange={() => setReturnShipping(option.value)}
                  className="sr-only"
                />
                <span className="text-[14px] font-normal text-black leading-[1.3]">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Refund / receiving method */}
        <div className="flex flex-col gap-4">
          <label className="text-[18px] font-normal text-[#848995] leading-[1.2]">
            Method for receiving the refund:
          </label>
          <div className="flex flex-col gap-2">
            {REFUND_METHOD_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-[2px] border cursor-pointer transition-all',
                  refundMethod === option.value
                    ? 'border-[#dec33a] bg-[#fdf9e8]'
                    : 'border-[#e5e5e6] hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    refundMethod === option.value
                      ? 'border-[#dec33a]'
                      : 'border-[#686f7d]'
                  )}
                >
                  {refundMethod === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#dec33a]" />
                  )}
                </div>
                <input
                  type="radio"
                  name="refundMethod"
                  value={option.value}
                  checked={refundMethod === option.value}
                  onChange={() => setRefundMethod(option.value)}
                  className="sr-only"
                />
                <span className="text-[14px] font-normal text-black leading-[1.3]">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-end gap-[16px] mt-8 w-full">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center py-[12px] px-[24px] rounded-[2px] border border-[#686f7d] text-black hover:bg-gray-50 transition-all cursor-pointer min-w-[80px] h-[48px]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={() => isValid && onNext({ returnShipping, refundMethod })}
          className={cn(
            'flex items-center justify-center py-[12px] px-[24px] rounded-[2px] transition-all min-w-[80px] h-[48px]',
            isValid
              ? 'bg-[#dec33a] border border-[#dec33a] text-black hover:bg-[#c9b034] cursor-pointer'
              : 'bg-[#e5e5e6] border border-[#e5e5e6] text-[#848995] cursor-not-allowed'
          )}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
