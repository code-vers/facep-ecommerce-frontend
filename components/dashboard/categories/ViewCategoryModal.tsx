'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';

import { Category } from '@/lib/api/category';

interface ViewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function ViewCategoryModal({ isOpen, onClose, category }: ViewCategoryModalProps) {
  if (!isOpen || !category) return null;

  const displaySubcategories = category.subcategories.map(s => s.name);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='bg-white border border-[#e5e5e6] w-full max-w-200 rounded-md flex flex-col p-10 relative max-h-[90vh] overflow-y-auto shadow-xl'>
        {/* Close Button Overlay */}
        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-gray-500 hover:text-black cursor-pointer transition-colors'
        >
          <X className='w-6 h-6' />
        </button>

        <div className='border border-[#e5e5e6] flex flex-col gap-8 p-8'>
          {/* Header */}
          <div className='border-b border-[#e5e5e6] flex items-start justify-between pb-4 w-full'>
            <div className='flex flex-col gap-2'>
              <h2 className="font-['Open_Sans'] font-normal text-xl text-black leading-[1.2]">
                Category : {category.name}
              </h2>
              <p className="font-['Open_Sans'] font-normal text-base text-[#5A6573] leading-[1.2]">
                Subcategory : {category.subcategories.length}
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={cn(
                'border flex gap-2 items-center justify-center px-2.5 py-1 rounded-sm',
                category.status === 'Active'
                  ? 'bg-[#f0f4f2] border-[#e0ebe4] text-[#229a4e]'
                  : 'bg-[#FDE2E2] text-[#CB1B1B]',
              )}
            >
              <span className="font-['Open_Sans'] font-normal text-xs leading-[1.3]">
                {category.status}
              </span>
              <ChevronDown className='w-4 h-4 opacity-70' />
            </div>
          </div>

          <div className='flex flex-col gap-6 w-full'>
            {/* Subcategories Section */}
            <div className='flex flex-col gap-4'>
              <h3 className="font-['Open_Sans'] font-normal text-xl text-[#42454d] leading-[1.2] pb-2 border-b border-[#e5e5e6] w-max pr-6">
                Subcategory ({category.subcategories.length})
              </h3>

              {displaySubcategories.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-3 pt-2'>
                  {displaySubcategories.map((subcat, i) => (
                    <div key={`${subcat}-${i}`} className='flex gap-2 items-center'>
                      <div className='w-4 h-4 bg-[#f09000] rounded shrink-0' />
                      <span className="font-['Open_Sans'] font-normal text-sm text-[#344054] leading-[1.3] truncate">
                        {subcat}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-[#848995] text-sm italic'>No subcategories found.</p>
              )}
            </div>

            {/* Stats Footer */}
            <div className='flex flex-col gap-4 mt-4'>
              <p className="font-['Open_Sans'] font-normal text-2xl text-[#42454d] leading-[1.2]">
                Total Products : {category.products}
              </p>
              <p className="font-['Open_Sans'] font-normal text-2xl text-[#42454d] leading-[1.2]">
                Total Orders : {category.orders}
              </p>
              <p className="font-['Open_Sans'] font-normal text-2xl text-[#42454d] leading-[1.2]">
                Total Sales : {category.sales}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
