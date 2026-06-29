'use client';

import React from 'react';
import { ChevronDown, Save, Eye, Edit2, Trash2 } from 'lucide-react';

const mockStores = [
  { id: 1, logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop', store: 'Plant House', vendor: 'John doe', email: 'jophn@Resu.com', products: 2400, sales: '$119.99', rating: '4.1', date: '02.04.2026', status: 'Active' },
  { id: 2, logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John doe', email: 'jophn@Resu.com', products: 2400, sales: '$79.99', rating: '4.1', date: '02.04.2026', status: 'Active' },
  { id: 3, logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John doe', email: 'jophn@Resu.com', products: 2400, sales: '$89.99', rating: '4.1', date: '02.04.2026', status: 'Pending' },
  { id: 4, logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John doe', email: 'jophn@Resu.com', products: 15, sales: '$39.99', rating: '4.1', date: '02.04.2026', status: 'Pending' },
  { id: 5, logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John doe', email: 'jophn@Resu.com', products: 10, sales: '$69.99', rating: '4.1', date: '02.04.2026', status: 'Suspend' },
  { id: 6, logo: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John doe', email: 'jophn@Resu.com', products: 0, sales: '$49.99', rating: '4.1', date: '02.04.2026', status: 'Suspend' },
];

export default function AllStoresTable() {
  return (
    <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
        <h3 className="font-semibold text-[20px] text-black">Vendors</h3>
        
        <div className="flex items-center gap-4">
          <div className="bg-white border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 py-2.5 flex items-center justify-between w-[250px] cursor-pointer">
            <span className="text-[14px] text-[#848995]">Filter By Status</span>
            <ChevronDown size={16} className="text-black" />
          </div>
          
          <button className="border border-[#686f7d] rounded-[2px] h-[36px] px-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <span className="text-[14px] text-black">Export CSV</span>
            <Save size={16} className="text-black" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full flex flex-col border border-[#e5e5e6] rounded-[2px] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px] w-full flex flex-col">
            
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[9px]">
              <div className="w-[80px] shrink-0 text-[14px] text-black px-2">Logo</div>
              <div className="flex-[2] text-[14px] text-black px-2">Store</div>
              <div className="flex-[1.5] text-[14px] text-black px-2">Vendor</div>
              <div className="flex-[2] text-[14px] text-black px-2">Email</div>
              <div className="flex-1 text-[14px] text-black px-2">Products</div>
              <div className="flex-1 text-[14px] text-black px-2">Sales</div>
              <div className="flex-1 text-[14px] text-black px-2">Rating</div>
              <div className="flex-[1.5] text-[14px] text-black px-2">Open Date</div>
              <div className="w-[120px] shrink-0 text-[14px] text-black px-2">Status</div>
              <div className="w-[100px] shrink-0 text-[14px] text-black px-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            {mockStores.map((row) => (
              <div key={row.id} className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-1 hover:bg-gray-50">
                
                {/* Logo */}
                <div className="w-[80px] shrink-0 px-2 flex items-center">
                  <div className="size-10 bg-white overflow-hidden rounded-[2px] border border-[#e5e5e6]">
                    <img src={row.logo} alt="Store logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                {/* Store */}
                <div className="flex-[2] text-[12px] text-[#42454d] px-2 truncate">{row.store}</div>
                
                {/* Vendor */}
                <div className="flex-[1.5] text-[12px] text-[#42454d] px-2 truncate">{row.vendor}</div>
                
                {/* Email */}
                <div className="flex-[2] text-[12px] text-[#42454d] px-2 truncate">{row.email}</div>
                
                {/* Products */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.products}</div>
                
                {/* Sales */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.sales}</div>
                
                {/* Rating */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2 flex items-center gap-1">
                  <span className="text-[#f09000] text-[14px]">★</span>
                  <span>{row.rating}</span>
                </div>
                
                {/* Open Date */}
                <div className="flex-[1.5] text-[12px] text-[#42454d] px-2">{row.date}</div>
                
                {/* Status */}
                <div className="w-[120px] shrink-0 px-2 flex items-center">
                  {row.status === 'Active' && (
                    <div className="bg-[#e7f4eb] border border-[#229a4e] rounded-[2px] px-2 py-1 flex items-center justify-between w-full">
                      <span className="text-[12px] text-[#229a4e]">Active</span>
                      <ChevronDown size={14} className="text-[#229a4e]" />
                    </div>
                  )}
                  {row.status === 'Pending' && (
                    <div className="bg-[#fdf4e5] border border-[#f09000] rounded-[2px] px-2 py-1 flex items-center justify-between w-full">
                      <span className="text-[12px] text-[#f09000]">Pending</span>
                      <ChevronDown size={14} className="text-[#f09000]" />
                    </div>
                  )}
                  {row.status === 'Suspend' && (
                    <div className="bg-[#fbe8e8] border border-[#cb1b1b] rounded-[2px] px-2 py-1 flex items-center justify-between w-full">
                      <span className="text-[12px] text-[#cb1b1b]">Suspend</span>
                      <ChevronDown size={14} className="text-[#cb1b1b]" />
                    </div>
                  )}
                </div>
                
                {/* Action */}
                <div className="w-[100px] shrink-0 px-2 flex items-center justify-center gap-3">
                  <button className="text-[#42454d] hover:text-black transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="text-[#42454d] hover:text-black transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="text-[#cb1b1b] hover:text-red-700 transition-colors">
                    <Trash2 size={16} />
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
