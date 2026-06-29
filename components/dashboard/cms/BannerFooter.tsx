'use client';

import { CheckCircle2, Plus } from 'lucide-react';
import Image from 'next/image';

const mockHeaderBanners = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop', // Watch
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop', // Headphones
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop', // Red Shoes
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400&auto=format&fit=crop', // Camera
];

const mockFooterBanner = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop'; // Store layout

export default function BannerFooter() {
  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[32px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] md:p-[32px]'>
      {/* Title */}
      <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>Banners</h2>

      <div className='flex w-full flex-col gap-[32px]'>
        
        {/* Header Section */}
        <div className='flex w-full flex-col gap-[12px]'>
          <div className='flex items-center gap-[16px]'>
            <span className='text-[14px] font-normal text-black'>Header</span>
            <button className='text-[14px] font-normal text-[#165DD0] transition-colors hover:underline focus-visible:outline-none'>
              Add New Banner +
            </button>
          </div>
          
          <div className='flex w-full items-center rounded-[4px] border border-dashed border-[#E5E5E6] p-[16px] md:p-[24px]'>
            <div className='relative flex flex-wrap gap-[16px]'>
              {mockHeaderBanners.map((src, idx) => {
                const isLast = idx === mockHeaderBanners.length - 1;
                return (
                  <div key={idx} className='relative flex items-center'>
                    <div className='relative h-[120px] w-[120px] overflow-hidden rounded-[4px]'>
                      <Image
                        src={src}
                        alt={`Header banner ${idx + 1}`}
                        fill
                        sizes='120px'
                        className='object-cover'
                        unoptimized
                      />
                    </div>
                    {isLast && (
                      <div className='absolute -right-[16px] z-10 flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#E5E5E6] bg-[#F2F2F3] shadow-sm'>
                        <Plus size={16} className='text-[#42454D]' />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className='flex w-full flex-col gap-[12px]'>
          <div className='flex items-center gap-[16px]'>
            <span className='text-[14px] font-normal text-black'>Footer</span>
            <button className='text-[14px] font-normal text-[#165DD0] transition-colors hover:underline focus-visible:outline-none'>
              Upload New Banner +
            </button>
          </div>
          
          <div className='flex w-full rounded-[4px] border border-dashed border-[#E5E5E6] p-[16px] md:p-[24px]'>
            <div className='relative h-[200px] sm:h-[300px] w-full overflow-hidden rounded-[4px]'>
              <Image
                src={mockFooterBanner}
                alt='Footer banner'
                fill
                sizes='(max-width: 1400px) 100vw, 1400px'
                className='object-cover'
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className='flex w-full justify-end pt-[16px]'>
          <button className='flex h-[40px] items-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'>
            <span className='text-[14px] font-normal text-black'>Save Changes</span>
            <CheckCircle2 size={16} className='text-black' />
          </button>
        </div>

      </div>
    </div>
  );
}
