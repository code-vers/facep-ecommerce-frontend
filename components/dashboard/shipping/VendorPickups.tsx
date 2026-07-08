'use client';

import { ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react';
import Pagination from '@/components/dashboard/orders/Pagination';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type PickupStatus = 'Shipped' | 'Delivered' | 'Pending' | 'Returned';

interface PickupData {
  id: string;
  customer: string;
  contactNo: string;
  destination: string;
  pickupDate: string;
  status: PickupStatus;
}

const mockPickups: PickupData[] = [
  {
    id: 'GH201',
    customer: 'John Smith',
    contactNo: '555-901-2345',
    destination: 'Port Serenity',
    pickupDate: '2024-01-05',
    status: 'Shipped',
  },
  {
    id: 'RT234',
    customer: 'Alice Johnson',
    contactNo: '555-234-5678',
    destination: 'Emerald Heights, Sunstone City',
    pickupDate: '2024-02-12',
    status: 'Shipped',
  },
  {
    id: 'YU789',
    customer: 'Robert Williams',
    contactNo: '555-345-6789',
    destination: 'Crimson Peak, Shadow Creek',
    pickupDate: '2024-03-20',
    status: 'Delivered',
  },
  {
    id: 'IQ345',
    customer: 'Emily Brown',
    contactNo: '555-456-7890',
    destination: 'Golden Ridge, Twilight Town',
    pickupDate: '2024-04-01',
    status: 'Pending',
  },
  {
    id: 'VO678',
    customer: 'David Garcia',
    contactNo: '555-567-8901',
    destination: 'Ivory Coast, Obsidian Bay',
    pickupDate: '2024-05-15',
    status: 'Shipped',
  },
  {
    id: 'ZX901',
    customer: 'Linda Rodriguez',
    contactNo: '555-678-9012',
    destination: 'Cerulean Wharf, Sienna Village',
    pickupDate: '2024-06-22',
    status: 'Returned',
  },
];

const getStatusStyles = (status: PickupStatus) => {
  switch (status) {
    case 'Shipped':
      return 'bg-[#E0EBE4] text-[#229A4E]';
    case 'Delivered':
      return 'bg-[#E6F0FA] text-[#165DD0]';
    case 'Pending':
      return 'bg-[#FDF5D3] text-[#F09000]';
    case 'Returned':
      return 'bg-[#ECDFDF] text-[#CB1B1B]';
    default:
      return 'bg-[#E5E5E6] text-[#42454D]';
  }
};

const cycleStatus = (current: PickupStatus): PickupStatus => {
  const statuses: PickupStatus[] = ['Shipped', 'Delivered', 'Pending', 'Returned'];
  const idx = statuses.indexOf(current);
  return statuses[(idx + 1) % statuses.length];
};

export default function VendorPickups() {
  const [pickups, setPickups] = useState(mockPickups);

  const handleDelete = (id: string) => {
    setPickups(pickups.filter((p) => p.id !== id));
  };

  const handleStatusChange = (id: string) => {
    setPickups(
      pickups.map((p) => (p.id === id ? { ...p, status: cycleStatus(p.status) } : p))
    );
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Pickups
        </h2>
        <div className='flex flex-col sm:flex-row items-center gap-[12px]'>
          <div className='flex h-[36px] w-full sm:w-[250px] shrink-0 items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] cursor-pointer hover:border-[#848995] transition-colors'>
            <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[1.3] text-[#848995]'>
              Filter By Status
            </p>
            <ChevronDown size={16} className='text-[#848995]' />
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
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
            <div className='w-[180px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Customer Contact No
              </p>
            </div>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Destination
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Pickup Date
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
          {pickups.map((pickup) => (
            <div
              key={pickup.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[16px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='w-[100px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.id}
                </p>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.customer}
                </p>
              </div>
              <div className='w-[180px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.contactNo}
                </p>
              </div>
              <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.destination}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.pickupDate}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  onClick={() => handleStatusChange(pickup.id)}
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(pickup.status)
                  )}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>{pickup.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button
                    onClick={() => alert(`View Pickup ${pickup.id}`)}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='View Pickup'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => alert(`Edit Pickup ${pickup.id}`)}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='Edit Pickup'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(pickup.id)}
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Delete Pickup'
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
