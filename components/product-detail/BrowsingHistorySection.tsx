'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
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
    imageSrc: 'https://www.figma.com/api/mcp/asset/cd89c1d0-7d92-4e01-b547-0376c61419b7',
    imageAlt: 'Monitor with keyboard setup',
  },
  {
    id: 'history-2',
    title: 'Gaming Setup',
    ratingText: '4.5 (624+)',
    price: '$299.99',
    offerText: 'Up to 30% off',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/e6455af2-1502-4ed7-9a48-f9af5d3e8cc7',
    imageAlt: 'Round speaker setup',
  },
  {
    id: 'history-3',
    title: 'Office Chair',
    ratingText: '4.7 (320+)',
    price: '$199.99',
    offerText: 'Free Shipping on orders over $50',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/17763c27-e2be-4302-a51c-204d77011501',
    imageAlt: 'Pink headphones',
  },
  {
    id: 'history-4',
    title: 'Mechanical Keyboard',
    ratingText: '4.8 (1,200+)',
    price: '$89.99',
    offerText: '20% off for first-time buyers',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/af6a2899-a1e4-494d-9e28-1644fd3202da',
    imageAlt: 'White wireless earbuds',
  },
  {
    id: 'history-5',
    title: 'Monitor Stand',
    ratingText: '4.6 (150+)',
    price: '$49.99',
    offerText: 'Buy one, get one 50% off',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/3f617bbd-1413-464f-9708-326b7b547d42',
    imageAlt: 'Phone on monitor stand',
  },
  {
    id: 'history-6',
    title: 'Gaming Mouse',
    ratingText: '4.5 (500+)',
    price: '$59.99',
    offerText: '10% off with newsletter signup',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/61b1ef8b-36c2-4126-8d23-decde18fe794',
    imageAlt: 'Gaming mouse on desk',
  },
  {
    id: 'history-7',
    title: 'Headset with Microphone',
    ratingText: '4.4 (800+)',
    price: '$79.99',
    offerText: '25% off for student discounts',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/ff354061-6020-43cf-b070-1ad71c640761',
    imageAlt: 'Headset with charging phone',
  },
  {
    id: 'history-8',
    title: 'Webcam',
    ratingText: '4.3 (400+)',
    price: '$99.99',
    offerText: 'Free shipping on orders over $100',
    shippingText: 'Free delivery',
    imageSrc: 'https://www.figma.com/api/mcp/asset/1925a3d9-9930-47cb-acac-457874eb4601',
    imageAlt: 'Mounted webcam closeup',
  },
  {
    id: 'history-9',
    title: 'Gaming Setup',
    ratingText: '4.5 (624+)',
    price: '$299.99',
    offerText: 'Up to 30% off',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/21ce5c5b-b38f-4b43-95d3-0a902a088f55',
    imageAlt: 'White earbuds on pink background',
  },
  {
    id: 'history-10',
    title: 'Gaming Setup',
    ratingText: '4.5 (624+)',
    price: '$299.99',
    offerText: 'Up to 30% off',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/a13d6682-ab69-4339-9b12-76bc5f788d21',
    imageAlt: 'Desk arm with monitor stand',
  },
  {
    id: 'history-11',
    title: 'Office Chair',
    ratingText: '4.7 (320+)',
    price: '$199.99',
    offerText: 'Free Shipping on orders over $50',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/bee85322-4e4f-4bc1-a32c-7ae0a1463619',
    imageAlt: 'Blue headphones front view',
  },
  {
    id: 'history-12',
    title: 'Mechanical Keyboard',
    ratingText: '4.8 (1,200+)',
    price: '$89.99',
    offerText: '20% off for first-time buyers',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/e0f1a2bd-907b-4253-964f-c6bf37868f22',
    imageAlt: 'Folded blue headphones',
  },
  {
    id: 'history-13',
    title: 'Monitor Stand',
    ratingText: '4.6 (150+)',
    price: '$49.99',
    offerText: 'Buy one, get one 50% off',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/33146141-2548-475e-8818-ed4ee087e737',
    imageAlt: 'Phone on stand with blue case',
  },
  {
    id: 'history-14',
    title: 'Gaming Mouse',
    ratingText: '4.5 (500+)',
    price: '$59.99',
    offerText: '10% off with newsletter signup',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/54a58d3c-9d80-487f-a5ae-9684e5d4e4ed',
    imageAlt: 'Person holding phone',
  },
  {
    id: 'history-15',
    title: 'Headset with Microphone',
    ratingText: '4.4 (800+)',
    price: '$79.99',
    offerText: '25% off for student discounts',
    shippingText: '$36 Shipping',
    imageSrc: 'https://www.figma.com/api/mcp/asset/6f3b607f-3f75-44b7-90c9-de4d52b117aa',
    imageAlt: 'Blue earbuds in ice',
  },
  {
    id: 'history-16',
    title: 'Webcam',
    ratingText: '4.3 (400+)',
    price: '$99.99',
    offerText: 'Free shipping on orders over $100',
    shippingText: 'Free delivery',
    imageSrc: 'https://www.figma.com/api/mcp/asset/cd89c1d0-7d92-4e01-b547-0376c61419b7',
    imageAlt: 'Webcam product box',
  },
] as const;

