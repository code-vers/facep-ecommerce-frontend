'use client';

import React, { useState } from 'react';
import { ChevronDown, Eye, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import Pagination from '@/components/dashboard/orders/Pagination';
import AddCategoryModal, { CategoryStatus } from './AddCategoryModal';
import { cn } from '@/lib/utils';

interface CategoryData {
  id: string;
  name: string;
  subcategories: number;
  products: number;
  orders: number;
  sales: string;
  status: CategoryStatus;
}

const mockCategories: CategoryData[] = [
  {
    id: '1',
    name: 'Plant',
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: '$ 200',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Electronics',
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: '$ 300',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Electronics',
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: '$ 300',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Electronics',
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: '$ 300',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Electronics',
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: '$ 300',
    status: 'Disable',
  },
  {
    id: '6',
    name: 'Electronics',
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: '$ 300',
    status: 'Disable',
  },
];

const getStatusStyles = (status: CategoryStatus) => {
  if (status === 'Active') {
    return 'bg-[#E0EBE4] text-[#229A4E]';
  }
  return 'bg-[#FDE2E2] text-[#CB1B1B]';
};

export default function CategoriesTable() {
  const [categories, setCategories] = useState<CategoryData[]>(mockCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCategory = (data: { name: string; subcategories: number; status: CategoryStatus }) => {
    const newCategory: CategoryData = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      subcategories: data.subcategories,
      products: 0,
      orders: 0,
      sales: '$ 0',
      status: data.status,
    };
    setCategories([newCategory, ...categories]);
    toast.success(`Category "${data.name}" created successfully!`);
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Categories
        </h2>
        <div className='flex flex-col sm:flex-row items-center gap-[12px]'>
          <div className='flex h-[36px] w-full sm:w-[250px] shrink-0 items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
            <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[1.3] text-[#848995]'>
              Filter By Status
            </p>
            <ChevronDown size={16} className='text-[#848995]' />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className='flex h-[36px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'
          >
            <span className='text-[14px] font-normal text-black'>Add New Category</span>
            <PlusCircle size={16} className='text-black' />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
          
          {/* Table Header row */}
          <div className='flex h-[40px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='min-w-[150px] flex-[1.5_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Categories
              </p>
            </div>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Subcategories
              </p>
            </div>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Products
              </p>
            </div>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Orders
              </p>
            </div>
            <div className='flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Sales
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
          {categories.map((category) => (
            <div
              key={category.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[16px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='min-w-[150px] flex-[1.5_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.name}
                </p>
              </div>
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.subcategories}
                </p>
              </div>
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.products}
                </p>
              </div>
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.orders}
                </p>
              </div>
              <div className='flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.sales}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(category.status)
                  )}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>{category.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='View Category'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='Edit Category'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Delete Category'
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

      {/* Modal */}
      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddCategory={handleAddCategory} 
      />
    </div>
  );
}
