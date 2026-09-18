'use client';

import React from 'react';
import { Star, Package } from 'lucide-react';
import { profileAssetUrl } from '@/lib/api/profile';
import type { ITopRatedProduct } from '@/lib/api/review';

interface TopRatedProductsProps {
  products?: ITopRatedProduct[];
}

export default function TopRatedProducts({ products }: TopRatedProductsProps) {
  const productList = products || [];

  return (
    <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-[16px] flex flex-col gap-[16px] overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h3 className="font-semibold text-[20px] text-black">Top Rated Products</h3>
      </div>

      {/* Table */}
      <div className="w-full flex flex-col overflow-hidden border border-[#e5e5e6] rounded-[2px]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] w-full flex flex-col">
            
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[9px]">
              <div className="w-[80px] shrink-0 text-[14px] text-black font-normal px-2">Image</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Product</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2">Units Sold</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2">Rating</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2">Price</div>
            </div>

            {/* Table Rows */}
            {productList.length === 0 ? (
              <div className="w-full py-8 text-center text-sm text-[#848995]">
                No rated products available yet.
              </div>
            ) : (
              productList.map((row) => {
                const imgSrc = profileAssetUrl(row.image);
                return (
                  <div key={row.id} className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-[6px] hover:bg-gray-50 transition-colors">
                    
                    {/* Image */}
                    <div className="w-[80px] shrink-0 px-2">
                      <div className="size-[40px] bg-[#f7f7f8] overflow-hidden rounded-[2px] border border-[#e5e5e6] flex items-center justify-center">
                        {imgSrc ? (
                          <img src={imgSrc} alt={row.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="size-4 text-[#848995]" />
                        )}
                      </div>
                    </div>
                    
                    {/* Product Name */}
                    <div className="flex-[2] text-[13px] font-medium text-[#42454d] px-2 truncate">
                      {row.name}
                    </div>
                    
                    {/* Units Sold */}
                    <div className="flex-1 text-[13px] text-[#42454d] px-2">
                      {row.unitsSold.toLocaleString()}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex-1 flex items-center gap-[4px] px-2">
                      <Star className="size-3.5 text-[#f09000] fill-[#f09000]" />
                      <span className="text-[13px] font-medium text-[#42454d]">
                        {Number(row.rating).toFixed(1)}
                      </span>
                      <span className="text-[11px] text-[#848995]">
                        ({row.reviewsCount})
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex-1 text-[13px] font-medium text-[#42454d] px-2">
                      ${Number(row.price).toFixed(2)}
                    </div>
                    
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
