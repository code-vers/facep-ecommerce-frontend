'use client';

import { ChevronDown } from 'lucide-react';

interface RevenueData {
  id: string;
  month: string;
  totalRevenue: string;
  commission: string;
  netEarnings: string;
}

const mockRevenueData: RevenueData[] = [
  { id: '1', month: 'June', totalRevenue: '$ 20000', commission: '$ 20000', netEarnings: '$ 20000' },
  { id: '2', month: 'May', totalRevenue: '$ 20000', commission: '$ 20000', netEarnings: '$ 20000' },
  { id: '3', month: 'April', totalRevenue: '$ 20000', commission: '$ 20000', netEarnings: '$ 20000' },
  { id: '4', month: 'March', totalRevenue: '$ 20000', commission: '$ 20000', netEarnings: '$ 20000' },
  { id: '5', month: 'February', totalRevenue: '$ 20000', commission: '$ 20000', netEarnings: '$ 20000' },
  { id: '6', month: 'January', totalRevenue: '$ 20000', commission: '$ 20000', netEarnings: '$ 20000' },
];

export default function RevenueBreakdown() {
  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Revenue Breakdown
        </h2>
        <div className='flex h-[36px] w-[120px] items-center justify-between overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px]'>
          <span className='text-[14px] font-normal text-[#848995]'>2026</span>
          <ChevronDown size={16} className='text-[#848995]' />
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[800px] flex w-full shrink-0 flex-col items-start'>
          
          {/* Table Header row */}
          <div className='flex h-[40px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[16px]'>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Month
              </p>
            </div>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Total Revenue
              </p>
            </div>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Commission (15%)
              </p>
            </div>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Net Earnings
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {mockRevenueData.map((data, index) => (
            <div
              key={data.id}
              className={`flex w-full shrink-0 items-center px-[16px] py-[16px] transition-colors hover:bg-gray-50 ${
                index !== mockRevenueData.length - 1 ? 'border-b border-[#E5E5E6]' : ''
              }`}
            >
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {data.month}
                </p>
              </div>
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {data.totalRevenue}
                </p>
              </div>
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {data.commission}
                </p>
              </div>
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {data.netEarnings}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
