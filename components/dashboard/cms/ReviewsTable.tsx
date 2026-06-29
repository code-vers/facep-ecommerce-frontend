'use client';

import { ChevronDown, Eye, Pencil, Trash2, PlusCircle } from 'lucide-react';
import Pagination from '@/components/dashboard/orders/Pagination';
import { cn } from '@/lib/utils';

type ReviewStatus = 'Published' | 'Draft';

interface ReviewData {
  id: string;
  name: string;
  feedback: string;
  status: ReviewStatus;
}

const mockReviews: ReviewData[] = [
  {
    id: '1',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Published',
  },
  {
    id: '2',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Published',
  },
  {
    id: '3',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Published',
  },
  {
    id: '4',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Draft',
  },
  {
    id: '5',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Draft',
  },
  {
    id: '6',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Published',
  },
];

const getStatusStyles = (status: ReviewStatus) => {
  if (status === 'Published') {
    return 'bg-[#E0EBE4] text-[#229A4E]';
  }
  return 'bg-[#FDF3E1] text-[#D98200]';
};

export default function ReviewsTable() {
  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Reviews
        </h2>
        <div className='flex flex-col sm:flex-row items-center gap-[12px]'>
          <div className='flex h-[36px] w-full sm:w-[250px] shrink-0 items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
            <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[1.3] text-[#848995]'>
              Filter By Status
            </p>
            <ChevronDown size={16} className='text-[#848995]' />
          </div>
          <button className='flex h-[36px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'>
            <span className='text-[14px] font-normal text-black'>Add New Review</span>
            <PlusCircle size={16} className='text-black' />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-[40px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Name
              </p>
            </div>
            <div className='min-w-[400px] flex-[1.5_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Feedback
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Status
              </p>
            </div>
            <div className='w-[100px] shrink-0 px-[8px] text-center'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[16px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {review.name}
                </p>
              </div>
              <div className='min-w-[400px] flex-[1.5_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#848995]'>
                  {review.feedback}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(review.status)
                  )}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>{review.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='View Review'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='Edit Review'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Delete Review'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination */}
      <Pagination />
    </div>
  );
}
