import React from 'react';
import ProductCard from '@/components/shared/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MOCK_ITEMS = Array.from({ length: 8 }).map((_, i) => ({
  id: `recent-${i}`,
  title: 'Gaming Setup',
  price: '$299.99',
  offerText: 'No offers Right now',
  rating: 4.5,
  reviewCount: '624+',
  shippingText: '$36 Shipping',
  imageSrc: i % 2 === 0 ? '/ImageWithFallback.png' : '/ImageWithFallback2.png',
  buttonVariant: i % 2 === 0 ? 'add-to-cart' : 'see-options',
}));

export default function RecentlyViewedItems() {
  return (
    <section className='w-full border-t border-[#E5E5E6] py-[50px]'>
      <div className='mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10'>
        <div className='flex flex-col gap-[36px] w-full'>
          <h2 className='text-[22px] leading-[1.2] text-black font-normal'>
            Your recently viewed items
          </h2>
          <div className='relative'>
            <div className='flex overflow-x-auto pb-4 scrollbar-hide'>
              <div className='grid w-full grid-flow-row grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8'>
                {MOCK_ITEMS.map((item) => (
                  <ProductCard
                    key={item.id}
                    imageSrc={item.imageSrc}
                    imageAlt={item.title}
                    title={item.title}
                    rating={item.rating}
                    reviewCount={item.reviewCount}
                    price={item.price}
                    offerText={item.offerText}
                    offerTextMuted={item.offerText === 'No offers Right now'}
                    shippingText={item.shippingText}
                    buttonVariant={item.buttonVariant as 'add-to-cart' | 'see-options'}
                    showHeart={true}
                  />
                ))}
              </div>
            </div>

            {/* Nav arrows */}
            <button className='hidden md:flex absolute -left-10 top-[162px] h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-colors hover:bg-gray-50 z-10'>
              <ChevronLeft size={20} className='text-black' />
            </button>
            <button className='hidden md:flex absolute -right-10 top-[162px] h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-colors hover:bg-gray-50 z-10'>
              <ChevronRight size={20} className='text-black' />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
