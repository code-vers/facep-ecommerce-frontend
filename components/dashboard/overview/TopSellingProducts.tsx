'use client';

import React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { profileAssetUrl } from '@/lib/api/profile';
import type { ITopSellingProductItem } from '@/lib/api/dashboard';

interface TopSellingProductsProps {
  products?: ITopSellingProductItem[];
}

export default function TopSellingProducts({ products }: TopSellingProductsProps) {
  const productList = products || [];

  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col gap-6 items-start min-w-px p-4 rounded bg-white overflow-hidden">
      <div className="flex items-center justify-between shrink-0 w-full">
        <p className="font-semibold leading-[1.2] text-[20px] text-black whitespace-nowrap">
          Top Selling Products
        </p>
        <Link
          href="/dashboard/products"
          className="text-[14px] text-[#165dd0] hover:underline font-normal"
        >
          View All
        </Link>
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
          {productList.length === 0 ? (
            <div className="w-full py-8 text-center text-sm text-[#848995] border-x border-b border-[#e5e5e6]">
              No product sales records yet.
            </div>
          ) : (
            productList.map((item) => {
              const imgSrc = profileAssetUrl(item.image);
              return (
                <div key={item.id} className="flex items-center w-full hover:bg-gray-50 transition-colors">
                  <div className="border-b border-l border-[#e5e5e6] flex w-[82px] flex-col h-[48px] justify-center px-2 py-1 shrink-0">
                    <div className="size-[40px] bg-[#f7f7f8] rounded-sm overflow-hidden border border-[#e5e5e6] flex items-center justify-center">
                      {imgSrc ? (
                        <img
                          alt={item.product}
                          className="object-cover size-full"
                          src={imgSrc}
                        />
                      ) : (
                        <Package className="size-5 text-[#848995]" />
                      )}
                    </div>
                  </div>
                  <div className="border-b border-[#e5e5e6] flex flex-[1.5] flex-col h-[48px] justify-center px-2 py-1 shrink-0">
                    <p className="font-medium leading-[1.3] text-xs text-[#42454d] truncate">
                      {item.product}
                    </p>
                  </div>
                  <div className="border-b border-[#e5e5e6] flex flex-1 flex-col h-[48px] justify-center px-2 py-1 shrink-0">
                    <p className="font-normal leading-[1.3] text-xs text-[#42454d]">
                      {item.units}
                    </p>
                  </div>
                  <div className="border-b border-r border-[#e5e5e6] flex flex-1 flex-col h-[48px] justify-center px-2 py-1 shrink-0">
                    <p className="font-medium leading-[1.3] text-xs text-[#42454d]">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
