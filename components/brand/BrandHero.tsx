/**
 * @fileoverview BrandHero sub-component for Brand Store Front.
 * Renders the hero banner section with background image and text overlay.
 *
 * @module components/brand/BrandHero
 */

import Image from 'next/image';

interface BrandHeroProps {
  title?: string;
  subtitle?: string;
}

export default function BrandHero({
  title = "Buy Your Favorite Plant",
  subtitle = "From Plant House",
}: BrandHeroProps) {
  return (
    <section className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] w-full overflow-hidden bg-emerald-950">
      <Image
        src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1600&auto=format&fit=crop"
        alt="Lush green house plants background"
        fill
        priority
        className="object-cover opacity-60 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-8 sm:pb-16 md:pb-20 px-4">
        <div className="max-w-[1760px] w-full px-4 sm:px-6 lg:px-10 text-center lg:text-left">
          <h1 className="text-white text-[32px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-bold leading-tight tracking-tight drop-shadow-md">
            {title} <br className="hidden sm:inline" />
            <span className="text-[#dec33a]">{subtitle}</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
