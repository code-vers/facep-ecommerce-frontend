'use client';

import { ChevronDown, Eye, Trash2 } from 'lucide-react';
import Pagination from '../orders/Pagination';

type InquiryStatus = 'Replied' | 'Pending';

interface InquiryData {
  id: string;
  name: string;
  email: string;
  contactNo: string;
  inquiry: string;
  date: string;
  time: string;
  status: InquiryStatus;
}

const mockInquiries: InquiryData[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'jophn@Resu.com',
    contactNo: '0123456789',
    inquiry: 'Delivery delayed for 3 days',
    date: '2024-01-05',
    time: '12.00 am',
    status: 'Replied',
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'jophn@Resu.com',
    contactNo: '0123456789',
    inquiry: 'Product quality issue',
    date: '2024-02-12',
    time: '12.00 am',
    status: 'Replied',
  },
  {
    id: '3',
    name: 'Robert Williams',
    email: 'jophn@Resu.com',
    contactNo: '0123456789',
    inquiry: 'How to sign up',
    date: '2024-03-20',
    time: '12.00 am',
    status: 'Replied',
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'jophn@Resu.com',
    contactNo: '0123456789',
    inquiry: 'What is the platform percentage for sellers',
    date: '2024-04-01',
    time: '12.00 am',
    status: 'Pending',
  },
  {
    id: '5',
    name: 'David Garcia',
    email: 'jophn@Resu.com',
    contactNo: '0123456789',
    inquiry: 'My seller account got suspended',
    date: '2024-05-15',
    time: '12.00 am',
    status: 'Replied',
  },
  {
    id: '6',
    name: 'Linda Rodriguez',
    email: 'jophn@Resu.com',
    contactNo: '0123456789',
    inquiry: 'My seller account got suspended',
    date: '2024-06-22',
    time: '12.00 am',
    status: 'Replied',
  },
];

const getStatusStyles = (status: InquiryStatus) => {
  switch (status) {
    case 'Replied':
      return 'bg-[#E0EBE4] text-[#229A4E]';
    case 'Pending':
      return 'bg-[#F9EBD3] text-[#F09000]';
    default:
      return 'bg-[#E5E5E6] text-[#42454D]';
  }
};

export default function InquiriesTable() {
  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-4 md:p-[16px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] sm:gap-[24px]'>
        <div className='flex min-w-0 flex-[1_0_0] items-center justify-between'>
          <p className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
            Inquiries
          </p>
        </div>
        <div className='flex items-center gap-[12px]'>
          <div className='flex h-[36px] w-full sm:w-[250px] shrink-0 items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white pl-[12px] pr-[12px] py-[10px]'>
            <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[1.3] text-[#848995]'>
              Filter By Status
            </p>
            <ChevronDown size={16} className='text-[#848995]' />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className='w-full overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full flex-col'>
          {/* Table Header */}
          <div className='flex w-full shrink-0 items-center bg-[#F2F2F3] h-[48px]'>
            <div className='w-[150px] shrink-0 px-[8px] pl-[16px]'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Name
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Email
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Contact Number
              </p>
            </div>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Inquiry
              </p>
            </div>
            <div className='w-[100px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Date
              </p>
            </div>
            <div className='w-[100px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Time
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Status
              </p>
            </div>
            <div className='w-[80px] shrink-0 px-[8px] text-center'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {mockInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] h-[48px] hover:bg-gray-50 transition-colors'
            >
              <div className='w-[150px] shrink-0 px-[8px] pl-[16px]'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {inquiry.name}
                </p>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {inquiry.email}
                </p>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {inquiry.contactNo}
                </p>
              </div>
              <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {inquiry.inquiry}
                </p>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {inquiry.date}
                </p>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {inquiry.time}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <div className={`inline-flex h-[24px] items-center justify-between gap-[8px] rounded-[2px] px-[8px] ${getStatusStyles(inquiry.status)}`}>
                  <span className='text-[12px] font-medium leading-[1.2]'>
                    {inquiry.status}
                  </span>
                  <ChevronDown size={12} />
                </div>
              </div>
              <div className='w-[80px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button className='text-[#42454D] hover:text-black transition-colors'>
                    <Eye size={16} />
                  </button>
                  <button className='text-[#CB1B1B] hover:text-red-700 transition-colors'>
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
