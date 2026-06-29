'use client';

import React from 'react';
import { X, Check } from 'lucide-react';

const mockPendingProducts = [
  { id: 1, checked: false, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop', product: 'Aloe Vera', store: 'Plant House', category: 'Plant', price: '$ 200', date: '02.04.2026' },
  { id: 2, checked: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=64&auto=format&fit=crop', product: 'Headphone', store: 'Technet Au', category: 'Electronics', price: '$ 300', date: '02.04.2026' },
  { id: 3, checked: true, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=64&auto=format&fit=crop', product: 'Headphone', store: 'Technet Au', category: 'Electronics', price: '$ 300', date: '02.04.2026' },
  { id: 4, checked: false, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=64&auto=format&fit=crop', product: 'Headphone', store: 'Technet Au', category: 'Electronics', price: '$ 300', date: '02.04.2026' },
  { id: 5, checked: false, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=64&auto=format&fit=crop', product: 'Headphone', store: 'Technet Au', category: 'Electronics', price: '$ 300', date: '02.04.2026' },
  { id: 6, checked: false, image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=64&auto=format&fit=crop', product: 'Headphone', store: 'Technet Au', category: 'Electronics', price: '$ 300', date: '02.04.2026' },
];

export default function PendingProductApprovalsTable() {
  return (
    <div className="w-full min-w-0 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
        <h3 className="font-semibold text-[20px] text-black">Pending Product Approvals</h3>
        
        <div className="flex items-center gap-4">
          <button className="border border-[#cb1b1b] rounded-[2px] h-[36px] px-3 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
            <span className="text-[14px] text-[#cb1b1b]">Reject Selected</span>
            <X size={16} className="text-[#cb1b1b]" />
          </button>
          
          <button className="border border-[#229a4e] rounded-[2px] h-[36px] px-3 flex items-center justify-center gap-2 hover:bg-green-50 transition-colors">
            <span className="text-[14px] text-[#229a4e]">Accept Selected</span>
            <Check size={16} className="text-[#229a4e]" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full flex flex-col border border-[#e5e5e6] rounded-[2px] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px] w-full flex flex-col">
            
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[9px]">
              <div className="w-[40px] shrink-0 px-2 flex items-center justify-center">
                <input type="checkbox" className="size-[14px] rounded-[2px] border-[#e5e5e6] text-[#f09000] focus:ring-[#f09000]" />
              </div>
              <div className="w-[80px] shrink-0 text-[14px] text-black px-2">Image</div>
              <div className="flex-[2] text-[14px] text-black px-2">Product</div>
              <div className="flex-[2] text-[14px] text-black px-2">Store</div>
              <div className="flex-[1.5] text-[14px] text-black px-2">Category</div>
              <div className="flex-1 text-[14px] text-black px-2">Price</div>
              <div className="flex-[2] text-[14px] text-black px-2">Application Date</div>
              <div className="w-[100px] shrink-0 text-[14px] text-black px-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            {mockPendingProducts.map((row) => (
              <div key={row.id} className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-1 hover:bg-gray-50">
                
                {/* Checkbox */}
                <div className="w-[40px] shrink-0 px-2 flex items-center justify-center">
                  {row.checked ? (
                    <div className="size-[14px] rounded-[2px] bg-[#f09000] flex items-center justify-center cursor-pointer">
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="size-[14px] rounded-[2px] border border-[#e5e5e6] bg-white cursor-pointer" />
                  )}
                </div>

                {/* Image */}
                <div className="w-[80px] shrink-0 px-2 flex items-center">
                  <div className="size-10 bg-white overflow-hidden rounded-[2px] border border-[#e5e5e6]">
                    <img src={row.image} alt="Product image" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                {/* Product */}
                <div className="flex-[2] text-[12px] text-[#42454d] px-2 truncate">{row.product}</div>
                
                {/* Store */}
                <div className="flex-[2] text-[12px] text-[#42454d] px-2 truncate">{row.store}</div>
                
                {/* Category */}
                <div className="flex-[1.5] text-[12px] text-[#42454d] px-2 truncate">{row.category}</div>
                
                {/* Price */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.price}</div>

                {/* Application Date */}
                <div className="flex-[2] text-[12px] text-[#42454d] px-2">{row.date}</div>
                
                {/* Action */}
                <div className="w-[100px] shrink-0 px-2 flex items-center justify-center gap-3">
                  <button className="flex items-center justify-center hover:opacity-80">
                    <Check className="size-[16px] text-[#229a4e]" strokeWidth={2.5} />
                  </button>
                  <button className="flex items-center justify-center hover:opacity-80">
                    <X className="size-[16px] text-[#cb1b1b]" strokeWidth={2.5} />
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="w-full flex items-center justify-center gap-2 mt-2">
        <button className="text-[14px] text-[#848995] hover:text-black mr-2">&lt; Previous</button>
        <button className="w-[32px] h-[32px] bg-[#f2f2f3] text-black text-[14px] flex items-center justify-center rounded-[2px]">1</button>
        <button className="w-[32px] h-[32px] bg-white text-[#42454d] text-[14px] flex items-center justify-center rounded-[2px] hover:bg-gray-50">2</button>
        <button className="w-[32px] h-[32px] bg-white text-[#42454d] text-[14px] flex items-center justify-center rounded-[2px] hover:bg-gray-50">3</button>
        <button className="w-[32px] h-[32px] bg-white text-[#42454d] text-[14px] flex items-center justify-center rounded-[2px] hover:bg-gray-50">4</button>
        <span className="text-[#42454d] px-1">...</span>
        <button className="text-[14px] text-black hover:opacity-70 ml-2 font-medium">Next &gt;</button>
      </div>

    </div>
  );
}
