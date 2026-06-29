'use client';

import { TrendingUp, AlertCircle, Link } from 'lucide-react';

export default function EarningsSummary() {
  return (
    <div className='grid w-full grid-cols-1 gap-[24px] md:grid-cols-3'>
      
      {/* Total Revenue Card */}
      <div className='flex flex-col items-start gap-[16px] rounded-[4px] bg-[#F2F2F3] p-[24px]'>
        <div className='flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-[#E5E5E6]'>
          <TrendingUp size={16} className='text-[#42454D]' />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <p className='text-[24px] font-semibold leading-[1.2] text-black'>$ 20000</p>
          <p className='text-[14px] font-normal text-[#848995]'>Total Revenue</p>
        </div>
      </div>

      {/* Commission Card */}
      <div className='flex flex-col items-start gap-[16px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px]'>
        <div className='flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-[#FAF0D9]'>
          <AlertCircle size={16} className='text-[#B07010]' />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <p className='text-[24px] font-semibold leading-[1.2] text-black'>$ 3000</p>
          <p className='text-[14px] font-normal text-[#848995]'>Commission (15%)</p>
        </div>
      </div>

      {/* Net Earnings Card */}
      <div className='flex flex-col items-start gap-[16px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px]'>
        <div className='flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-[#E5E5E6]'>
          <Link size={16} className='text-[#42454D]' />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <p className='text-[24px] font-semibold leading-[1.2] text-black'>$ 150000</p>
          <p className='text-[14px] font-normal text-[#848995]'>Net Earnings</p>
        </div>
      </div>

    </div>
  );
}
