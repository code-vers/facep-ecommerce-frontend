import React from 'react';
import CartItemList from '@/components/cart/CartItemList';
import BrowsingHistory from '@/components/product/BrowsingHistory';
import SignUpBanner from '@/components/shared/SignUpBanner';

export default function CartPage() {
  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <section className='flex-1 pb-20'>
        {/* Header */}
        <div className='w-full border-b border-[#E5E5E6]'>
          <div className='mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-20 py-3'>
            <h1 className='text-[22px] leading-[1.2] text-[#42454D] font-normal'>
              Shopping cart
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className='mx-auto mt-9 max-w-[1760px] px-4 sm:px-6 lg:px-20'>
          <div className='flex flex-col gap-12 lg:flex-row lg:items-start'>
            {/* Left Column (Cart Items) */}
            <div className='flex w-full flex-[1_0_0]'>
              <CartItemList />
            </div>
            
            {/* Right Column (Placeholder for Checkout Summary) */}
            <div className='hidden w-[400px] shrink-0 lg:block'>
              {/* This is a placeholder. A future design will fill this. */}
              <div className='w-full h-[300px] rounded-[4px] border border-dashed border-[#E5E5E6] bg-gray-50 flex items-center justify-center'>
                <span className='text-gray-400 text-sm'>Order Summary Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended/History Sections */}
      <BrowsingHistory />
      <SignUpBanner />
    </div>
  );
}
