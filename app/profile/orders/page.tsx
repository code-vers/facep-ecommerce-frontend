'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

type OrderStatus = 'Ordered' | 'Packed' | 'Shipped' | 'Delivered' | 'Returned';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  seller: string;
  price: number;
  imageUrl: string;
}

interface OrderData {
  id: string;
  status: OrderStatus;
  datePlaced: string;
  totalItems: number;
  totalPrice: number;
  items: OrderItem[];
}

const TABS = ['All Orders', 'Ordered', 'Packed', 'Shipped', 'Delivered', 'Returned'] as const;
type TabType = typeof TABS[number];

const MOCK_ORDERS: OrderData[] = [
  {
    id: '123456',
    status: 'Ordered',
    datePlaced: 'January 15, 2026',
    totalItems: 3,
    totalPrice: 20000,
    items: [
      {
        id: 'item-1',
        name: 'Plant',
        quantity: 1,
        seller: 'tech store',
        price: 1649.99,
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=150',
      },
      {
        id: 'item-2',
        name: 'Plant',
        quantity: 1,
        seller: 'tech store',
        price: 1649.99,
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=150',
      },
      {
        id: 'item-3',
        name: 'Plant',
        quantity: 1,
        seller: 'tech store',
        price: 1649.99,
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=150',
      }
    ],
  },
  {
    id: '123457',
    status: 'Delivered',
    datePlaced: 'January 10, 2026',
    totalItems: 1,
    totalPrice: 1649.99,
    items: [
      {
        id: 'item-4',
        name: 'Plant',
        quantity: 1,
        seller: 'tech store',
        price: 1649.99,
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=150',
      },
    ],
  },
];

export default function ProfileOrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('All Orders');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({
    '123456': true, // Default expand the first one like Figma
  });

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const filteredOrders = MOCK_ORDERS.filter(
    order => activeTab === 'All Orders' || order.status === activeTab
  );

  return (
    <div className="flex flex-col gap-[24px] items-start w-full text-left">
      {/* Menubar */}
      <div className="w-full overflow-x-auto hide-scrollbar">
        <div className="bg-white border border-[#cacbce] flex gap-[4px] items-start p-[8px] rounded-[4px] w-max lg:w-full min-w-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center p-[8px] transition-all cursor-pointer rounded-[2px] ${
                  isActive ? 'bg-[#ede7de]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="px-[6px]">
                  <span className="font-['Open_Sans'] font-normal text-[14px] text-black whitespace-nowrap">
                    {tab}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-[18px] w-full">
        {filteredOrders.map((order) => {
          const isExpanded = !!expandedOrders[order.id];

          // Determine badge colors based on status
          let badgeBg = 'bg-[#f0f4f2]';
          let badgeBorder = 'border-[#e0ebe4]';
          let badgeText = 'text-[#229a4e]';

          if (order.status === 'Delivered') {
            badgeBg = 'bg-[#f0f2f5]';
            badgeBorder = 'border-[#dfe4ec]';
            badgeText = 'text-[#165dd0]';
          } else if (order.status === 'Returned') {
            badgeBg = 'bg-[#fdf0f0]';
            badgeBorder = 'border-[#fad4d4]';
            badgeText = 'text-[#cb1b1b]';
          }

          return (
            <div key={order.id} className="border border-[#e5e5e6] p-[24px] flex flex-col gap-[36px] w-full">
              
              {/* Card Header (Always visible) */}
              <div 
                className="flex items-start justify-between w-full cursor-pointer group"
                onClick={() => toggleOrder(order.id)}
              >
                {/* Left side: Order ID, Badge, Date */}
                <div className="flex flex-col gap-[8px] items-start">
                  <div className="flex gap-[24px] items-center">
                    <p className="font-['Open_Sans'] font-normal text-[22px] text-black leading-[1.2]">
                      Order #{order.id}
                    </p>
                    <div className={`${badgeBg} border ${badgeBorder} rounded-[2px] px-[10px] py-[4px] flex items-center justify-center`}>
                      <span className={`font-['Open_Sans'] font-normal text-[12px] ${badgeText} leading-[1.3]`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <p className="font-['Open_Sans'] font-normal text-[18px] text-[#42454d] leading-[1.2]">
                    Placed on {order.datePlaced}
                  </p>
                </div>

                {/* Right side: Price, Items, Chevron */}
                <div className="flex gap-[24px] items-center">
                  <div className="flex flex-col gap-[8px] items-start">
                    <p className="font-['Open_Sans'] font-normal text-[22px] text-black leading-[1.2]">
                      ${order.totalPrice.toLocaleString()}
                    </p>
                    <p className="font-['Open_Sans'] font-normal text-[18px] text-[#42454d] leading-[1.2]">
                      {order.totalItems} items
                    </p>
                  </div>
                  <div className="w-[24px] h-[24px] flex items-center justify-center text-black">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <>
                  {/* Order Items */}
                  <div className="flex flex-col gap-[10px] w-full">
                    {order.items.map((item) => (
                      <div key={item.id} className="border-b border-[#e5e5e6] py-[8px] flex gap-[16px] items-center w-full">
                        <div className="w-[100px] h-[100px] shrink-0 relative rounded-[2px] overflow-hidden border border-gray-100 bg-gray-50">
                          <Image 
                            src={item.imageUrl} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-[16px] flex-1">
                          <div className="flex justify-between items-start w-full">
                            <div className="flex flex-col gap-[4px] items-start">
                              <p className="font-['Open_Sans'] font-normal text-black leading-[1.2]">
                                <span className="text-[18px]">{item.name} </span>
                                <span className="text-[12px]">x {item.quantity}</span>
                              </p>
                              <p className="font-['Open_Sans'] font-normal text-[12px] text-[#848995] leading-[1.3]">
                                By {item.seller}
                              </p>
                            </div>
                            <p className="font-['Open_Sans'] font-normal text-[22px] text-black leading-[1.2]">
                              ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex gap-[16px] items-center justify-end w-full">
                    {order.status === 'Ordered' && (
                      <>
                        <button type="button" className="border-[0.75px] border-[#cb1b41] rounded-[2px] px-[16px] py-[12px] min-w-[80px] flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer">
                          <span className="font-['Open_Sans'] font-normal text-[16px] text-[#cb1b1b] leading-[1.2] whitespace-nowrap">
                            Cancel Order
                          </span>
                        </button>
                        <button type="button" className="bg-[#dec33a] border border-[#dec33a] rounded-[2px] px-[16px] py-[12px] min-w-[80px] flex items-center justify-center hover:bg-[#c9b030] transition-colors cursor-pointer">
                          <span className="font-['Open_Sans'] font-normal text-[16px] text-black leading-[1.2] whitespace-nowrap">
                            Track Order
                          </span>
                        </button>
                      </>
                    )}
                    
                    {order.status === 'Delivered' && (
                      <button type="button" className="bg-[#dec33a] border border-[#dec33a] rounded-[2px] px-[16px] py-[12px] min-w-[80px] flex items-center justify-center hover:bg-[#c9b030] transition-colors cursor-pointer">
                        <span className="font-['Open_Sans'] font-normal text-[16px] text-black leading-[1.2] whitespace-nowrap">
                          Leave a Review
                        </span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
