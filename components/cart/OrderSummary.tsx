import React from 'react';

export default function OrderSummary() {
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
            <span className='font-bold'>$549.98</span>
          </div>
          <div className='flex w-full items-center justify-between text-[18px] leading-[1.2]'>
            <span className='font-normal'>Shipping</span>
            <span className='font-bold'>$16.48</span>
          </div>

          <div className='flex w-full items-start justify-between border-t border-[#E5E5E6] py-3 mt-1'>
            <span className='text-[18px] leading-[1.2] font-bold'>Total</span>
            <span className='text-[22px] leading-[1.2] font-bold'>$566.46</span>
          </div>
        </div>

        {/* Actions */}
        <div className='flex w-full flex-col gap-4'>
          <button className='flex w-full items-center justify-center rounded-[2px] bg-[#DEC33A] px-4 py-3 hover:bg-[#cbb235] transition-colors'>
            <span className='text-[16px] leading-[1.2] text-black font-normal'>
              Proceed to Checkout
            </span>
          </button>
          <button className='flex w-full items-center justify-center rounded-[2px] border-[0.75px] border-[#686F7D] bg-transparent px-4 py-3 hover:bg-black/5 transition-colors'>
            <span className='text-[16px] leading-[1.2] text-black font-normal'>
              Continue Shopping
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
