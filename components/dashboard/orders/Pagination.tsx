'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  return (
    <div className='flex w-full shrink-0 items-center justify-center py-[24px]'>
      <div className='flex items-center gap-[8px]'>
        <button className='flex items-center gap-[4px] px-[8px] py-[4px] text-[14px] font-normal text-[#848995] transition-colors hover:text-black'>
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className='flex items-center gap-[4px]'>
          <button className='flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-[#E5E5E6] text-[14px] font-normal text-black'>
            1
          </button>
          <button className='flex h-[32px] w-[32px] items-center justify-center rounded-[4px] text-[14px] font-normal text-[#42454D] transition-colors hover:bg-gray-100'>
            2
          </button>
          <button className='flex h-[32px] w-[32px] items-center justify-center rounded-[4px] text-[14px] font-normal text-[#42454D] transition-colors hover:bg-gray-100'>
            3
          </button>
          <button className='flex h-[32px] w-[32px] items-center justify-center rounded-[4px] text-[14px] font-normal text-[#42454D] transition-colors hover:bg-gray-100'>
            4
          </button>
          <span className='flex h-[32px] w-[32px] items-center justify-center text-[14px] text-[#848995]'>
            ...
          </span>
        </div>

        <button className='flex items-center gap-[4px] px-[8px] py-[4px] text-[14px] font-normal text-[#232A39] transition-colors hover:text-black'>
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
