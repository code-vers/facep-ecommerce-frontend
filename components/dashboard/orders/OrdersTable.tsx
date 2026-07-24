'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, Eye, FileDown, Pencil, Trash2 } from 'lucide-react';

type OrderStatus = 'Shipped' | 'Delivered' | 'Processing' | 'Pending' | 'Cancelled';

interface OrderData {
  id: string;
  customer: string;
  contactNo: string;
  product: string;
  amount: string;
  date: string;
  status: OrderStatus;
  store: string;
}

const mockOrders: OrderData[] = [
  {
    id: 'GH201',
    customer: 'John Smith',
    contactNo: '555-901-2345',
    product: 'Golden Barrel, Snake Plant, Orchid',
    amount: '$119.99',
    date: '2024-01-05',
    status: 'Shipped',
    store: 'Plant House',
  },
  {
    id: 'RT234',
    customer: 'Alice Johnson',
    contactNo: '555-234-5678',
    product: 'ZZ Plant, Aloe Vera, Peace Lily',
    amount: '$79.99',
    date: '2024-02-12',
    status: 'Delivered',
    store: 'Technet Au',
  },
  {
    id: 'YU789',
    customer: 'Robert Williams',
    contactNo: '555-345-6789',
    product: 'Monstera, Fiddle Leaf Fig, Bird of Paradise',
    amount: '$89.99',
    date: '2024-03-20',
    status: 'Processing',
    store: 'Technet Au',
  },
  {
    id: 'KJ345',
    customer: 'Emily Brown',
    contactNo: '555-456-7890',
    product: 'String of Pearls, Prayer Plant, Calathea',
    amount: '$39.99',
    date: '2024-04-01',
    status: 'Pending',
    store: 'Technet Au',
  },
  {
    id: 'VC678',
    customer: 'David Garcia',
    contactNo: '555-567-8901',
    product: 'Cactus, Lily, Bougainvillea',
    amount: '$69.99',
    date: '2024-05-15',
    status: 'Shipped',
    store: 'Technet Au',
  },
  {
    id: 'ZX901',
    customer: 'Linda Rodriguez',
    contactNo: '555-678-9012',
    product: 'Succulent Mix, Air Plant, Venus Fly Trap',
    amount: '$49.99',
    date: '2024-06-22',
    status: 'Cancelled',
    store: 'Technet Au',
  },
];

const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case 'Shipped':
      return 'bg-[#E0EBE4] text-[#229A4E]';
    case 'Delivered':
      return 'bg-[#E5E5E6] text-[#42454D]';
    case 'Processing':
      return 'bg-[#E6F0FA] text-[#165DD0]';
    case 'Pending':
      return 'bg-[#FDF5D3] text-[#F09000]';
    case 'Cancelled':
      return 'bg-[#ECDFDF] text-[#CB1B1B]';
    default:
      return 'bg-[#E5E5E6] text-[#42454D]';
  }
};

export default function OrdersTable() {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-6 rounded-lg border border-[#E5E5E6] p-4 md:p-4'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6'>
        <div className='flex min-w-0 flex-[1_0_0] items-center justify-between'>
          <p className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
            Orders
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex h-9 w-full sm:w-62.5 shrink-0 items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white pl-3 pr-3 py-2.5'>
            <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[1.3] text-[#848995]'>
              Filter By Status
            </p>
            <ChevronDown size={16} className='text-[#848995]' />
          </div>
          {isAdmin && (
            <button className='flex h-9 shrink-0 items-center justify-center gap-2 rounded-xs border border-[#E5E5E6] bg-white px-3 transition-colors hover:bg-gray-50'>
              <span className='text-[14px] font-normal leading-[1.2] text-[#42454D]'>
                Export CSV
              </span>
              <FileDown size={16} className='text-[#42454D]' />
            </button>
          )}
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-250 flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex w-full shrink-0 items-center bg-[#F2F2F3] border-t border-b border-[#E5E5E6] h-8.5'>
            <div className='w-25 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Order ID
              </p>
            </div>
            <div className='w-37.5 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Customer
              </p>
            </div>
            {isAdmin ? (
              <div className='w-37.5 shrink-0 px-2'>
                <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                  Store
                </p>
              </div>
            ) : (
              <div className='w-37.5 shrink-0 px-2'>
                <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                  Customer Contact No
                </p>
              </div>
            )}
            <div className='min-w-37.5 flex-[1_0_0] px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Product
              </p>
            </div>
            <div className='w-25 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Amount
              </p>
            </div>
            {!isAdmin && (
              <div className='w-30 shrink-0 px-2'>
                <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                  Date
                </p>
              </div>
            )}
            <div className='w-30 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Status
              </p>
            </div>
            <div className='w-25 shrink-0 px-2 text-center'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {mockOrders.map((order, idx) => (
            <div
              key={idx}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] h-12 hover:bg-gray-50 transition-colors'
            >
              <div className='w-25 shrink-0 px-2'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {order.id}
                </p>
              </div>
              <div className='w-37.5 shrink-0 px-2'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {order.customer}
                </p>
              </div>
              {isAdmin ? (
                <div className='w-37.5 shrink-0 px-2'>
                  <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                    {order.store}
                  </p>
                </div>
              ) : (
                <div className='w-37.5 shrink-0 px-2'>
                  <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                    {order.contactNo}
                  </p>
                </div>
              )}
              <div className='min-w-37.5 flex-[1_0_0] px-2'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {order.product}
                </p>
              </div>
              <div className='w-25 shrink-0 px-2'>
                <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                  {order.amount}
                </p>
              </div>
              {!isAdmin && (
                <div className='w-30 shrink-0 px-2'>
                  <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                    {order.date}
                  </p>
                </div>
              )}
              <div className='w-30 shrink-0 px-2'>
                {isAdmin ? (
                  <div
                    className={`inline-flex h-6 items-center justify-between gap-2 rounded-xs px-2 ${getStatusStyles(order.status)}`}
                  >
                    <span className='text-[12px] font-medium leading-[1.2]'>{order.status}</span>
                    <ChevronDown size={12} />
                  </div>
                ) : (
                  <div
                    className={`flex h-6 w-20 items-center justify-center rounded-full ${getStatusStyles(order.status)}`}
                  >
                    <span className='text-[12px] font-medium leading-[1.2]'>{order.status}</span>
                  </div>
                )}
              </div>
              <div className='w-25 shrink-0 px-2'>
                <div className='flex items-center justify-center gap-3'>
                  <button className='text-[#42454D] hover:text-black transition-colors'>
                    <Eye size={14} />
                  </button>
                  <button className='text-[#42454D] hover:text-black transition-colors'>
                    <Pencil size={14} />
                  </button>
                  <button className='text-[#CB1B1B] hover:text-red-700 transition-colors'>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
