import Image from 'next/image';

const IMG = '/cart.svg';

export default function SignUpBanner() {
  return (
    <section className='relative w-full min-h-150 bg-linear-to-r from-[rgba(222,195,58,0.5)] via-[rgba(236,222,148,0.5)] via-[54.808%] to-[rgba(243,238,209,0.5)] py-10 xl:py-0'>
      <div className='mx-auto flex h-full min-h-150 max-w-[1760px] flex-col items-center justify-center gap-10 px-4 xl:flex-row xl:gap-65'>
        {/* Image Side */}
        <div className='relative w-full max-w-144.75 shrink-0 aspect-579/481'>
          <Image
            src={IMG}
            alt='Start shopping cart'
            fill
            className='object-cover rounded-[8px]'
            unoptimized
          />
        </div>
        {/* Content Side */}
        <div className='flex w-full max-w-110.75 shrink-0 flex-col items-center gap-4'>
          <div className='flex w-full flex-col items-center gap-6'>
            <h2 className="text-center font-['Arial'] text-[32px] md:text-[48px] font-bold capitalize leading-[1.1] tracking-[-0.96px] text-black">
              Start Shopping Now
            </h2>
            <button className='flex items-center justify-center rounded-xs border border-[#DEC33A] bg-[#DEC33A] px-4 py-3 min-w-20 w-52.75 transition-colors hover:bg-[#C9B034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC33A] focus-visible:ring-offset-1'>
              <span className="font-['Open_Sans'] text-[16px] font-normal leading-[1.2] text-black">
                Sign In
              </span>
            </button>
          </div>
          <p className="text-center font-['Open_Sans'] text-[22px] font-normal leading-[1.2] text-black">
            New Here?{' '}
            <a
              href='#'
              className="font-['Open_Sans'] text-[22px] font-normal leading-[1.2] text-[#165DD0] underline hover:text-blue-800"
            >
              Start now
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
