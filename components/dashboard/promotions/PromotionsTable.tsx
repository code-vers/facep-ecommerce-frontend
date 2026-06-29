'use client';

import React from 'react';
import { ChevronDown, Edit2, Trash2, Image as ImageIcon, Eye } from 'lucide-react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const mockPromotions = [
  {
    id: 'AV001',
    name: 'Aloe Vera',
    category: 'Plant',
    basePrice: '$119.99',
    discountedPrice: '$500',
    discount: '--',
    freeShipping: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
  {
    id: 'SP002',
    name: 'Snake Plant',
    category: 'Plant',
    basePrice: '$79.99',
    discountedPrice: '$50',
    discount: '--',
    freeShipping: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
  {
    id: 'ZZ003',
    name: 'ZZ Plant',
    category: 'Cactus',
    basePrice: '$89.99',
    discountedPrice: '$60',
    discount: '--',
    freeShipping: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
  {
    id: 'PL004',
    name: 'Peace Lily',
    category: 'Cactus',
    basePrice: '$39.99',
    discountedPrice: '--',
    discount: '10%',
    freeShipping: true,
    status: 'Disable',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
  {
    id: 'MO005',
    name: 'Monstera',
    category: 'Cactus',
    basePrice: '$69.99',
    discountedPrice: '--',
    discount: '10%',
    freeShipping: false,
    status: 'Disable',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
];

export default function PromotionsTable() {
  return (
    <div className="flex flex-col items-center relative size-full bg-white gap-6">
      <div className="border border-[#e5e5e6] border-solid flex flex-col gap-0 items-start relative rounded-sm w-full bg-white pb-0">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-[24px] items-start md:items-center justify-between relative w-full p-4 md:px-[24px] md:py-[16px]">
          <p className="font-semibold leading-[1.2] text-[20px] text-black">
            Ongoing Deals and Discounts
          </p>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="bg-white border border-[#e5e5e6] flex h-[36px] items-center px-[12px] py-[10px] rounded-[2px] w-full md:w-[250px] relative cursor-pointer">
              <p className="flex-1 font-normal leading-[1.3] text-[14px] text-[#848995]">
                Filter By Status
              </p>
              <ChevronDown className="size-4 text-[#848995] shrink-0" />
            </div>
            
            <button className="font-normal leading-[1.2] text-[14px] text-[#165dd0] hover:underline shrink-0 whitespace-nowrap">
              Add Row +
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full flex flex-col overflow-hidden border-t border-[#e5e5e6]">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1200px] w-full flex flex-col">
              
              {/* Table Header */}
              <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-6 py-[12px]">
                <div className="w-[80px] shrink-0 text-[14px] text-[#42454d] font-normal">Image</div>
                <div className="w-[100px] shrink-0 text-[14px] text-[#42454d] font-normal">ID</div>
                <div className="flex-[1.5] text-[14px] text-[#42454d] font-normal">Name</div>
                <div className="flex-1 text-[14px] text-[#42454d] font-normal">Category</div>
                <div className="flex-1 text-[14px] text-[#42454d] font-normal">Base Price</div>
                <div className="flex-1 text-[14px] text-[#42454d] font-normal">Discounted Price</div>
                <div className="w-[100px] shrink-0 text-[14px] text-[#42454d] font-normal">% Discount</div>
                <div className="w-[100px] shrink-0 text-[14px] text-[#42454d] font-normal text-center">Free Shipping</div>
                <div className="w-[120px] shrink-0 text-[14px] text-[#42454d] font-normal text-center">Status</div>
                <div className="w-[100px] shrink-0 text-[14px] text-[#42454d] font-normal text-center">Action</div>
              </div>

              {/* Table Rows */}
              {mockPromotions.map((row, i) => (
                <div key={i} className="border-b border-[#e5e5e6] flex items-center px-6 py-3 hover:bg-gray-50">
                  
                  {/* Image */}
                  <div className="w-[80px] shrink-0">
                    <div className="size-[40px] bg-white overflow-hidden rounded-sm border border-[#e5e5e6]">
                      <img src={row.image} alt="Product" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  {/* ID */}
                  <div className="w-[100px] shrink-0 text-[13px] text-[#42454d]">{row.id}</div>
                  
                  {/* Name */}
                  <div className="flex-[1.5] text-[13px] text-[#42454d]">{row.name}</div>
                  
                  {/* Category */}
                  <div className="flex-1 text-[13px] text-[#42454d]">{row.category}</div>
                  
                  {/* Base Price */}
                  <div className="flex-1 text-[13px] text-[#42454d]">{row.basePrice}</div>
                  
                  {/* Discounted Price */}
                  <div className="flex-1 text-[13px] text-[#42454d]">{row.discountedPrice}</div>
                  
                  {/* % Discount */}
                  <div className="w-[100px] shrink-0 text-[13px] text-[#42454d]">{row.discount}</div>

                  {/* Free Shipping */}
                  <div className="w-[100px] shrink-0 flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="size-4 rounded-[2px] border-gray-300 text-[#f09000] focus:ring-[#f09000] accent-[#f09000]"
                      defaultChecked={row.freeShipping} 
                    />
                  </div>
                  
                  {/* Status */}
                  <div className="w-[120px] shrink-0 flex items-center justify-center">
                    <div 
                      className={`inline-flex items-center justify-between gap-2 border rounded-[2px] px-[8px] py-[4px] w-[75px] ${
                        row.status === 'Active' 
                          ? 'border-[#c6e5d0] bg-[#eef8f0] text-[#229a4e]' 
                          : 'border-[#d0e1ff] bg-[#f0f5ff] text-[#165dd0]'
                      }`}
                    >
                      <span className="text-[12px]">{row.status}</span>
                      <ChevronDown className="size-3 shrink-0" />
                    </div>
                  </div>
                  
                  {/* Action */}
                  <div className="w-[100px] shrink-0 flex items-center justify-center gap-3">
                    <Eye className="size-[16px] text-[#686f7d] cursor-pointer hover:text-black" />
                    <Edit2 className="size-[14px] text-[#686f7d] cursor-pointer hover:text-black" />
                    <Trash2 className="size-[14px] text-[#cb1b1b] cursor-pointer hover:text-red-700" />
                  </div>
                  
                </div>
              ))}

              {/* Add Input Row */}
              <div className="flex items-center px-6 py-4 bg-white">
                {/* Image Placeholder */}
                <div className="w-[80px] shrink-0">
                  <div className="size-[40px] bg-white border border-[#e5e5e6] border-solid flex items-center justify-center rounded-sm cursor-pointer">
                    <ImageIcon className="size-5 text-[#848995]" />
                  </div>
                </div>
                
                {/* ID Input */}
                <div className="w-[100px] shrink-0 pr-4">
                  <div className="relative w-full">
                    <input type="text" placeholder="ID" className="w-full bg-white border border-[#e5e5e6] rounded-[2px] pl-3 pr-8 py-2 text-[13px] text-black outline-none placeholder:text-[#848995]" />
                    <ChevronDown className="size-4 text-[#848995] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                
                {/* Name Input */}
                <div className="flex-[1.5] pr-4">
                  <div className="relative w-full">
                    <input type="text" placeholder="Product Name" className="w-full bg-white border border-[#e5e5e6] rounded-[2px] pl-3 pr-8 py-2 text-[13px] text-black outline-none placeholder:text-[#848995]" />
                    <ChevronDown className="size-4 text-[#848995] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                
                {/* Category Input */}
                <div className="flex-1 pr-4">
                  <div className="relative w-full">
                    <input type="text" placeholder="Product Category" className="w-full bg-white border border-[#e5e5e6] rounded-[2px] pl-3 pr-8 py-2 text-[13px] text-black outline-none placeholder:text-[#848995]" />
                    <ChevronDown className="size-4 text-[#848995] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                
                {/* Base Price Input */}
                <div className="flex-1 pr-4">
                  <input type="text" placeholder="Base Price" className="w-full bg-white border border-[#e5e5e6] rounded-[2px] px-3 py-2 text-[13px] text-black outline-none placeholder:text-[#848995]" />
                </div>
                
                {/* Discounted Price Input */}
                <div className="flex-1 pr-4">
                  <input type="text" placeholder="Discounted Price" className="w-full bg-white border border-[#e5e5e6] rounded-[2px] px-3 py-2 text-[13px] text-black outline-none placeholder:text-[#848995]" />
                </div>
                
                {/* % Discount Input */}
                <div className="w-[100px] shrink-0 pr-4">
                  <input type="text" placeholder="% Discount" className="w-full bg-white border border-[#e5e5e6] rounded-[2px] px-3 py-2 text-[13px] text-black outline-none placeholder:text-[#848995]" />
                </div>

                {/* Free Shipping */}
                <div className="w-[100px] shrink-0 flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="size-4 rounded-[2px] border-gray-300 text-[#f09000] focus:ring-[#f09000] accent-[#f09000]"
                  />
                </div>
                
                {/* Status Input/Select */}
                <div className="w-[120px] shrink-0 flex justify-center pl-2">
                  <div className="relative inline-flex">
                    <div className="inline-flex items-center justify-between gap-2 border border-[#c6e5d0] bg-[#eef8f0] text-[#229a4e] rounded-[2px] px-[8px] py-[4px] w-[75px]">
                      <span className="text-[12px]">Active</span>
                      <ChevronDown className="size-3 shrink-0" />
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="w-[100px] shrink-0 flex items-center justify-center gap-3">
                  <Eye className="size-[16px] text-[#686f7d] cursor-pointer hover:text-black" />
                  <Edit2 className="size-[14px] text-[#686f7d] cursor-pointer hover:text-black" />
                  <Trash2 className="size-[14px] text-[#cb1b1b] cursor-pointer hover:text-red-700" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1 mt-2">
        <button className="flex items-center gap-1 px-3 py-1 text-[14px] text-[#848995] hover:text-black disabled:opacity-50" disabled>
          <ChevronLeft className="size-4" />
          Previous
        </button>
        <button className="size-8 flex items-center justify-center rounded-[4px] bg-[#f2f2f3] text-[14px] text-black font-medium">
          1
        </button>
        <button className="size-8 flex items-center justify-center rounded-[4px] text-[14px] text-[#42454d] hover:bg-gray-50">
          2
        </button>
        <button className="size-8 flex items-center justify-center rounded-[4px] text-[14px] text-[#42454d] hover:bg-gray-50">
          3
        </button>
        <button className="size-8 flex items-center justify-center rounded-[4px] text-[14px] text-[#42454d] hover:bg-gray-50">
          4
        </button>
        <div className="size-8 flex items-center justify-center text-[#848995]">
          <MoreHorizontal className="size-4" />
        </div>
        <button className="flex items-center gap-1 px-3 py-1 text-[14px] text-black hover:bg-gray-50 rounded-[4px]">
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>

    </div>
  );
}
