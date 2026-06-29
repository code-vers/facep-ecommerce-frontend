import ProductCard from '@/components/shared/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const IMG1 = '/ImageWithFallback.png';
const IMG2 = '/ImageWithFallback2.png';

const products = Array.from({ length: 16 }).map((_, i) => ({
  id: `bh-${i}`,
  title: i % 2 === 0 ? 'Gaming Setup' : 'Office Chair',
  price: i % 2 === 0 ? '$299.99' : '$199.99',
  offerText: i % 2 === 0 ? 'Up to 30% off' : 'Free Shipping on orders over $50',
  rating: 4.5,
  reviewCount: '624+',
  shippingText: '$36 Shipping',
  imageSrc: i % 2 === 0 ? IMG1 : IMG2,
}));

export default function BrowsingHistory() {
  return (
    <section className='w-full border-t border-[#E5E5E6] bg-white py-12'>
      <div className='mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-[20px] font-bold text-black'>Inspired by your browsing history</h2>
          <div className='text-[14px] text-[#42454D]'>Page 1/5</div>
        </div>

        <div className='relative'>
          {/* Scrollable Container */}
          <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
            <div className='flex w-full'>
              <div className='grid w-full grid-flow-row grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
                {products.map((product, idx) => (
                  <Link key={idx} href={`/product/deals/${product.id}`} className='h-full w-full max-w-[199px] group focus-visible:outline-none'>
                    <ProductCard
                      imageSrc={product.imageSrc}
                      imageAlt={product.title}
                      title={product.title}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      price={product.price}
                      offerText={product.offerText}
                      shippingText={product.shippingText}
                      buttonVariant='none'
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Nav arrows - absolute positioning over the carousel in Figma */}
          <button className='hidden md:flex absolute -left-10 top-[162px] h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-colors hover:bg-gray-50 z-10'>
            <ChevronLeft size={20} className='text-black' />
          </button>
          <button className='hidden md:flex absolute -right-10 top-[162px] h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E6] bg-white shadow-md transition-colors hover:bg-gray-50 z-10'>
            <ChevronRight size={20} className='text-black' />
          </button>
        </div>

        {/* Explore More Button */}
        <div className='mt-[36px] flex justify-center'>
          <button className='flex h-[43px] w-[211px] items-center justify-center rounded-[2px] border border-[#DEC33A] bg-[#DEC33A] transition-colors hover:bg-[#C9B034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC33A] focus-visible:ring-offset-1'>
            <span className='text-[16px] font-normal text-black'>Explore More</span>
          </button>
        </div>
      </div>
    </section>
  );
}
