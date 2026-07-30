'use client';

import ProductCard from '@/components/shared/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';

type HistoryProduct = {
  id: string;
  title: string;
  ratingText: string;
  price: string;
  offerText: string;
  shippingText: string;
  imageSrc: string;
  imageAlt: string;
};

const historyProducts: HistoryProduct[] = [
  {
    id: 'history-1',
    title: 'Gaming Setup',
    ratingText: '4.5 (624+)',
    price: '$299.99',
    offerText: 'Up to 30% off',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-1.jpg',
    imageAlt: 'Monitor with keyboard setup',
  },
  {
    id: 'history-2',
    title: 'Gaming Setup',
    ratingText: '4.5 (624+)',
    price: '$299.99',
    offerText: 'Up to 30% off',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-2.jpg',
    imageAlt: 'Round speaker setup',
  },
  {
    id: 'history-3',
    title: 'Office Chair',
    ratingText: '4.7 (320+)',
    price: '$199.99',
    offerText: 'Free Shipping on orders over $50',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-3.jpg',
    imageAlt: 'Pink headphones',
  },
  {
    id: 'history-4',
    title: 'Mechanical Keyboard',
    ratingText: '4.8 (1,200+)',
    price: '$89.99',
    offerText: '20% off for first-time buyers',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-4.jpg',
    imageAlt: 'White wireless earbuds',
  },
  {
    id: 'history-5',
    title: 'Monitor Stand',
    ratingText: '4.6 (150+)',
    price: '$49.99',
    offerText: 'Buy one, get one 50% off',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-5.jpg',
    imageAlt: 'Phone on monitor stand',
  },
  {
    id: 'history-6',
    title: 'Gaming Mouse',
    ratingText: '4.5 (500+)',
    price: '$59.99',
    offerText: '10% off with newsletter signup',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-6.jpg',
    imageAlt: 'Gaming mouse on desk',
  },
  {
    id: 'history-7',
    title: 'Headset with Microphone',
    ratingText: '4.4 (800+)',
    price: '$79.99',
    offerText: '25% off for student discounts',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-7.jpg',
    imageAlt: 'Headset with charging phone',
  },
  {
    id: 'history-8',
    title: 'Webcam',
    ratingText: '4.3 (400+)',
    price: '$99.99',
    offerText: 'Free shipping on orders over $100',
    shippingText: 'Free delivery',
    imageSrc: '/figma/browsing-history/product-8.jpg',
    imageAlt: 'Mounted webcam closeup',
  },
  {
    id: 'history-9',
    title: 'Gaming Setup',
    ratingText: '4.5 (624+)',
    price: '$299.99',
    offerText: 'Up to 30% off',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-9.jpg',
    imageAlt: 'White earbuds on pink background',
  },
  {
    id: 'history-10',
    title: 'Gaming Setup',
    ratingText: '4.5 (624+)',
    price: '$299.99',
    offerText: 'Up to 30% off',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-10.jpg',
    imageAlt: 'Desk arm with monitor stand',
  },
  {
    id: 'history-11',
    title: 'Office Chair',
    ratingText: '4.7 (320+)',
    price: '$199.99',
    offerText: 'Free Shipping on orders over $50',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-11.jpg',
    imageAlt: 'Blue headphones front view',
  },
  {
    id: 'history-12',
    title: 'Mechanical Keyboard',
    ratingText: '4.8 (1,200+)',
    price: '$89.99',
    offerText: '20% off for first-time buyers',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-12.jpg',
    imageAlt: 'Folded blue headphones',
  },
  {
    id: 'history-13',
    title: 'Monitor Stand',
    ratingText: '4.6 (150+)',
    price: '$49.99',
    offerText: 'Buy one, get one 50% off',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-13.jpg',
    imageAlt: 'Phone on stand with blue case',
  },
  {
    id: 'history-14',
    title: 'Gaming Mouse',
    ratingText: '4.5 (500+)',
    price: '$59.99',
    offerText: '10% off with newsletter signup',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-14.jpg',
    imageAlt: 'Person holding phone',
  },
  {
    id: 'history-15',
    title: 'Headset with Microphone',
    ratingText: '4.4 (800+)',
    price: '$79.99',
    offerText: '25% off for student discounts',
    shippingText: '$36 Shipping',
    imageSrc: '/figma/browsing-history/product-15.jpg',
    imageAlt: 'Blue earbuds in ice',
  },
  {
    id: 'history-16',
    title: 'Webcam',
    ratingText: '4.3 (400+)',
    price: '$99.99',
    offerText: 'Free shipping on orders over $100',
    shippingText: 'Free delivery',
    imageSrc: '/figma/browsing-history/product-1.jpg',
    imageAlt: 'Webcam product box',
  },
] as const;

export default function BrowsingHistorySection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCards = (direction: 'left' | 'right') => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const cardWidth = 199 + 24;
    container.scrollBy({
      left: direction === 'right' ? cardWidth * 4 : -cardWidth * 4,
      behavior: 'smooth',
    });
  };

  return (
    <section className='w-full bg-white px-4 py-6 sm:px-5 sm:py-8 lg:px-10 xl:px-20 xl:py-[50px]'>
      <div className='mx-auto flex max-w-[1760px] flex-col gap-6'>
        <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='text-[22px] font-normal leading-[1.2] text-black'>Inspired by your browsing history</h2>
          <p className='text-[18px] leading-[1.2] text-[#42454D]'>Page 1/5</p>
        </div>

        <div className='flex flex-col items-center gap-9'>
          <div className='relative w-full'>
            <div
              ref={scrollRef}
              className='overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            >
              <div className='grid w-[1760px] grid-cols-8 gap-x-6 gap-y-4'>
                {historyProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/deals/${product.id}`}
                    className='block h-[324px] w-[199px] focus-visible:outline-none'
                  >
                    <ProductCard
                      imageSrc={product.imageSrc}
                      imageAlt={product.imageAlt}
                      title={product.title}
                      rating={Number.parseFloat(product.ratingText)}
                      reviewCount={product.ratingText.match(/\((.*)\)/)?.[1] ?? ''}
                      price={product.price}
                      offerText={product.offerText}
                      shippingText={product.shippingText}
                      buttonVariant='none'
                      className='h-[324px] w-[199px]'
                    />
                  </Link>
                ))}
              </div>
            </div>

            <button
              type='button'
              onClick={() => scrollCards('left')}
              className='absolute -left-[52px] top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#CACACE] xl:flex'
              aria-label='Previous browsing history products'
            >
              <ChevronLeft size={16} className='text-[#42454D]' />
            </button>

            <button
              type='button'
              onClick={() => scrollCards('right')}
              className='absolute -right-[52px] top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#CACACE] xl:flex'
              aria-label='Next browsing history products'
            >
              <ChevronRight size={16} className='text-[#42454D]' />
            </button>
          </div>

          <Link
            href="/products"
            className='flex h-12 w-full items-center justify-center rounded-[2px] border-[0.75px] border-black bg-transparent px-4 text-[16px] leading-[1.2] text-black transition-colors hover:bg-gray-50 sm:w-[211px]'
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}
