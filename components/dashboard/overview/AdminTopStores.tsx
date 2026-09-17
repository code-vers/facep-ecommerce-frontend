'use client';

import React from 'react';
import { Store as StoreIcon } from 'lucide-react';
import { profileAssetUrl } from '@/lib/api/profile';
import type { ITopStoreItem } from '@/lib/api/dashboard';

interface AdminTopStoresProps {
  stores?: ITopStoreItem[];
}

export default function AdminTopStores({ stores }: AdminTopStoresProps) {
  const storeList = stores || [];

  return (
    <div className="flex-1 w-full min-w-0 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6 overflow-hidden">
      
      {/* Header */}
      <h3 className="font-semibold text-[20px] text-black">Top Stores</h3>

      {/* Table Container */}
      <div className="w-full flex flex-col overflow-hidden border border-[#e5e5e6] rounded-[2px]">
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
            {storeList.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#848995]">
                No top store records available.
              </div>
            ) : (
              storeList.map((row) => {
                const logoSrc = profileAssetUrl(row.logo);
                return (
                  <div key={row.id} className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-1 hover:bg-gray-50 transition-colors">
                    
                    {/* Logo */}
                    <div className="w-[80px] shrink-0 px-2 flex items-center">
                      <div className="size-10 bg-[#f7f7f8] overflow-hidden rounded-[2px] border border-[#e5e5e6] flex items-center justify-center">
                        {logoSrc ? (
                          <img src={logoSrc} alt={row.store} className="w-full h-full object-cover" />
                        ) : (
                          <StoreIcon className="size-5 text-[#848995]" />
                        )}
                      </div>
                    </div>
                    
                    {/* Store */}
                    <div className="flex-[2] text-[12px] text-[#42454d] font-medium px-2 truncate">{row.store}</div>
                    
                    {/* Vendor Name */}
                    <div className="flex-[2] text-[12px] text-[#42454d] px-2 truncate">{row.vendor}</div>
                    
                    {/* Sales */}
                    <div className="flex-1 text-[12px] text-[#42454d] font-medium px-2">
                      ${row.sales.toLocaleString()}
                    </div>
                    
                    {/* Orders */}
                    <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.orders}</div>
                    
                    {/* Products */}
                    <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.products}</div>
                    
                    {/* Rating */}
                    <div className="flex-1 text-[12px] text-[#42454d] px-2 text-right font-medium">{row.rating}</div>
                    
                  </div>
                );
              })
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
