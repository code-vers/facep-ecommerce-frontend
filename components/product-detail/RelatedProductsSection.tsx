'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRef } from 'react';

type RelatedProduct = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  buttonLabel: 'Add To Cart' | 'See Options';
};

const relatedProducts: RelatedProduct[] = [
  {
    id: 'related-1',
    imageSrc: 'https://www.figma.com/api/mcp/asset/f9a26fed-13f5-4f4c-861a-829c68b51402',
    imageAlt: 'Red running shoe',
    buttonLabel: 'Add To Cart',
  },
  {
    id: 'related-2',
    imageSrc: 'https://www.figma.com/api/mcp/asset/8ef106d1-3864-49a8-953a-ddacfcc0fa78',
    imageAlt: 'Black sunglasses',
    buttonLabel: 'See Options',
  },
  {
    id: 'related-3',
    imageSrc: 'https://www.figma.com/api/mcp/asset/8ef106d1-3864-49a8-953a-ddacfcc0fa78',
    imageAlt: 'Black sunglasses second angle',
    buttonLabel: 'See Options',
  },
  {
    id: 'related-4',
    imageSrc: 'https://www.figma.com/api/mcp/asset/f9a26fed-13f5-4f4c-861a-829c68b51402',
    imageAlt: 'Red running shoe side view',
    buttonLabel: 'Add To Cart',
  },
  {
    id: 'related-5',
    imageSrc: 'https://www.figma.com/api/mcp/asset/f9a26fed-13f5-4f4c-861a-829c68b51402',
    imageAlt: 'Red running shoe detail',
    buttonLabel: 'Add To Cart',
  },
  {
    id: 'related-6',
    imageSrc: 'https://www.figma.com/api/mcp/asset/f398bb63-4dc7-4e3c-ae53-6bf13a872666',
    imageAlt: 'Green bottle',
    buttonLabel: 'See Options',
  },
  {
    id: 'related-7',
    imageSrc: 'https://www.figma.com/api/mcp/asset/f398bb63-4dc7-4e3c-ae53-6bf13a872666',
    imageAlt: 'Green bottle duplicate',
    buttonLabel: 'See Options',
  },
  {
    id: 'related-8',
    imageSrc: 'https://www.figma.com/api/mcp/asset/f9a26fed-13f5-4f4c-861a-829c68b51402',
    imageAlt: 'Red running shoe repeated',
    buttonLabel: 'Add To Cart',
  },
];

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  const isPrimary = product.buttonLabel === 'Add To Cart';

  return (
    <article className='flex h-full min-w-49.75 flex-col overflow-hidden rounded-lg border border-[#E5E5E6] bg-white'>
      <div className='relative h-45 w-full overflow-hidden rounded-t-lg'>
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          unoptimized
          className='object-cover'
          sizes='199px'
        />
      </div>

      <div className='flex w-full flex-col gap-3 px-2 py-3'>
        <div className='flex w-full flex-col gap-1'>
          <p className='w-full text-[14px] leading-[1.3] text-[#165DD0]'>Gaming Setup</p>

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
            <p className='whitespace-nowrap text-[12px] leading-[1.3] text-[#4A5565]'>4.5 (624+)</p>
          </div>

          <p className='w-full text-[18px] leading-[1.2] text-black'>$299.99</p>

          <div className='min-h-7.75 w-full text-[12px] leading-[1.3] text-[#848995]'>
            <p>No offers Right now</p>
            <p aria-hidden='true'>&nbsp;</p>
          </div>

          <p className='w-full text-[12px] leading-[1.3] text-[#42454D]'>$36 Shipping</p>
        </div>

        <button
          type='button'
          className={
            isPrimary
              ? 'h-8 w-full rounded-xsrder border-[#DEC33A] bg-[#DEC33A] text-[12px] leading-[1.3] text-black'
              : 'h-8 w-full rounded-xs border-[0.75px] border-[#686F7D] bg-white text-[12px] leading-[1.3] text-[#42454D]'
          }
        >
          {product.buttonLabel}
        </button>
      </div>
    </article>
  );
}

export default function RelatedProductsSection() {
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
    <section className='w-full border-t border-[#E5E5E6] px-5 py-8 lg:px-10 xl:px-20 xl:py-12.5'>
      <div className='mx-auto flex max-w-[1920px] flex-col gap-6'>
        <div className='flex w-full items-center'>
          <h2 className='text-[22px] leading-[1.2] text-black'>Deals On Related Products</h2>
        </div>

        <div className='relative w-full'>
          <div
            ref={scrollRef}
            className='overflow-x-auto scroll-smooth [-ms-overflow-style:none] scrollbar-nonebkit-scrollbar]:hidden'
          >
            <div className='grid min-w-[1784px] grid-cols-8 gap-6'>
              {relatedProducts.map((product) => (
                <RelatedProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <button
            type='button'
            onClick={() => scrollCards('left')}
            className='absolute -left-3.25 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#CACACE] xl:flex'
            aria-label='Previous related products'
          >
            <ChevronLeft size={16} className='text-[#42454D]' />
          </button>

          <button
            type='button'
            onClick={() => scrollCards('right')}
            className='absolute -right-3.25 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#CACACE] xl:flex'
            aria-label='Next related products'
          >
            <ChevronRight size={16} className='text-[#42454D]' />
          </button>
        </div>
      </div>
    </section>
  );
}
