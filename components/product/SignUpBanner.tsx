import React from 'react';
import Image from 'next/image';

const IMG = 'http://localhost:3845/assets/b253b57946a2618040d5a77f7371f8c00e754a22.png';

export default function SignUpBanner() {
  return (
    <section className="relative w-full h-[600px] bg-gradient-to-r from-[rgba(222,195,58,0.5)] via-[rgba(236,222,148,0.5)] via-[54.808%] to-[rgba(243,238,209,0.5)]">
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[260px]">
        {/* Image Side */}
        <div className="relative h-[481px] w-[579px] shrink-0">
          <Image 
            src={IMG} 
            alt="Start shopping cart" 
            fill 
            className="object-cover rounded-[8px]" 
            unoptimized
          />
        </div>
        {/* Content Side */}
        <div className="flex w-[443px] shrink-0 flex-col items-center gap-[16px]">
          <div className="flex w-full flex-col items-center gap-[24px]">
            <h2 className="text-center font-['Arial'] text-[48px] font-bold capitalize leading-[1.1] tracking-[-0.96px] text-black">
              Start Shopping Now
            </h2>
            <button className="flex items-center justify-center rounded-[2px] border border-[#DEC33A] bg-[#DEC33A] px-[16px] py-[12px] min-w-[80px] w-[211px] transition-colors hover:bg-[#C9B034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC33A] focus-visible:ring-offset-1">
              <span className="font-['Open_Sans'] text-[16px] font-normal leading-[1.2] text-black">
                Sign In
              </span>
            </button>
          </div>
          <p className="text-center font-['Open_Sans'] text-[22px] font-normal leading-[1.2] text-black">
            New Here?{' '}
            <a href="#" className="font-['Open_Sans'] text-[22px] font-normal leading-[1.2] text-[#165DD0] underline hover:text-blue-800">
              Start now
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
