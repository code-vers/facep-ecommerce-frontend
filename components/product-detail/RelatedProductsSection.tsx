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

import ProductCard from '@/components/shared/ProductCard';

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  return (
    <div className='flex w-[199px] h-full shrink-0'>
      <ProductCard
        imageSrc={product.imageSrc}
        imageAlt={product.imageAlt}
        title="Gaming Setup"
        rating={4.5}
        reviewCount="624+"
        price="$299.99"
        offerText="No offers Right now"
        offerTextMuted={true}
        shippingText="$36 Shipping"
        buttonVariant="none"
      />
    </div>
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
    <section className='w-full border-t border-[#E5E5E6] px-4 py-6 sm:px-5 sm:py-8 lg:px-10 xl:px-20 xl:py-12.5'>
      <div className='mx-auto flex max-w-[1920px] flex-col gap-6'>
        <div className='flex w-full items-center'>
          <h2 className='text-[22px] leading-[1.2] text-black'>Deals On Related Products</h2>
        </div>

        <div className='relative w-full'>
          <div
            ref={scrollRef}
            className='overflow-x-auto scroll-smooth [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden'
          >
            <div className='grid min-w-max grid-flow-col gap-4 sm:gap-5 xl:min-w-[1784px] xl:grid-cols-8 xl:gap-6'>
              {relatedProducts.map((product) => (
                <RelatedProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <button
            type='button'
            onClick={() => scrollCards('left')}
            className='absolute -left-10 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#CACACE] xl:flex'
            aria-label='Previous related products'
          >
            <ChevronLeft size={16} className='text-[#42454D]' />
          </button>

          <button
            type='button'
            onClick={() => scrollCards('right')}
            className='absolute -right-10 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#CACACE] xl:flex'
            aria-label='Next related products'
          >
            <ChevronRight size={16} className='text-[#42454D]' />
          </button>
        </div>
      </div>
    </section>
  );
}
