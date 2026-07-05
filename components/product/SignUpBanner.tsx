import Image from 'next/image';
import Link from 'next/link';

const IMG = '/cart.svg';

export default function SignUpBanner() {
  return (
    <section className='relative w-full min-h-[600px] bg-linear-to-r from-[rgba(222,195,58,0.5)] via-[rgba(236,222,148,0.5)] via-[54.808%] to-[rgba(243,238,209,0.5)] py-10 xl:py-0'>
      <div className='mx-auto flex h-full min-h-[600px] max-w-[1760px] flex-col items-center justify-center gap-10 px-4 xl:flex-row xl:gap-[260px]'>
        {/* Image Side */}
        <div className='relative w-full max-w-[579px] shrink-0 aspect-579/481'>
          <Image
            src={IMG}
            alt='Start shopping cart'
            fill
            className='object-cover rounded-[8px]'
            unoptimized
          />
        </div>
        {/* Content Side */}
        <div className='flex w-full max-w-[443px] shrink-0 flex-col items-center gap-[16px]'>
          <div className='flex w-full flex-col items-center gap-[24px]'>
            <h2 className="text-center font-['Arial'] text-[32px] md:text-[48px] font-bold capitalize leading-[1.1] tracking-[-0.96px] text-black">
              Start Shopping Now
            </h2>
            <Link 
              href="/login"
              className='flex items-center justify-center rounded-[2px] border border-[#DEC33A] bg-[#DEC33A] px-[16px] py-[12px] min-w-[80px] w-[211px] transition-colors hover:bg-[#C9B034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC33A] focus-visible:ring-offset-1'
            >
              <span className="font-['Open_Sans'] text-[16px] font-normal leading-[1.2] text-black">
                Sign In
              </span>
            </Link>
          </div>
          <p className="text-center font-['Open_Sans'] text-[22px] font-normal leading-[1.2] text-black">
            New Here?{' '}
            <Link
              href='/register'
              className="font-['Open_Sans'] text-[22px] font-normal leading-[1.2] text-[#165DD0] underline hover:text-blue-800"
            >
              Start now
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
