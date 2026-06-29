'use client';

import { ChevronDown, Edit2, Eye, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

const mockStores = [
  {
    id: 1,
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop',
    store: 'Plant House',
    category: 'Plant',
    revenue: '$20000',
    orders: 2400,
    products: 200,
    rating: 4,
    status: 'Active',
  },
  {
    id: 2,
    logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=64&auto=format&fit=crop',
    store: 'GadgetHub BD',
    category: 'Electronics',
    revenue: '$20000',
    orders: 2400,
    products: 300,
    rating: 4,
    status: 'Active',
  },
  {
    id: 3,
    logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=64&auto=format&fit=crop',
    store: 'SmartLife',
    category: 'Home essentials',
    revenue: '$20000',
    orders: 2400,
    products: 300,
    rating: 3,
    status: 'Active',
  },
  {
    id: 4,
    logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=64&auto=format&fit=crop',
    store: 'TechNest',
    category: 'Tech',
    revenue: '$200',
    orders: 15,
    products: 300,
    rating: 3,
    status: 'Disable',
  },
];

export default function StoreManagementTable() {
  return (
    <div className='w-full min-w-0 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full'>
        <h3 className='font-semibold text-[20px] text-black'>Stores</h3>

        <div className='flex items-center gap-4'>
          <div className='bg-white border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 py-2.5 flex items-center justify-between w-[200px] cursor-pointer'>
            <span className='text-[13px] text-[#848995]'>Filter by status</span>
            <ChevronDown size={16} className='text-black' />
          </div>

          <Link href='/dashboard/add-new-store'>
            <button className='bg-[#f09000] hover:bg-[#e08600] text-white rounded-[2px] h-[36px] px-4 flex items-center justify-center gap-2 transition-colors'>
              <span className='text-[14px] font-medium'>Add New Store</span>
              <PlusCircle size={16} />
            </button>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className='w-full flex flex-col border border-[#e5e5e6] rounded-[2px] overflow-hidden'>
        <div className='w-full overflow-x-auto'>
          <div className='min-w-[900px] w-full flex flex-col'>
            {/* Table Header */}
            <div className='bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[9px]'>
              <div className='w-[80px] shrink-0 text-[13px] font-medium text-black px-2'>Logo</div>
              <div className='flex-[2] text-[13px] font-medium text-black px-2'>Store</div>
              <div className='flex-[2] text-[13px] font-medium text-black px-2'>Category</div>
              <div className='flex-[1.5] text-[13px] font-medium text-black px-2'>Revenue</div>
              <div className='flex-[1.5] text-[13px] font-medium text-black px-2'>Orders</div>
              <div className='flex-[1.5] text-[13px] font-medium text-black px-2'>Products</div>
              <div className='flex-[1.5] text-[13px] font-medium text-black px-2'>Rating</div>
              <div className='w-[120px] shrink-0 text-[13px] font-medium text-black px-2'>
                Status
              </div>
              <div className='w-[100px] shrink-0 text-[13px] font-medium text-black px-2 text-center'>
                Action
              </div>
            </div>

            {/* Table Rows */}
            {mockStores.map((row) => (
              <div
                key={row.id}
                className='border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-2 hover:bg-gray-50'
              >
                {/* Logo */}
                <div className='w-[80px] shrink-0 px-2 flex items-center'>
                  <div className='size-10 bg-white overflow-hidden rounded-[2px] border border-[#e5e5e6]'>
                    <img src={row.logo} alt='Store logo' className='w-full h-full object-cover' />
                  </div>
                </div>

                {/* Store */}
                <div className='flex-[2] text-[12px] text-[#42454d] px-2 truncate'>{row.store}</div>

                {/* Category */}
                <div className='flex-[2] text-[12px] text-[#42454d] px-2 truncate'>
                  {row.category}
                </div>

                {/* Revenue */}
                <div className='flex-[1.5] text-[12px] text-[#42454d] px-2'>{row.revenue}</div>

                {/* Orders */}
                <div className='flex-[1.5] text-[12px] text-[#42454d] px-2'>{row.orders}</div>

                {/* Products */}
                <div className='flex-[1.5] text-[12px] text-[#42454d] px-2'>{row.products}</div>

                {/* Rating */}
                <div className='flex-[1.5] text-[12px] text-[#42454d] px-2 flex items-center gap-[2px]'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-[12px] ${star <= row.rating ? 'text-[#f09000]' : 'text-gray-300'}`}
                    >
                      {star <= row.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>

                {/* Status */}
                <div className='w-[120px] shrink-0 px-2 flex items-center'>
                  {row.status === 'Active' && (
                    <div className='bg-[#e7f4eb] border border-[#229a4e] rounded-[2px] px-2 py-1 flex items-center justify-between w-full cursor-pointer'>
                      <span className='text-[12px] text-[#229a4e]'>Active</span>
                      <ChevronDown size={14} className='text-[#229a4e]' />
                    </div>
                  )}
                  {row.status === 'Disable' && (
                    <div className='bg-[#fbe8e8] border border-[#cb1b1b] rounded-[2px] px-2 py-1 flex items-center justify-between w-full cursor-pointer'>
                      <span className='text-[12px] text-[#cb1b1b]'>Disable</span>
                      <ChevronDown size={14} className='text-[#cb1b1b]' />
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className='w-[100px] shrink-0 px-2 flex items-center justify-center gap-3'>
                  <button className='text-[#42454d] hover:text-black transition-colors'>
                    <Eye size={16} />
                  </button>
                  <button className='text-[#42454d] hover:text-black transition-colors'>
                    <Edit2 size={16} />
                  </button>
                  <button className='text-[#cb1b1b] hover:text-red-700 transition-colors'>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
