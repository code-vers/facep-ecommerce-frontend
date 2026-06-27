import React from 'react';
import ProductCard from '@/components/shared/ProductCard';

const MOCK_ITEMS = Array.from({ length: 7 }).map((_, i) => ({
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
      <div className='mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-20'>
        <div className='flex flex-col gap-[36px] w-full'>
          <h2 className='text-[22px] leading-[1.2] text-black font-normal'>
            Your recently viewed items
          </h2>
          <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
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
      </div>
    </section>
  );
}
