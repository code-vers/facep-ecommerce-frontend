'use client';

import { CirclePlus, Eye, Pencil, Trash2 } from 'lucide-react';

const mockCouriers = [
  {
    id: 1,
    name: 'FedEx Express',
    rate: '$8.50',
    delivery: '2-3 days',
    shipments: '3,245',
  },
  {
    id: 2,
    name: 'FedEx Express',
    rate: '$8.50',
    delivery: '2-3 days',
    shipments: '3,245',
  },
  {
    id: 3,
    name: 'FedEx Express',
    rate: '$8.50',
    delivery: '2-3 days',
    shipments: '3,245',
  },
  {
    id: 4,
    name: 'FedEx Express',
    rate: '$8.50',
    delivery: '2-3 days',
    shipments: '3,245',
  },
  {
    id: 5,
    name: 'FedEx Express',
    rate: '$8.50',
    delivery: '2-3 days',
    shipments: '3,245',
  },
];

export default function CourierPartners() {
  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px]'>
      {/* Header */}
      <div className='flex w-full flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <p className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Courier Partners
        </p>
        <button className='flex h-[36px] items-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'>
          <span className='text-[14px] font-normal text-black'>Add New Courier Partner</span>
          <CirclePlus size={16} className='text-black' />
        </button>
      </div>

      {/* Cards Grid */}
      <div className='grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {mockCouriers.map((courier, idx) => (
          <div
            key={idx}
            className='flex flex-col gap-[16px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] hover:shadow-sm transition-shadow'
          >
            {/* Mock Logo */}
            <div className='flex items-baseline'>
              <span className='text-[18px] font-bold text-[#4D148C] leading-none'>Fed</span>
              <span className='text-[18px] font-bold text-[#FF6600] leading-none'>Ex</span>
              <span className='text-[10px] font-bold text-[#FF6600] leading-none ml-[1px] align-top'>
                ®
              </span>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-[6px]'>
              <p className='text-[16px] font-normal text-black'>{courier.name}</p>
              <p className='text-[13px] font-normal text-[#42454D]'>
                Rate: {courier.rate} per shipment
              </p>
              <p className='text-[13px] font-normal text-[#42454D]'>
                Delivery: {courier.delivery}
              </p>
              <p className='text-[13px] font-normal text-[#42454D]'>
                Shipments: {courier.shipments}
              </p>
            </div>

            {/* Actions */}
            <div className='mt-auto flex items-center gap-[8px] pt-[8px]'>
              <button
                className='flex h-[32px] w-[32px] items-center justify-center rounded-[2px] border border-[#E5E5E6] text-[#42454D] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300'
                aria-label='View courier partner'
              >
                <Eye size={16} />
              </button>
              <button
                className='flex h-[32px] w-[32px] items-center justify-center rounded-[2px] border border-[#E5E5E6] text-[#42454D] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300'
                aria-label='Edit courier partner'
              >
                <Pencil size={16} />
              </button>
              <button
                className='flex h-[32px] w-[32px] items-center justify-center rounded-[2px] border border-[#FCA5A5] text-[#CB1B1B] transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-300'
                aria-label='Delete courier partner'
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
