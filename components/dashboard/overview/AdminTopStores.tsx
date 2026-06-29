'use client';

import React from 'react';

const mockTopStores = [
  { id: 1, logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop', store: 'Plant House', vendor: 'John Doe', sales: '$ 4000', orders: 300, products: 500, rating: '4.1' },
  { id: 2, logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'Afiah', sales: '$ 4000', orders: 300, products: 400, rating: '4.1' },
  { id: 3, logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John Doe', sales: '$ 4000', orders: 300, products: 100, rating: '4.1' },
  { id: 4, logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John Doe', sales: '$ 4000', orders: 300, products: 100, rating: '4.1' },
  { id: 5, logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John Doe', sales: '$ 4000', orders: 300, products: 100, rating: '4.1' },
  { id: 6, logo: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John Doe', sales: '$ 4000', orders: 300, products: 100, rating: '4.1' },
];

export default function AdminTopStores() {
  return (
    <div className="flex-1 w-full min-w-0 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6 overflow-hidden">
      
      {/* Header */}
      <h3 className="font-semibold text-[20px] text-black">Top Stores</h3>

      {/* Table Container */}
      <div className="w-full flex flex-col overflow-hidden border border-[#e5e5e6]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px] w-full flex flex-col">
            
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[9px]">
              <div className="w-[80px] shrink-0 text-[14px] text-black font-normal px-2">Logo</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Store</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Vendor Name</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2">Sales</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2">Orders</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2">Products</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2 text-right">Rating</div>
            </div>

            {/* Table Rows */}
            {mockTopStores.map((row) => (
              <div key={row.id} className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-1 hover:bg-gray-50">
                
                {/* Logo */}
                <div className="w-[80px] shrink-0 px-2 flex items-center">
                  <div className="size-10 bg-white overflow-hidden rounded-[2px]">
                    <img src={row.logo} alt="Store logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                {/* Store */}
                <div className="flex-[2] text-[12px] text-[#42454d] px-2">{row.store}</div>
                
                {/* Vendor Name */}
                <div className="flex-[2] text-[12px] text-[#42454d] px-2">{row.vendor}</div>
                
                {/* Sales */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.sales}</div>
                
                {/* Orders */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.orders}</div>
                
                {/* Products */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.products}</div>
                
                {/* Rating */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2 text-right">{row.rating}</div>
                
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>
  );
}
