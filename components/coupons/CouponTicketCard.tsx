'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Info,
  Clock,
  Truck,
  Percent,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { Coupon } from '@/lib/api/coupon';

interface CouponTicketCardProps {
  coupon: Coupon;
  onViewDetails: (coupon: Coupon) => void;
}

export default function CouponTicketCard({
  coupon,
  onViewDetails,
}: CouponTicketCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="relative w-full bg-white rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group hover:-translate-y-0.5">
      
      {/* ── LEFT TICKET STUB (Perforated Voucher Section) ── */}
      <div className="relative sm:w-37.5 shrink-0 bg-linear-to-br from-[#FFFDF0] via-[#FDF7D8] to-[#FCEEB7] p-4 flex sm:flex-col items-center justify-between sm:justify-center text-center border-b sm:border-b-0 sm:border-r border-dashed border-[#DEC33A] gap-2">
        
        {/* Semi-Circle Punch Notches (Ticket Metaphor) on Desktop */}
        <div className="hidden sm:block absolute -top-3 -right-3 size-6 bg-[#F8F9FA] rounded-full border border-gray-200 z-10 pointer-events-none" />
        <div className="hidden sm:block absolute -bottom-3 -right-3 size-6 bg-[#F8F9FA] rounded-full border border-gray-200 z-10 pointer-events-none" />

        {/* Icon & Discount Value */}
        <div className="flex flex-col items-center gap-1">
          <div className="size-8 rounded-full bg-[#DEC33A] text-black flex items-center justify-center font-bold shadow-2xs">
            {coupon.discountType === 'FREE_SHIPPING' ? (
              <Truck size={16} />
            ) : coupon.discountType === 'PERCENTAGE' ? (
              <Percent size={15} />
            ) : (
              <DollarSign size={16} />
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-black text-[#0A0A0A] leading-none font-[Arial]">
              {coupon.discountType === 'FREE_SHIPPING'
                ? 'FREE'
                : coupon.discountType === 'PERCENTAGE'
                ? `${Number(coupon.discountValue)}%`
                : `$${Number(coupon.discountValue).toFixed(0)}`}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-700">
              {coupon.discountType === 'FREE_SHIPPING' ? 'Delivery' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Min Spend Tag */}
        <span className="text-[10px] font-bold text-gray-700 bg-white/80 border border-[#DEC33A]/60 px-2 py-0.5 rounded-full shadow-2xs">
          {Number(coupon.minOrderAmount) > 0
            ? `Min. $${Number(coupon.minOrderAmount).toFixed(0)}`
            : 'No Min.'}
        </span>
      </div>

      {/* ── RIGHT TICKET BODY ── */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3 bg-white">
        
        {/* Top Header Row: Badge & Countdown */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {coupon.badgeText ? (
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#CC0C39] text-white px-2 py-0.5 rounded-xs shadow-xs">
                {coupon.badgeText}
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded-xs border border-gray-200">
                Verified Deal
              </span>
            )}
            <span className="text-[11px] font-medium text-gray-500">
              {coupon.scope === 'ALL'
                ? 'Sitewide'
                : `${coupon.categoryIds?.length || 0} Categories`}
            </span>
          </div>

          {/* Expiry Pill */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
            <Clock size={12} className="text-[#CC0C39]" />
            {isExpired ? (
              <span className="text-red-600 font-bold">Expired</span>
            ) : daysLeft <= 3 ? (
              <span className="text-red-600 font-bold">
                {daysLeft === 0 ? 'Ends Today' : `${daysLeft}d Left`}
              </span>
            ) : (
              <span>Exp. {coupon.endDate.split('T')[0]}</span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-1">
          <h4
            onClick={() => onViewDetails(coupon)}
            className="text-sm sm:text-base font-bold text-[#0F1111] group-hover:text-[#165DD0] cursor-pointer transition-colors leading-snug line-clamp-1"
            title={coupon.title}
          >
            {coupon.title}
          </h4>
          {coupon.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {coupon.description}
            </p>
          )}
        </div>

        {/* Action Row: Monospace Code Box + 1-Click Copy + Info Modal Trigger */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          
          {/* Promo Code Chip */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-md">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Code:</span>
            <span className="font-mono text-xs sm:text-sm font-extrabold text-black tracking-wider">
              {coupon.code}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* View Details Modal Button */}
            <button
              type="button"
              onClick={() => onViewDetails(coupon)}
              title="View full coupon rules and terms"
              className="p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 hover:text-black transition-colors cursor-pointer"
              aria-label="View coupon terms"
            >
              <Info size={15} />
            </button>

            {/* Primary 1-Click Copy Button */}
            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#DEC33A] hover:bg-[#C9B034] active:bg-[#B49A2E] text-black'
              }`}
            >
              {copied ? (
                <>
                  <Check size={13} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
