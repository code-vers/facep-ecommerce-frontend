/**
 * @fileoverview Call to action (CTA) banner component matching Figma Node 2064:1020.
 * Invites anonymous users to sign in and register, or welcomes logged-in users.
 *
 * @module components/todays-deal/TodaysDealCta
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const LOCAL_ASSET = 'http://localhost:3845/assets/ae1f3d09ed384575a956036d950edee683b99fc6.png';
const FALLBACK_ASSET =
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop';

/**
 * TodaysDealCta component.
 * Integrates with AuthContext to render auth state or actions dynamically.
 */
export default function TodaysDealCta() {
  const { session } = useAuth();
  const [imgSrc, setImgSrc] = useState(LOCAL_ASSET);

  return (
    <section
      className='w-full bg-gradient-to-r from-[rgba(222,195,58,0.5)] via-[rgba(236,222,148,0.5)] to-[rgba(243,238,209,0.5)] py-12 lg:py-0 lg:h-[600px] flex items-center overflow-hidden border-t border-[#E5E5E6]'
      data-node-id='2064:1020'
    >
      <div className='mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 h-full flex items-center justify-center'>
        {/* Main layout container (Figma Frame 206) */}
        <div
          className='w-full max-w-[1282px] flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-[260px]'
          data-node-id='2064:1021'
        >
          {/* Left Illustration Box */}
          <div
            className='w-11/12 sm:w-full max-w-[579px] aspect-[579/481] xl:w-[579px] xl:h-[481px] relative rounded-lg overflow-hidden shrink-0 mx-auto xl:mx-0 self-center'
            data-node-id='2064:1022'
          >
            <Image
              src={imgSrc}
              alt='Start Shopping Cart illustration'
              fill
              unoptimized
              onError={() => setImgSrc(FALLBACK_ASSET)}
              className='object-cover object-center select-none'
            />
          </div>

          {/* Right Action panel */}
          <div
            className='w-full max-w-[443px] flex flex-col gap-4 text-center xl:text-left items-center xl:items-start shrink-0 mx-auto xl:mx-0 self-center'
            data-node-id='2064:1023'
          >
            {session ? (
              <>
                <div className='flex flex-col gap-6 items-center xl:items-start w-full'>
                  <h3
                    className='font-[Arial] text-[36px] sm:text-[48px] font-bold text-black leading-[1.1] tracking-[-0.96px] capitalize'
                    data-node-id='2064:1025'
                  >
                    Welcome Back!
                  </h3>

                  <Link
                    href='#deals-catalog'
                    className='bg-[#dec33a] border border-[#dec33a] hover:bg-[#c9b034] text-black font-semibold text-[16px] h-[43px] w-[211px] rounded-[2px] transition-all flex items-center justify-center shadow-sm'
                  >
                    Shop Deals
                  </Link>
                </div>

                <p className='font-sans font-normal leading-[1.2] text-[18px] sm:text-[22px] text-black'>
                  Logged in as <span className='font-semibold'>{session.user.name}</span>
                </p>
              </>
            ) : (
              <>
                <div className='flex flex-col gap-6 items-center w-full' data-node-id='2064:1024'>
                  <h3
                    className='font-[Arial] text-[36px] sm:text-[48px] font-bold text-black leading-[1.1] tracking-[-0.96px] capitalize'
                    data-node-id='2064:1025'
                  >
                    Start Shopping Now
                  </h3>

                  {/* Sign In Button */}
                  <Link
                    href='/login'
                    className='bg-[#dec33a] border border-[#dec33a] hover:bg-[#c9b034] text-black font-semibold text-[16px] h-[43px] w-[211px] rounded-[2px] transition-all flex items-center justify-center shadow-sm'
                    data-node-id='2064:1026'
                  >
                    Sign In
                  </Link>
                </div>

                {/* Register Link */}
                <p
                  className='font-sans font-normal leading-[1.2] text-[18px] sm:text-[22px] text-black text-center w-full'
                  data-node-id='2064:1029'
                >
                  New Here?{' '}
                  <Link
                    href='/register'
                    className='text-[#165dd0] hover:text-[#0f4aa6] font-normal underline ml-1'
                  >
                    Start now
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
