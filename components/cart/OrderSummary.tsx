'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/contexts/CartContext';

export default function OrderSummary() {
  const { items, selectedItems } = useCartStore();

  const selectedItemsData = items.filter((item) => selectedItems.includes(item.cartItemId));
  const subtotal = selectedItemsData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Standard fixed shipping if there are items, otherwise 0
  const shipping = selectedItemsData.length > 0 ? 16.48 : 0;
  const total = subtotal + shipping;
  return (
    <div className='flex w-full flex-col gap-9 bg-[#F2F2F3] border border-[#E5E5E6] p-6'>
      <h2 className='text-[22px] leading-[1.2] text-black font-normal'>
        Order Summary
      </h2>

      <div className='flex w-full flex-col gap-6'>
        {/* Cost Breakdown */}
        <div className='flex w-full flex-col gap-3 text-black'>
          <div className='flex w-full items-center justify-between text-[18px] leading-[1.2]'>
            <span className='font-normal'>Subtotal</span>
            <span className='font-bold'>${subtotal.toFixed(2)}</span>
          </div>
          <div className='flex w-full items-center justify-between text-[18px] leading-[1.2]'>
            <span className='font-normal'>Shipping</span>
            <span className='font-bold'>${shipping.toFixed(2)}</span>
          </div>

          <div className='flex w-full items-start justify-between border-t border-[#E5E5E6] py-3 mt-1'>
            <span className='text-[18px] leading-[1.2] font-bold'>Total</span>
            <span className='text-[22px] leading-[1.2] font-bold'>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className='flex w-full flex-col gap-4'>
          {selectedItemsData.length > 0 ? (
            <Link 
              href="/checkout"
              className='flex w-full items-center justify-center rounded-[2px] bg-[#DEC33A] px-4 py-3 hover:bg-[#cbb235] transition-colors'
            >
              <span className='text-[16px] leading-[1.2] text-black font-normal'>
                Proceed to Checkout
              </span>
            </Link>
          ) : (
            <button disabled className='flex w-full items-center justify-center rounded-[2px] bg-[#DEC33A] px-4 py-3 opacity-50 cursor-not-allowed'>
              <span className='text-[16px] leading-[1.2] text-black font-normal'>
                Proceed to Checkout
              </span>
            </button>
          )}
          <Link 
            href="/product/home/prod-3" 
            className='flex w-full items-center justify-center rounded-[2px] border-[0.75px] border-[#686F7D] bg-transparent px-4 py-3 hover:bg-black/5 transition-colors'
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
