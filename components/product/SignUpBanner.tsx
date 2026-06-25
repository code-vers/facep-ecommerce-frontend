import React from 'react';
import Image from 'next/image';

const IMG = 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop';

export default function SignUpBanner() {
  return (
    <section className="relative w-full min-h-[400px] md:h-[600px] py-12 md:py-0 bg-gradient-to-r from-[rgba(222,195,58,0.3)] via-[rgba(236,222,148,0.3)] to-[rgba(243,238,209,0.3)] flex items-center">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col items-center justify-center gap-8 px-4 md:flex-row md:gap-8 lg:gap-[120px] xl:gap-[260px]">
        {/* Image Side */}
        <div className="relative aspect-[579/481] w-full max-w-[579px] md:w-1/2 overflow-hidden rounded-[8px] bg-white/20">
          <Image 
            src={IMG} 
            alt="Start shopping cart" 
            fill 
            className="object-cover" 
            unoptimized
          />
        </div>
        
        {/* Content Side */}
        <div className="flex w-full max-w-[443px] md:w-1/2 flex-col items-center gap-[16px]">
          <div className="flex w-full flex-col items-center gap-[24px]">
            <h2 className="text-center font-sans text-[32px] sm:text-[40px] md:text-[48px] font-bold capitalize leading-[1.1] tracking-tight text-black">
              Start Shopping Now
            </h2>
            <button className="flex items-center justify-center rounded-[2px] border border-[#DEC33A] bg-[#DEC33A] px-[16px] py-[12px] min-w-[80px] w-[211px] transition-colors hover:bg-[#C9B034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC33A] focus-visible:ring-offset-1 cursor-pointer">
              <span className="font-sans text-[16px] font-normal leading-[1.2] text-black">
                Sign In
              </span>
            </button>
          </div>
          <p className="text-center font-sans text-[18px] sm:text-[22px] font-normal leading-[1.2] text-black">
            New Here?{' '}
            <a href="#" className="font-sans text-[18px] sm:text-[22px] font-normal leading-[1.2] text-[#165DD0] underline hover:text-blue-800">
              Start now
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
