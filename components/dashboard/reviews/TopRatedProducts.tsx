'use client';

import React from 'react';
import { Star } from 'lucide-react';

const mockProducts = [
  {
    name: 'Aloe Vera',
    unitsSold: 300,
    rating: 4.1,
    price: '$119.99',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
  {
    name: 'Snake Plant',
    unitsSold: 300,
    rating: 4.1,
    price: '$79.99',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
  {
    name: 'ZZ Plant',
    unitsSold: 300,
    rating: 4.1,
    price: '$89.99',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
  {
    name: 'Peace Lily',
    unitsSold: 300,
    rating: 4.1,
    price: '$39.99',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
  {
    name: 'Monstera',
    unitsSold: 20,
    rating: 4.1,
    price: '$69.99',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=64&auto=format&fit=crop',
  },
];

export default function TopRatedProducts() {
  return (
    <div className="flex-[1.5] bg-white border border-[#e5e5e6] rounded-[4px] p-[16px] flex flex-col gap-[24px] overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h3 className="font-semibold text-[20px] text-black">Top Rated Products</h3>
      </div>

      {/* Table */}
      <div className="w-full flex flex-col overflow-hidden border border-[#e5e5e6]">
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
            {mockProducts.map((row, i) => (
              <div key={i} className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-[4px] hover:bg-gray-50">
                
                {/* Image */}
                <div className="w-[80px] shrink-0 px-2">
                  <div className="size-[40px] bg-white overflow-hidden rounded-[2px] border border-[#e5e5e6]">
                    <img src={row.image} alt="Product" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                {/* Product Name */}
                <div className="flex-[2] text-[12px] text-[#42454d] px-2">{row.name}</div>
                
                {/* Units Sold */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.unitsSold}</div>
                
                {/* Rating */}
                <div className="flex-1 flex items-center gap-[4px] px-2">
                  <Star className="size-3 text-[#f09000] fill-[#f09000]" />
                  <span className="text-[12px] text-[#42454d]">{row.rating}</span>
                </div>
                
                {/* Price */}
                <div className="flex-1 text-[12px] text-[#42454d] px-2">{row.price}</div>
                
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>
  );
}
