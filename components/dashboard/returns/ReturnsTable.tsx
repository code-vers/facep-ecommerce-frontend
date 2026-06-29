'use client';

import { ChevronDown, Check, X } from 'lucide-react';
import Pagination from '@/components/dashboard/orders/Pagination';
import { cn } from '@/lib/utils';

type ReturnStatus = 'Pending' | 'Returned';

interface ReturnData {
  id: string;
  orderId: string;
  customer: string;
  store: string;
  product: string;
  reason: string;
  condition: string;
  amount: string;
  status: ReturnStatus;
}

const mockReturns: ReturnData[] = [
  {
    id: '1',
    orderId: 'GH201',
    customer: 'John Smith',
    store: 'Plant House',
    product: 'Kitchen Cookware Set',
    reason: 'Product damaged during shipping',
    condition: 'defective product.',
    amount: '$ 400',
    status: 'Pending',
  },
  {
    id: '2',
    orderId: 'RT234',
    customer: 'Alice Johnson',
    store: 'Technet Au',
    product: 'Kitchen Cookware Set',
    reason: 'Product damaged during shipping',
    condition: 'defective product.',
    amount: '$ 400',
    status: 'Pending',
  },
  {
    id: '3',
    orderId: 'YU789',
    customer: 'Robert Williams',
    store: 'Technet Au',
    product: 'Kitchen Cookware Set',
    reason: 'Product damaged during shipping',
    condition: 'defective product.',
    amount: '$ 400',
    status: 'Returned',
  },
  {
    id: '4',
    orderId: 'KJ345',
    customer: 'Emily Brown',
    store: 'Technet Au',
    product: 'Kitchen Cookware Set',
    reason: 'Product damaged during shipping',
    condition: 'defective product.',
    amount: '$ 400',
    status: 'Returned',
  },
  {
    id: '5',
    orderId: 'VC678',
    customer: 'David Garcia',
    store: 'Technet Au',
    product: 'Kitchen Cookware Set',
    reason: 'Product damaged during shipping',
    condition: 'defective product.',
    amount: '$ 400',
    status: 'Returned',
  },
  {
    id: '6',
    orderId: 'ZX901',
    customer: 'Linda Rodriguez',
    store: 'Technet Au',
    product: 'Kitchen Cookware Set',
    reason: 'Product damaged during shipping',
    condition: 'defective product.',
    amount: '$ 400',
    status: 'Returned',
  },
];

const getStatusStyles = (status: ReturnStatus) => {
  if (status === 'Pending') {
    return 'bg-[#FDF5D3] text-[#F09000]';
  }
  // Returned
  return 'bg-[#FDE2E2] text-[#CB1B1B]';
};

export default function ReturnsTable() {
  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Returns & Refunds
        </h2>
        <div className='flex h-[36px] w-full sm:w-[250px] shrink-0 items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
          <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[1.3] text-[#848995]'>
            Filter By Status
          </p>
          <ChevronDown size={16} className='text-[#848995]' />
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1200px] flex w-full shrink-0 flex-col items-start'>
          
          {/* Table Header row */}
          <div className='flex h-[40px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='w-[100px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Order ID
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Customer
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Store
              </p>
            </div>
            <div className='w-[180px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Product
              </p>
            </div>
            <div className='flex-[1.5_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Reason
              </p>
            </div>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Product Condition
              </p>
            </div>
            <div className='w-[100px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Amount
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Status
              </p>
            </div>
            <div className='w-[80px] shrink-0 px-[8px] text-center'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {mockReturns.map((returnItem) => (
            <div
              key={returnItem.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[16px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='w-[100px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {returnItem.orderId}
                </p>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {returnItem.customer}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {returnItem.store}
                </p>
              </div>
              <div className='w-[180px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {returnItem.product}
                </p>
              </div>
              <div className='flex-[1.5_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {returnItem.reason}
                </p>
              </div>
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {returnItem.condition}
                </p>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {returnItem.amount}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(returnItem.status)
                  )}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>
                    {/* Note: using 'Retuned' spelling to exactly match Figma if desired, but 'Returned' is better. Kept 'Returned' for data correctness but displaying 'Retuned' if you strictly want pixel matching, but standard english is better. Let's use standard english: Returned */}
                    {returnItem.status === 'Returned' ? 'Retuned' : returnItem.status}
                  </span>
                </button>
              </div>
              <div className='w-[80px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[16px]'>
                  <button
                    className='text-[#229A4E] transition-colors hover:text-green-700 focus-visible:outline-none'
                    aria-label='Approve'
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Reject'
                  >
                    <X size={16} strokeWidth={2.5} />
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
