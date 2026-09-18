'use client';

import React from 'react';
import Link from 'next/link';
import type { IRecentOrderItem } from '@/lib/api/dashboard';

interface RecentOrdersProps {
  orders?: IRecentOrderItem[];
}

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'shipped':
    case 'delivered':
      return 'bg-[#f0f4f2] border-[#e0ebe4] text-[#229a4e]';
    case 'pending':
      return 'bg-[#eeebe2] border-[#e3d7b5] text-[#ebaf0a]';
    case 'processing':
    case 'paid':
      return 'bg-[#f0f2f5] border-[#dfe4ec] text-[#165dd0]';
    case 'cancelled':
      return 'bg-[#fcece6] border-[#f5c6cb] text-[#cb1b1b]';
    default:
      return 'bg-[#f2f2f3] border-[#e5e5e6] text-[#42454d]';
  }
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const orderList = orders || [];

  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col gap-6 items-start min-w-px p-4 rounded bg-white overflow-hidden">
      <div className="flex items-center justify-between shrink-0 w-full">
        <p className="font-semibold leading-[1.2] text-[20px] text-black whitespace-nowrap">
          Recent Orders
        </p>
        <Link
          href="/dashboard/orders"
          className="text-[14px] text-[#165dd0] hover:underline font-normal"
        >
          View All
        </Link>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex flex-col items-start shrink-0 w-full min-w-[500px]">
          {/* Table Header */}
          <div className="flex items-center w-full">
            {['Product', 'Date', 'Amount', 'Status'].map((header, index, array) => (
              <div
                key={header}
                className={`bg-[#f2f2f3] border-y border-[#e5e5e6] flex flex-col h-[34px] justify-center px-2 py-[9px] shrink-0 ${
                  index === 0
                    ? 'flex-[1.5] border-l'
                    : index === array.length - 1
                    ? 'flex-1 items-center border-r'
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
          {orderList.length === 0 ? (
            <div className="w-full py-8 text-center text-sm text-[#848995] border-x border-b border-[#e5e5e6]">
              No recent orders found.
            </div>
          ) : (
            orderList.map((order) => (
              <div key={order.id} className="flex items-center w-full hover:bg-gray-50 transition-colors">
                <div className="border-b border-l border-[#e5e5e6] flex flex-[1.5] flex-col h-[48px] justify-center px-2 py-1 shrink-0">
                  <p className="font-medium leading-[1.3] text-xs text-[#42454d] truncate">
                    {order.product}
                  </p>
                  {order.orderNumber && (
                    <span className="text-[10px] text-[#848995] truncate">
                      #{order.orderNumber}
                    </span>
                  )}
                </div>
                <div className="border-b border-[#e5e5e6] flex flex-1 flex-col h-[48px] justify-center px-2 py-1 shrink-0">
                  <p className="font-normal leading-[1.3] text-xs text-[#42454d]">
                    {order.date}
                  </p>
                </div>
                <div className="border-b border-[#e5e5e6] flex flex-1 flex-col h-[48px] justify-center px-2 py-1 shrink-0">
                  <p className="font-medium leading-[1.3] text-xs text-[#42454d]">
                    ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="border-b border-r border-[#e5e5e6] flex flex-1 flex-col h-[48px] items-center justify-center px-2 py-1 shrink-0">
                  <div
                    className={`border flex items-center justify-center px-[10px] py-1 rounded-sm shrink-0 ${getStatusStyles(
                      order.status
                    )}`}
                  >
                    <p className="font-normal leading-[1.3] text-xs whitespace-nowrap">
                      {order.status}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
