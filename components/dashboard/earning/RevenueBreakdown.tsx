'use client';

import { ChevronDown } from 'lucide-react';
import Pagination from '@/components/dashboard/orders/Pagination';
import { useState } from 'react';

interface RevenueData {
  id: string;
  month: string;
  year: string;
  totalRevenue: string;
  commission: string;
  netEarnings: string;
}

const mockRevenueData: RevenueData[] = [
  { id: '1', month: 'June', year: '2026', totalRevenue: '$ 20000', commission: '$ 3000', netEarnings: '$ 17000' },
  { id: '2', month: 'May', year: '2026', totalRevenue: '$ 22000', commission: '$ 3300', netEarnings: '$ 18700' },
  { id: '3', month: 'April', year: '2026', totalRevenue: '$ 18000', commission: '$ 2700', netEarnings: '$ 15300' },
  { id: '4', month: 'March', year: '2026', totalRevenue: '$ 25000', commission: '$ 3750', netEarnings: '$ 21250' },
  { id: '5', month: 'February', year: '2026', totalRevenue: '$ 21000', commission: '$ 3150', netEarnings: '$ 17850' },
  { id: '6', month: 'January', year: '2026', totalRevenue: '$ 19000', commission: '$ 2850', netEarnings: '$ 16150' },
  { id: '7', month: 'December', year: '2025', totalRevenue: '$ 30000', commission: '$ 4500', netEarnings: '$ 25500' },
  { id: '8', month: 'November', year: '2025', totalRevenue: '$ 28000', commission: '$ 4200', netEarnings: '$ 23800' },
];

export default function RevenueBreakdown() {
  const [selectedYear, setSelectedYear] = useState('2026');
  
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = mockRevenueData.filter(d => d.year === selectedYear);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Revenue Breakdown
        </h2>
        <div className='flex items-center gap-[12px]'>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className='h-[36px] w-[120px] shrink-0 rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] font-normal text-[#42454D] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0] cursor-pointer'
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
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
          {paginatedData.map((data, index) => (
            <div
              key={data.id}
              className={`flex w-full shrink-0 items-center px-[16px] py-[16px] transition-colors hover:bg-gray-50 ${
                index !== paginatedData.length - 1 ? 'border-b border-[#E5E5E6]' : ''
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
          {filteredData.length === 0 && (
             <div className="p-8 text-center w-full text-[#848995] text-[14px]">
               No revenue records found for this year.
             </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
