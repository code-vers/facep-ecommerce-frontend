'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // If no props are passed, fallback to the static layout
  if (currentPage === undefined || totalPages === undefined || onPageChange === undefined) {
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

  // Interactive layout
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className='flex w-full shrink-0 items-center justify-center py-[24px]'>
      <div className='flex items-center gap-[8px]'>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='flex items-center gap-[4px] px-[8px] py-[4px] text-[14px] font-normal text-[#848995] transition-colors hover:text-black disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className='flex items-center gap-[4px]'>
          {pages.map((page) => (
            <button 
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-[32px] w-[32px] items-center justify-center rounded-[4px] text-[14px] font-normal transition-colors',
                currentPage === page 
                  ? 'bg-[#E5E5E6] text-black' 
                  : 'text-[#42454D] hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className='flex items-center gap-[4px] px-[8px] py-[4px] text-[14px] font-normal text-[#232A39] transition-colors hover:text-black disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
