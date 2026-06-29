'use client';

import { ChevronDown, Eye, FileDown, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Pagination from '@/components/dashboard/orders/Pagination';
import { cn } from '@/lib/utils';

type UserStatus = 'Active' | 'Suspend';

interface UserData {
  id: string;
  avatar: string;
  name: string;
  email: string;
  spent: string;
  orders: string;
  date: string;
  status: UserStatus;
}

const mockUsers: UserData[] = [
  {
    id: '1',
    avatar: 'https://i.pravatar.cc/150?u=1',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$119.99',
    orders: '2400',
    date: '02.04.2026',
    status: 'Active',
  },
  {
    id: '2',
    avatar: 'https://i.pravatar.cc/150?u=2',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$79.99',
    orders: '2400',
    date: '02.04.2026',
    status: 'Active',
  },
  {
    id: '3',
    avatar: 'https://i.pravatar.cc/150?u=3',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$89.99',
    orders: '2400',
    date: '02.04.2026',
    status: 'Active',
  },
  {
    id: '4',
    avatar: 'https://i.pravatar.cc/150?u=4',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$39.99',
    orders: '15',
    date: '02.04.2026',
    status: 'Active',
  },
  {
    id: '5',
    avatar: 'https://i.pravatar.cc/150?u=5',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$69.99',
    orders: '10',
    date: '02.04.2026',
    status: 'Suspend',
  },
  {
    id: '6',
    avatar: 'https://i.pravatar.cc/150?u=6',
    name: 'John doe',
    email: 'jophn@Resu.com',
    spent: '$49.99',
    orders: '0',
    date: '02.04.2026',
    status: 'Suspend',
  },
];

const getStatusStyles = (status: UserStatus) => {
  if (status === 'Active') {
    return 'bg-[#E0EBE4] text-[#229A4E]';
  }
  return 'bg-[#FDE2E2] text-[#CB1B1B]';
};

export default function UsersTable() {
  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <p className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Users
        </p>
        <div className='flex flex-col sm:flex-row items-center gap-[12px]'>
          <div className='flex h-[36px] w-full sm:w-[250px] shrink-0 items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
            <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[1.3] text-[#848995]'>
              Filter By Status
            </p>
            <ChevronDown size={16} className='text-[#848995]' />
          </div>
          <button className='flex h-[36px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200'>
            <span className='text-[14px] font-normal text-black'>Export CSV</span>
            <FileDown size={16} className='text-black' />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-[34px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='w-[60px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                User
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Name
              </p>
            </div>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Email
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Total Spent
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Total Orders
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Joining Date
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
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[12px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='w-[60px] shrink-0 px-[8px]'>
                <div className='relative h-[40px] w-[40px] overflow-hidden rounded-[2px]'>
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    sizes='40px'
                    className='object-cover'
                    unoptimized
                  />
                </div>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.name}
                </p>
              </div>
              <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.email}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.spent}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.orders}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {user.date}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(user.status)
                  )}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>{user.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='View User'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='Edit User'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Delete User'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination />
    </div>
  );
}
