'use client';

import React from 'react';

const recentOrders = [
  { product: 'Aloe Vera', date: '2026-05-30', amount: '$119.99', status: 'Shipped' },
  { product: 'Snake Plant', date: '2026-05-30', amount: '$79.99', status: 'Shipped' },
  { product: 'ZZ Plant', date: '2026-05-30', amount: '$89.99', status: 'Shipped' },
  { product: 'Peace Lily', date: '2026-05-30', amount: '$39.99', status: 'Pending' },
  { product: 'Monstera', date: '2026-05-30', amount: '$69.99', status: 'Processing' },
  { product: 'Fiddle Leaf Fig', date: '2026-05-30', amount: '$49.99', status: 'Processing' },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Shipped':
      return 'bg-[#f0f4f2] border-[#e0ebe4] text-[#229a4e]';
    case 'Pending':
      return 'bg-[#eeebe2] border-[#e3d7b5] text-[#ebaf0a]';
    case 'Processing':
      return 'bg-[#f0f2f5] border-[#dfe4ec] text-[#165dd0]';
    default:
      return 'bg-[#f2f2f3] border-[#e5e5e6] text-[#42454d]';
  }
};

export default function RecentOrders() {
  return (
    <div className="border border-[#e5e5e6] flex w-full xl:flex-1 flex-col gap-6 items-start min-w-px p-4 rounded bg-white overflow-hidden">
      <div className="flex items-center justify-between shrink-0 w-full">
        <p className="font-semibold leading-[1.2] text-[20px] text-black whitespace-nowrap">
          Recent Orders
        </p>
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
        {recentOrders.map((order, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="border-b border-l border-[#e5e5e6] flex flex-[1.5] flex-col h-[48px] justify-center px-2 py-1 shrink-0">
              <p className="font-normal leading-[1.3] text-xs text-[#42454d] truncate">
                {order.product}
              </p>
            </div>
            <div className="border-b border-[#e5e5e6] flex flex-1 flex-col h-[48px] justify-center px-2 py-1 shrink-0">
              <p className="font-normal leading-[1.3] text-xs text-[#42454d]">
                {order.date}
              </p>
            </div>
            <div className="border-b border-[#e5e5e6] flex flex-1 flex-col h-[48px] justify-center px-2 py-1 shrink-0">
              <p className="font-normal leading-[1.3] text-xs text-[#42454d]">
                {order.amount}
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
        ))}
      </div>
      </div>
    </div>
  );
}
