'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/contexts/CartContext';
import { validateCoupon } from '@/lib/api/coupon';

export default function OrderSummary() {
  const { items, selectedItems, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const selectedItemsData = items.filter((item) => selectedItems.includes(item.cartItemId));
  const subtotal = selectedItemsData.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const rawShipping = selectedItemsData.reduce((acc, item) => acc + ((item.shippingCost || 0) * item.quantity), 0);
  const totalTax = selectedItemsData.reduce((acc, item) => acc + ((item.taxAmount || 0) * item.quantity), 0);
  const totalVatGst = selectedItemsData.reduce((acc, item) => acc + ((item.vatGst || 0) * item.quantity), 0);
  const totalImportCharges = selectedItemsData.reduce((acc, item) => acc + ((item.importCharges || 0) * item.quantity), 0);
  const totalHandlingFee = selectedItemsData.reduce((acc, item) => acc + ((item.handlingFee || 0) * item.quantity), 0);

  // If coupon gives free shipping, waive raw shipping
  const isFreeShipping = appliedCoupon?.discountType === 'FREE_SHIPPING';
  const totalShipping = isFreeShipping ? 0 : rawShipping;

  const extraFees = totalTax + totalVatGst + totalImportCharges + totalHandlingFee;
  
  // Calculate discount deduction
  const couponDiscountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount) || 0 : 0;
  const total = Math.max(0, subtotal + totalShipping + extraFees - couponDiscountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (selectedItemsData.length === 0) {
      toast.error('Please select items in your cart first');
      return;
    }

    setIsValidating(true);
    try {
      const response = await validateCoupon({
        code,
        subtotal,
        cartItems: selectedItemsData.map((item) => ({
          productId: item.id,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      if (response.isValid) {
        applyCoupon({
          code: response.code,
          discountAmount: response.discountAmount,
          title: response.title,
          discountType: response.discountType,
        });
        toast.success(response.message || `Coupon "${response.code}" applied!`);
        setCouponCodeInput('');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Invalid coupon code';
      toast.error(msg);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info('Coupon removed');
  };

  return (
    <div className='flex w-full flex-col gap-6 bg-[#F2F2F3] border border-[#E5E5E6] p-6 rounded-sm'>
      <h2 className='text-[22px] leading-[1.2] text-black font-normal'>
        Order Summary
      </h2>

      <div className='flex w-full flex-col gap-6'>
        {/* Cost Breakdown */}
        <div className='flex w-full flex-col gap-3 text-black'>
          <div className='flex w-full items-center justify-between text-[18px] leading-[1.2]'>
            <span className='font-normal'>Subtotal ({selectedItemsData.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
            <span className='font-bold'>${subtotal.toFixed(2)}</span>
          </div>

          <div className='flex w-full items-center justify-between text-[16px] leading-[1.2] text-gray-700'>
            <span className='font-normal'>Shipping</span>
            <span className='font-bold'>
              {isFreeShipping ? (
                <span className="text-[#229A4E]">Free (Coupon)</span>
              ) : totalShipping === 0 ? (
                'Free'
              ) : (
                `$${totalShipping.toFixed(2)}`
              )}
            </span>
          </div>

          {/* Applied Coupon Line */}
          {appliedCoupon && couponDiscountAmount > 0 && (
            <div className='flex w-full items-center justify-between text-[16px] leading-[1.2] text-[#229A4E] font-medium bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200'>
              <div className='flex items-center gap-1.5'>
                <Tag size={15} />
                <span>Coupon ({appliedCoupon.code})</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-bold'>-${couponDiscountAmount.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className='text-red-500 hover:text-red-700 p-0.5'
                  title="Remove coupon"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {totalTax > 0 && (
            <div className='flex w-full items-center justify-between text-[16px] leading-[1.2] text-gray-700'>
              <span className='font-normal'>Tax</span>
              <span className='font-bold'>${totalTax.toFixed(2)}</span>
            </div>
          )}

          {totalVatGst > 0 && (
            <div className='flex w-full items-center justify-between text-[16px] leading-[1.2] text-gray-700'>
              <span className='font-normal'>VAT/GST</span>
              <span className='font-bold'>${totalVatGst.toFixed(2)}</span>
            </div>
          )}

          {totalImportCharges > 0 && (
            <div className='flex w-full items-center justify-between text-[16px] leading-[1.2] text-gray-700'>
              <span className='font-normal'>Import Charges</span>
              <span className='font-bold'>${totalImportCharges.toFixed(2)}</span>
            </div>
          )}

          {totalHandlingFee > 0 && (
            <div className='flex w-full items-center justify-between text-[16px] leading-[1.2] text-gray-700'>
              <span className='font-normal'>Handling Fee</span>
              <span className='font-bold'>${totalHandlingFee.toFixed(2)}</span>
            </div>
          )}

          <div className='flex w-full items-start justify-between border-t border-[#E5E5E6] py-3 mt-1'>
            <span className='text-[18px] leading-[1.2] font-bold'>Total</span>
            <span className='text-[22px] leading-[1.2] font-bold'>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Coupon / Promo Code Input Section ── */}
        <div className="pt-2 border-t border-[#E5E5E6] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Tag size={13} className="text-[#B49A2E]" />
              <span>Promo Code / Voucher</span>
            </span>
            <Link
              href="/coupons"
              className="text-[11px] font-semibold text-[#165DD0] hover:underline"
            >
              Browse Coupons →
            </Link>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                <span className="font-mono font-bold text-black">{appliedCoupon.code}</span>
                <span className="text-gray-500 truncate max-w-37.5">({appliedCoupon.title})</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-1.5">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                placeholder="Enter promo code"
                className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-white border border-gray-300 rounded focus:border-black focus:outline-none"
              />
              <button
                type="submit"
                disabled={isValidating || !couponCodeInput.trim()}
                className="px-4 py-2 bg-[#DEC33A] hover:bg-[#cbb235] text-black font-bold text-xs rounded transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {isValidating ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <span>Apply</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Actions */}
        <div className='flex w-full flex-col gap-4'>
          {selectedItemsData.length > 0 ? (
            <Link
              href="/checkout"
              className='flex w-full items-center justify-center rounded-xs bg-[#DEC33A] px-4 py-3 hover:bg-[#cbb235] transition-colors'
            >
              <span className='text-[16px] leading-[1.2] text-black font-normal'>
                Proceed to Checkout
              </span>
            </Link>
          ) : (
            <button disabled className='flex w-full items-center justify-center rounded-xs bg-[#DEC33A] px-4 py-3 opacity-50 cursor-not-allowed'>
              <span className='text-[16px] leading-[1.2] text-black font-normal'>
                Proceed to Checkout
              </span>
            </button>
          )}
          <Link
            href="/products"
            className='flex w-full items-center justify-center rounded-xs border-[0.75px] border-[#686F7D] bg-transparent px-4 py-3 hover:bg-black/5 transition-colors'
          >
            <span className='text-[16px] leading-[1.2] text-black font-normal'>
              Continue Shopping
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
