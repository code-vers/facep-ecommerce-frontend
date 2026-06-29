/**
 * @fileoverview Hero banner component for Today's Deals page.
 * Displays Father's Day Sale discounts with gold/yellow premium theme.
 *
 * @module components/todays-deal/TodaysDealHero
 */

import Image from 'next/image';

/**
 * TodaysDealHero component.
 * Features a bold gold/black gradient layout with high quality gift illustration.
 */
export default function TodaysDealHero() {
  return (
    <section className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] bg-gradient-to-r from-[#ffd014] via-[#f7c20c] to-[#e6b100] flex items-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 h-full flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between relative z-10 gap-6">
        {/* Left side text contents */}
        <div className="flex flex-col gap-2 md:gap-4 max-w-[600px] text-black">
          <span className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-medium uppercase tracking-wider text-black/80">
            upto 40% Discount
          </span>
          <h1 className="font-[Arial] text-[40px] sm:text-[52px] md:text-[64px] lg:text-[76px] xl:text-[84px] font-bold leading-[1.05] tracking-tight">
            Father’s Day Sale
          </h1>
        </div>

        {/* Right side premium image illustration */}
        <div className="relative w-full h-[180px] sm:h-[300px] md:h-[400px] lg:h-[440px] sm:w-[45%] lg:w-[50%] flex justify-end items-center">
          <div className="relative w-full h-full max-w-[550px] aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border border-white/20 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
              alt="Premium Gift Box Father's Day Sale"
              fill
              priority
              unoptimized
              className="object-cover object-center select-none"
            />
            {/* Elegant dark overlay at the bottom of the card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
