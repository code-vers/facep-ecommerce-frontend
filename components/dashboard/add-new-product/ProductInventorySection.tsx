'use client';

import { ChevronDown } from 'lucide-react';
import { useProductFormStore } from '../../../store/useProductFormStore';

export default function ProductInventorySection() {
  const store = useProductFormStore();

  return (
    <div className='flex flex-col gap-[18px] items-start w-full relative shrink-0'>
      <h4 className='font-semibold leading-[1.2] text-[20px] text-black font-sans'>
        Product Inventory
      </h4>

      <div className='flex flex-col gap-[24px] w-full'>
        {/* Row 1: ID, Stock Quantity, Stock Status */}
        <div className='flex flex-col md:flex-row gap-4 md:gap-[24px] w-full'>
          <div className='flex flex-col gap-[8px] flex-1 w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>SKU (ID)</p>
            <div className='bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full'>
              <input
                type='text'
                value={store.sku}
                onChange={(e) => store.setField('sku', e.target.value)}
                placeholder='Product SKU'
                className='flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full'
              />
            </div>
          </div>

          <div className='flex flex-col gap-[8px] flex-1 w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>Stock Quantity</p>
            <div className='bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full'>
              <input
                type='number'
                value={store.stockQuantity}
                onChange={(e) =>
                  store.setField('stockQuantity', e.target.value ? Number(e.target.value) : '')
                }
                placeholder='0'
                className='flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full'
              />
            </div>
          </div>

          <div className='flex flex-col gap-[8px] flex-1 w-full relative'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>Stock Status</p>
            <div className='bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full'>
              <select
                value={store.stockStatus}
                onChange={(e) =>
                  store.setField('stockStatus', e.target.value as 'AVAILABLE' | 'OUT_OF_STOCK')
                }
                className='flex-1 bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6 w-full'
              >
                <option value='AVAILABLE'>Available</option>
                <option value='OUT_OF_STOCK'>Out of Stock</option>
              </select>
              <ChevronDown className='size-4 text-[#848995] absolute right-[12px] pointer-events-none' />
            </div>
          </div>
        </div>

        {/* Row 2: Low Stock Alert Quantity, Minimum Order Quantity, Maximum Order Quantity */}
        <div className='flex flex-col md:flex-row gap-4 md:gap-[24px] w-full'>
          <div className='flex flex-col gap-[8px] flex-1 w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>
              Low Stock Alert Quantity
            </p>
            <div className='bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full'>
              <input
                type='number'
                value={store.lowStockAlertQuantity}
                onChange={(e) =>
                  store.setField(
                    'lowStockAlertQuantity',
                    e.target.value ? Number(e.target.value) : '',
                  )
                }
                placeholder='0'
                className='flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full'
              />
            </div>
          </div>

          <div className='flex flex-col gap-[8px] flex-1 w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>
              Minimum Order Quantity
            </p>
            <div className='bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full'>
              <input
                type='number'
                value={store.minOrderQuantity}
                onChange={(e) =>
                  store.setField('minOrderQuantity', e.target.value ? Number(e.target.value) : '')
                }
                placeholder='1'
                className='flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full'
              />
            </div>
          </div>

          <div className='flex flex-col gap-[8px] flex-1 w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>
              Maximum Order Quantity
            </p>
            <div className='bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full'>
              <input
                type='number'
                value={store.maxOrderQuantity}
                onChange={(e) =>
                  store.setField('maxOrderQuantity', e.target.value ? Number(e.target.value) : '')
                }
                placeholder='100'
                className='flex-1 bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] w-full'
              />
            </div>
          </div>
        </div>

        {/* Row 3: Inventory Managed By, Warehouse Location */}
        <div className='flex flex-col md:flex-row gap-4 md:gap-[24px] w-full'>
          <div className='flex flex-col gap-[24px] flex-[0.66] w-full'>
            <div className='flex flex-col md:flex-row gap-4 md:gap-[24px] w-full'>
              <div className='flex flex-col gap-[8px] flex-1 w-full relative'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>
                  Inventory Managed By
                </p>
                <div className='bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full'>
                  <select
                    value={store.inventoryManagedBy}
                    onChange={(e) => store.setField('inventoryManagedBy', e.target.value)}
                    className='flex-1 bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6 w-full'
                  >
                    <option value=''>Select Manager</option>
                    <option value='John Doe'>John Doe</option>
                    <option value='Jane Smith'>Jane Smith</option>
                  </select>
                  <ChevronDown className='size-4 text-[#848995] absolute right-[12px] pointer-events-none' />
                </div>
              </div>

              <div className='flex flex-col gap-[8px] flex-1 w-full relative'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>
                  Warehouse Location
                </p>
                <div className='bg-white border border-[#e5e5e6] flex items-center overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full'>
                  <select
                    value={store.warehouseLocation}
                    onChange={(e) => store.setField('warehouseLocation', e.target.value)}
                    className='flex-1 bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6 w-full'
                  >
                    <option value=''>Select Location</option>
                    <option value='Texas'>Texas</option>
                    <option value='California'>California</option>
                    <option value='New York'>New York</option>
                  </select>
                  <ChevronDown className='size-4 text-[#848995] absolute right-[12px] pointer-events-none' />
                </div>
              </div>
            </div>
          </div>
          <div className='hidden md:flex flex-[0.33]'></div>
        </div>
      </div>
    </div>
  );
}
