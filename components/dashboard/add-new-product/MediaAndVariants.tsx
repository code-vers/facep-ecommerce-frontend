'use client';

import { Edit2, ImageUp, Trash2 } from 'lucide-react';

export default function MediaAndVariants() {
  return (
    <div className='flex flex-col gap-[24px] w-full'>
      {/* Main Product Image Section */}
      <div className='border border-[#e5e5e6] border-solid flex flex-col items-start relative shrink-0 w-full'>
        <div className="flex flex-col gap-4 md:gap-[24px] items-start p-4 md:p-[24px] relative shrink-0 w-full">
          <p className='font-semibold leading-[1.2] text-[20px] text-black'>Main Product Image</p>
          <div className='flex flex-col md:flex-row gap-[24px] w-full'>
          {/* Product Thumbnail */}
          <div className='flex flex-col gap-2 flex-1 w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>Product Thumbnail</p>
            <div className='border border-[#e5e5e6] border-dashed rounded-sm px-6 py-3 flex flex-col items-center justify-center gap-3 w-full bg-white h-[140px]'>
              <div className='size-9 bg-[#f9fafb] flex items-center justify-center rounded-full'>
                <ImageUp className='size-5 text-[#686f7d]' />
              </div>
              <div className='flex flex-col items-center gap-2'>
                <p className='text-[14px] text-[#42454d] font-normal'>
                  Drag and drop your Image here
                </p>
                <p className='text-[14px] text-[#42454d] font-normal'>or</p>
                <p className='text-[14px] text-[#165dd0] underline cursor-pointer'>
                  Upload from computer
                </p>
              </div>
            </div>
          </div>

          {/* Product Preview Images */}
          <div className='flex flex-col gap-2 flex-1 w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>
              Product Preview Images
            </p>
            <div className='border border-[#e5e5e6] border-dashed rounded-sm px-6 py-3 flex flex-col items-center justify-center gap-3 w-full bg-white h-[140px]'>
              <div className='size-9 bg-[#f9fafb] flex items-center justify-center rounded-full'>
                <ImageUp className='size-5 text-[#686f7d]' />
              </div>
              <div className='flex flex-col items-center gap-2'>
                <p className='text-[14px] text-[#42454d] font-normal'>
                  Drag and drop your Images here
                </p>
                <p className='text-[14px] text-[#42454d] font-normal'>or</p>
                <p className='text-[14px] text-[#165dd0] underline cursor-pointer'>
                  Upload from computer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Variants & Product Options Section */}
      <div className='border border-[#e5e5e6] border-solid flex flex-col items-start relative shrink-0 w-full'>
        <div className="flex flex-col gap-4 md:gap-[24px] items-start p-4 md:p-[24px] relative shrink-0 w-full">
          <p className='font-semibold leading-[1.2] text-[20px] text-black'>
            Variants & Product Options
          </p>

        {/* Toggle Variants */}
        <div className='flex items-center justify-between w-full'>
          <p className='font-normal leading-[1.2] text-[16px] text-black'>
            This product has variants?
          </p>
          <div className='relative inline-flex items-center cursor-pointer'>
            <div className='w-[36px] h-[20px] bg-[#f09000] rounded-full flex items-center p-[2px]'>
              <div className='w-[16px] h-[16px] bg-white rounded-full translate-x-[16px] transition-transform' />
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className='flex flex-col gap-2 w-full mt-2'>
          <p className='font-normal leading-[1.2] text-[14px] text-black'>Variants</p>
          <div className='flex flex-wrap items-center gap-4 md:gap-6'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-gray-300 text-[#f09000] focus:ring-[#f09000] accent-[#f09000]'
                defaultChecked
              />
              <span className='text-[14px] text-[#42454d]'>Color</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-gray-300 text-[#f09000] focus:ring-[#f09000] accent-[#f09000]'
                defaultChecked
              />
              <span className='text-[14px] text-[#42454d]'>Size</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-gray-300 text-[#f09000] focus:ring-[#f09000] accent-[#f09000]'
              />
              <span className='text-[14px] text-[#42454d]'>Storage</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-gray-300 text-[#f09000] focus:ring-[#f09000] accent-[#f09000]'
              />
              <span className='text-[14px] text-[#42454d]'>Material</span>
            </label>
            <button className='text-[14px] text-[#165dd0] font-normal hover:underline ml-2'>
              Add Variant +
            </button>
          </div>
        </div>

        {/* Variant Details Table */}
        <div className='border border-[#e5e5e6] rounded-sm w-full mt-4 flex flex-col overflow-hidden'>
          <div className='flex items-center justify-between p-4 border-b border-[#e5e5e6]'>
            <p className='font-semibold text-[16px] text-black'>Variant Details</p>
            <button className='text-[14px] text-[#165dd0] font-normal hover:underline'>
              Add Row +
            </button>
          </div>
          <div className='w-full overflow-x-auto'>
            <div className='min-w-[800px] w-full flex flex-col'>
              {/* Header */}
              <div className='bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-4 py-[9px]'>
                <div className='w-[60px] shrink-0 text-[14px] text-black'>Image</div>
                <div className='flex-1 text-[14px] text-black'>ID</div>
                <div className='flex-[1.5] text-[14px] text-black'>Color</div>
                <div className='flex-1 text-[14px] text-black'>Size</div>
                <div className='flex-1 text-[14px] text-black'>Price</div>
                <div className='flex-1 text-[14px] text-black'>Stock</div>
                <div className='w-[80px] shrink-0 text-[14px] text-black text-center'>Action</div>
              </div>

              {/* Rows */}
              {[
                { id: 'AV001', price: '$119.99', stock: '2400', size: 'Small' },
                { id: 'SP002', price: '$79.99', stock: '2400', size: 'Big' },
                { id: 'ZZ003', price: '$89.99', stock: '2400', size: 'Small' },
                { id: 'PL004', price: '$39.99', stock: '15', size: 'Small' },
                { id: 'MO005', price: '$69.99', stock: '10', size: 'Small' },
                { id: 'FF006', price: '$49.99', stock: '0', size: 'Small' },
              ].map((row, i) => (
                <div
                  key={i}
                  className='border-b border-[#e5e5e6] flex items-center px-4 py-2 hover:bg-gray-50'
                >
                  <div className='w-[60px] shrink-0'>
                    <div className='size-[24px] bg-gray-200 rounded-sm overflow-hidden border border-[#e5e5e6]'>
                      <img
                        src={`https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop&${i}`}
                        alt='variant'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                  <div className='flex-1 text-[12px] text-[#42454d]'>{row.id}</div>
                  <div className='flex-[1.5]'>
                    <div className='border border-[#e5e5e6] bg-[#f2f2f3] rounded-sm px-2 py-1 inline-flex items-center gap-2'>
                      <span className='text-[12px] text-[#42454d]'>#55667</span>
                      <div className='size-2 bg-pink-500 rounded-[1px]' />
                    </div>
                  </div>
                  <div className='flex-1 text-[12px] text-[#42454d]'>{row.size}</div>
                  <div className='flex-1 text-[12px] text-[#42454d]'>{row.price}</div>
                  <div className='flex-1 text-[12px] text-[#42454d]'>{row.stock}</div>
                  <div className='w-[80px] shrink-0 flex items-center justify-center gap-3 text-center'>
                    <Edit2 className='size-[14px] text-[#686f7d] cursor-pointer' />
                    <Trash2 className='size-[14px] text-[#cb1b1b] cursor-pointer' />
                  </div>
                </div>
              ))}

              {/* Add Input Row */}
              <div className='flex items-center px-4 py-3 bg-[#f9fafb]'>
                <div className='w-[60px] shrink-0'>
                  <div className='size-[24px] bg-white border border-dashed border-[#e5e5e6] flex items-center justify-center rounded-sm cursor-pointer'>
                    <span className='text-[16px] text-[#686f7d]'>+</span>
                  </div>
                </div>
                <div className='flex-1 pr-4'>
                  <input
                    type='text'
                    placeholder='ID'
                    className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white'
                  />
                </div>
                <div className='flex-[1.5] pr-4'>
                  <input
                    type='text'
                    placeholder='Color Hex Code'
                    className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white'
                  />
                </div>
                <div className='flex-1 pr-4'>
                  <input
                    type='text'
                    placeholder='Size'
                    className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white'
                  />
                </div>
                <div className='flex-1 pr-4'>
                  <input
                    type='text'
                    placeholder='Price'
                    className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white'
                  />
                </div>
                <div className='flex-1'>
                  <input
                    type='text'
                    placeholder='Stock'
                    className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white'
                  />
                </div>
                <div className='w-[80px] shrink-0 flex items-center justify-center gap-3 text-center'>
                  <Edit2 className='size-[14px] text-[#686f7d] cursor-pointer' />
                  <Trash2 className='size-[14px] text-[#cb1b1b] cursor-pointer' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
