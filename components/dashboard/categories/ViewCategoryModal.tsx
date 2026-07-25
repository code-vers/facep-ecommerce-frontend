'use client';

import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryStatus } from './AddCategoryModal';

interface CategoryData {
  id: string;
  name: string;
  subcategories: number;
  products: number;
  orders: number;
  sales: string;
  status: CategoryStatus;
}

interface ViewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryData | null;
}

const mockSubcategories = [
  'Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics',
  'Furniture', 'Furniture', 'Furniture', 'Furniture', 'Furniture',
  'Clothing', 'Clothing', 'Clothing', 'Clothing', 'Clothing',
  'Appliance', 'Appliance', 'Appliance', 'Appliance', 'Appliance'
];

export default function ViewCategoryModal({ isOpen, onClose, category }: ViewCategoryModalProps) {
  if (!isOpen || !category) return null;

  // Use the count from the category to determine how many mock subcategories to show
  // Fallback to a minimum of 0 and max of our mock list
  const displaySubcategories = mockSubcategories.slice(0, Math.min(category.subcategories, mockSubcategories.length));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-[#e5e5e6] w-full max-w-[800px] rounded-[6px] flex flex-col p-[40px] relative max-h-[90vh] overflow-y-auto shadow-xl">
        
        {/* Close Button Overlay */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="border border-[#e5e5e6] flex flex-col gap-[32px] p-[32px]">
          
          {/* Header */}
          <div className="border-b border-[#e5e5e6] flex items-start justify-between pb-[16px] w-full">
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-['Open_Sans'] font-normal text-[20px] text-black leading-[1.2]">
                Category : {category.name}
              </h2>
              <p className="font-['Open_Sans'] font-normal text-[16px] text-[#5A6573] leading-[1.2]">
                Subcategory : {category.subcategories}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className={cn(
              "border flex gap-[8px] items-center justify-center px-[10px] py-[4px] rounded-[2px]",
              category.status === 'Active' 
                ? "bg-[#f0f4f2] border-[#e0ebe4] text-[#229a4e]" 
                : "bg-[#FDE2E2] border-[#FAD4D4] text-[#CB1B1B]"
            )}>
              <span className="font-['Open_Sans'] font-normal text-[12px] leading-[1.3]">
                {category.status}
              </span>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </div>
          </div>

          <div className="flex flex-col gap-[24px] w-full">
            
            {/* Subcategories Section */}
            <div className="flex flex-col gap-[16px]">
              <h3 className="font-['Open_Sans'] font-normal text-[20px] text-[#42454d] leading-[1.2] pb-[8px] border-b border-[#e5e5e6] w-max pr-[24px]">
                Subcategory ({category.subcategories})
              </h3>
              
              {displaySubcategories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-[16px] gap-x-[12px] pt-[8px]">
                  {displaySubcategories.map((subcat, i) => (
                    <div key={`${subcat}-${i}`} className="flex gap-[8px] items-center">
                      <div className="w-[16px] h-[16px] bg-[#f09000] rounded-[4px] shrink-0" />
                      <span className="font-['Open_Sans'] font-normal text-[14px] text-[#344054] leading-[1.3] truncate">
                        {subcat}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#848995] text-[14px] italic">No subcategories found.</p>
              )}
            </div>

            {/* Stats Footer */}
            <div className="flex flex-col gap-[16px] mt-[16px]">
              <p className="font-['Open_Sans'] font-normal text-[24px] text-[#42454d] leading-[1.2]">
                Total Products : {category.products}
              </p>
              <p className="font-['Open_Sans'] font-normal text-[24px] text-[#42454d] leading-[1.2]">
                Total Orders : {category.orders}
              </p>
              <p className="font-['Open_Sans'] font-normal text-[24px] text-[#42454d] leading-[1.2]">
                Total Sales : {category.sales}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