function BrowsingHistoryCard({ product }: { product: HistoryProduct }) {
  return (
    <Link href={`/product/deals/${product.id}`} className='group focus-visible:outline-none'>
      <article className='flex min-w-49.75 flex-col overflow-hidden rounded-lg border border-[#E5E5E6] bg-white transition-all hover:-translate-y-0.5 hover:shadow-md'>
        <div className='relative h-45 w-full overflow-hidden rounded-t-lg'>
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            unoptimized
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            sizes='199px'
          />
        </div>

        <div className='flex w-full flex-col gap-1 px-2 py-3'>
          <p className='w-full text-[14px] leading-[1.3] text-[#165DD0]'>{product.title}</p>

          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-0.5'>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={12}
                  strokeWidth={1.7}
                  fill={index < 4 ? '#F09000' : 'none'}
                  className='text-[#F09000]'
                />
              ))}
            </div>
            <p className='whitespace-nowrap text-[12px] leading-[1.3] text-[#4A5565]'>
              {product.ratingText}
            </p>
          </div>

          <p className='w-full text-[18px] leading-[1.2] text-black'>{product.price}</p>

          <div className='min-h-7.75 w-full text-[12px] leading-[1.3] text-[#229A4E]'>
            <p>{product.offerText}</p>
            <p aria-hidden='true'>&nbsp;</p>
          </div>

          <p className='w-full text-[12px] leading-[1.3] text-[#42454D]'>{product.shippingText}</p>
        </div>
      </article>
    </Link>
  );
}

export default function BrowsingHistorySection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCards = (direction: 'left' | 'right') => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const cardWidth = 199 + 24;
    container.scrollBy({
      left: direction === 'right' ? cardWidth * 2 : -cardWidth * 2,
      behavior: 'smooth',
    });
  };

  return (
    <section className='w-full px-4 py-6 sm:px-5 sm:py-8 lg:px-10 xl:px-20 xl:py-12.5'>
      <div className='mx-auto flex max-w-[1920px] flex-col gap-6'>
        <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='text-[22px] leading-[1.2] text-black'>
            Inspired by your browsing history
          </h2>
          <p className='text-[18px] leading-[1.2] text-[#42454D]'>Page 1/5</p>
        </div>

        <div className='flex flex-col items-center gap-9'>
          <div className='relative w-full'>
            <div
              ref={scrollRef}
              className='overflow-x-auto scroll-smooth [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden'
            >
              <div className='grid min-w-max grid-flow-col gap-4 sm:gap-5 xl:min-w-[1784px] xl:grid-cols-8 xl:gap-6'>
                {historyProducts.map((product) => (
                  <BrowsingHistoryCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            <button
              type='button'
              onClick={() => scrollCards('left')}
              className='absolute -left-10 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#CACACE] xl:flex'
              aria-label='Previous browsing history products'
            >
              <ChevronLeft size={16} className='text-[#42454D]' />
            </button>

            <button
              type='button'
              onClick={() => scrollCards('right')}
              className='absolute -right-10 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#CACACE] xl:flex'
              aria-label='Next browsing history products'
            >
              <ChevronRight size={16} className='text-[#42454D]' />
            </button>
          </div>

          <button
            type='button'
            className='h-12 w-full rounded-xs border-[0.75px] border-black bg-transparent px-4 text-[16px] leading-[1.2] text-black sm:w-auto sm:min-w-52.75'
          >
            Explore More
          </button>
        </div>
      </div>
    </section>
  );
}
