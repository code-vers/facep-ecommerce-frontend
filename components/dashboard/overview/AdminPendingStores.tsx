'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

const mockPendingStores = [
  { id: 1, logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=64&auto=format&fit=crop', store: 'Plant House', vendor: 'John Doe', date: '02.04.2026' },
  { id: 2, logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'Afiah', date: '02.04.2026' },
  { id: 3, logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John Doe', date: '02.04.2026' },
  { id: 4, logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John Doe', date: '02.04.2026' },
  { id: 5, logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John Doe', date: '02.04.2026' },
  { id: 6, logo: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=64&auto=format&fit=crop', store: 'Technet Au', vendor: 'John Doe', date: '02.04.2026' },
];

export default function AdminPendingStores() {
  return (
    <div className="flex-1 w-full min-w-0 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h3 className="font-semibold text-[20px] text-[#f09000]">Pending Stores</h3>
        <button className="text-[14px] text-[#165dd0] hover:underline font-normal">View All</button>
      </div>

      {/* Table Container */}
      <div className="w-full flex flex-col overflow-hidden border border-[#e5e5e6]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px] w-full flex flex-col">
            
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[9px]">
              <div className="w-[80px] shrink-0 text-[14px] text-black font-normal px-2">Logo</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Store</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Vendor Name</div>
              <div className="flex-[1.5] text-[14px] text-black font-normal px-2">Application Date</div>
              <div className="w-[80px] shrink-0 text-[14px] text-black font-normal px-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            {mockPendingStores.map((row) => (
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
                
                {/* Application Date */}
                <div className="flex-[1.5] text-[12px] text-[#42454d] px-2">{row.date}</div>
                
                {/* Action */}
                <div className="w-[80px] shrink-0 px-2 flex items-center justify-center gap-2">
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

    </div>
  );
}
