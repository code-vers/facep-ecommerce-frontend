'use client';

import React from 'react';

const topSelling = [
  { image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=100&auto=format&fit=crop', product: 'Aloe Vera', units: 300, price: '$119.99' },
  { image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=100&auto=format&fit=crop', product: 'Snake Plant', units: 300, price: '$79.99' },
  { image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=100&auto=format&fit=crop', product: 'ZZ Plant', units: 300, price: '$89.99' },
  { image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=100&auto=format&fit=crop', product: 'Peace Lily', units: 300, price: '$39.99' },
  { image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=100&auto=format&fit=crop', product: 'Monstera', units: 300, price: '$69.99' },
  { image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=100&auto=format&fit=crop', product: 'Fiddle Leaf Fig', units: 300, price: '$49.99' },
];

export default function TopSellingProducts() {
  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col gap-6 items-start min-w-px p-4 rounded bg-white overflow-hidden">
      <div className="flex items-center justify-between shrink-0 w-full">
        <p className="font-semibold leading-[1.2] text-[20px] text-black whitespace-nowrap">
          Top Selling Products
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col items-start shrink-0 w-full min-w-[500px]">
        {/* Table Header */}
        <div className="flex items-center w-full">
          {['Image', 'Product', 'Units Sold', 'Avg Price'].map((header, index, array) => (
            <div
              key={header}
              className={`bg-[#f2f2f3] border-y border-[#e5e5e6] flex flex-col h-[34px] justify-center px-2 py-[9px] shrink-0 ${
                index === 0
                  ? 'w-[82px] border-l'
                  : index === 1
                  ? 'flex-[1.5]'
                  : index === array.length - 1
                  ? 'flex-1 border-r'
                  : 'flex-1'
              }`}
            >
              <p className="font-normal leading-[1.3] text-sm text-black whitespace-nowrap">
                {header}
              </p>
            </div>
          ))}
        </div>

        {/* Table Body */}
        {topSelling.map((item, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="border-b border-l border-[#e5e5e6] flex w-[82px] flex-col h-[48px] justify-center px-2 py-1 shrink-0">
              <div className="relative shrink-0 size-[40px] bg-white">
                <img
                  alt={item.product}
                  className="absolute max-w-none object-cover size-full rounded-sm"
                  src={item.image}
                />
              </div>
            </div>
            <div className="border-b border-[#e5e5e6] flex flex-[1.5] flex-col h-[48px] justify-center px-2 py-1 shrink-0">
              <p className="font-normal leading-[1.3] text-xs text-[#42454d] truncate">
                {item.product}
              </p>
            </div>
            <div className="border-b border-[#e5e5e6] flex flex-1 flex-col h-[48px] justify-center px-2 py-1 shrink-0">
              <p className="font-normal leading-[1.3] text-xs text-[#42454d]">
                {item.units}
              </p>
            </div>
            <div className="border-b border-r border-[#e5e5e6] flex flex-1 flex-col h-[48px] justify-center px-2 py-1 shrink-0">
              <p className="font-normal leading-[1.3] text-xs text-[#42454d]">
                {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
