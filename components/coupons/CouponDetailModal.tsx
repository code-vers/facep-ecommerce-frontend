'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Ticket,
  Copy,
  Check,
  Info,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import { Coupon } from '@/lib/api/coupon';

interface CouponDetailModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CouponDetailModal({
  coupon,
  isOpen,
  onClose,
}: CouponDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !coupon) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success(`Coupon code "${coupon.code}" copied to clipboard!`);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const isExpired = new Date(coupon.endDate) <= new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(coupon.endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181F26] text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-[#DEC33A] text-black flex items-center justify-center shrink-0">
              <Ticket size={18} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#DEC33A] font-bold block">
                Voucher Terms &amp; Details
              </span>
              <h3 className="text-base font-bold text-white leading-tight">
                {coupon.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 text-[#0F1111]">
          
          {/* Main Voucher Display Card */}
          <div className="relative bg-linear-to-br from-[#FFFDF0] via-[#FDF7D8] to-[#FCEEB7] border-2 border-dashed border-[#DEC33A] rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {coupon.badgeText ? (
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#CC0C39] text-white px-2 py-0.5 rounded-xs shadow-xs">
                  {coupon.badgeText}
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-[#DEC33A] px-2 py-0.5 rounded-xs">
                  Verified Facep Promo
                </span>
              )}

              <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                <Clock size={13} className="text-[#CC0C39]" />
                {isExpired ? (
                  <span className="text-red-600 font-bold">Expired</span>
                ) : daysLeft === 0 ? (
                  <span className="text-red-600 font-bold">Expires Today!</span>
                ) : (
                  <span>
                    <strong>{daysLeft} days</strong> remaining
                  </span>
                )}
              </div>
            </div>

            {/* Huge Discount Display */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-black tracking-tight font-[Arial]">
                {coupon.discountType === 'FREE_SHIPPING'
                  ? 'FREE'
                  : coupon.discountType === 'PERCENTAGE'
                  ? `${Number(coupon.discountValue)}%`
                  : `$${Number(coupon.discountValue).toFixed(2)}`}
              </span>
              <span className="text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wider">
                {coupon.discountType === 'FREE_SHIPPING' ? 'Shipping' : 'Discount'}
              </span>
            </div>

            {coupon.description && (
              <p className="text-xs text-gray-700 leading-relaxed font-normal">
                {coupon.description}
              </p>
            )}

            {/* 1-Click Copy Box */}
            <div className="mt-1 flex items-center justify-between bg-black text-white p-2.5 rounded-lg border border-gray-800 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  Promo Code
                </span>
                <span className="font-mono text-base font-bold text-[#DEC33A] tracking-wider">
                  {coupon.code}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className={`px-3.5 py-1.5 rounded text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#DEC33A] text-black hover:bg-[#C9B034] active:bg-[#B49A2E]'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>1-Click Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Detailed Terms Breakdown Table */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} className="text-[#DEC33A]" />
              <span>Terms &amp; Redemption Criteria</span>
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-0.5">
                <span className="text-gray-500 font-medium text-[11px]">Minimum Spend:</span>
                <span className="font-bold text-black text-sm">
                  {Number(coupon.minOrderAmount) > 0
                    ? `$${Number(coupon.minOrderAmount).toFixed(2)}`
                    : 'No minimum order required'}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-0.5">
                <span className="text-gray-500 font-medium text-[11px]">Maximum Savings Cap:</span>
                <span className="font-bold text-black text-sm">
                  {coupon.maxDiscountAmount
                    ? `$${Number(coupon.maxDiscountAmount).toFixed(2)} max`
                    : 'Uncapped savings'}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-0.5">
                <span className="text-gray-500 font-medium text-[11px]">Catalog Eligibility:</span>
                <span className="font-bold text-black text-sm">
                  {coupon.scope === 'ALL'
                    ? 'Sitewide (All Products)'
                    : `${coupon.categoryIds?.length || 0} Categories Qualifying`}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-0.5">
                <span className="text-gray-500 font-medium text-[11px]">Customer Redemption:</span>
                <span className="font-bold text-black text-sm">
                  {coupon.userUsageLimit || 1} use per customer account
                </span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Valid Dates:</span>
              <span className="font-semibold text-black">
                {coupon.startDate.split('T')[0]} — {coupon.endDate.split('T')[0]}
              </span>
            </div>
          </div>

          {/* 3-Step Redemption Guide */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-700" />
              <span>How to Apply at Checkout:</span>
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-blue-950 font-medium text-center">
              <div className="bg-white/80 p-2 rounded border border-blue-100 flex flex-col items-center gap-1">
                <div className="size-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                  1
                </div>
                <span>Copy promo code</span>
              </div>
              <div className="bg-white/80 p-2 rounded border border-blue-100 flex flex-col items-center gap-1">
                <div className="size-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                  2
                </div>
                <span>Fill your cart</span>
              </div>
              <div className="bg-white/80 p-2 rounded border border-blue-100 flex flex-col items-center gap-1">
                <div className="size-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                  3
                </div>
                <span>Paste at Checkout</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 shrink-0">
          <Link
            href="/products"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={14} />
            <span>Browse Products</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyCode}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#DEC33A] hover:bg-[#C9B034] active:bg-[#B49A2E] text-black text-xs font-extrabold text-center transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={15} />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Code &amp; Start Saving</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
