'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, FileText, Package, Truck, PackageCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ReviewProductModal from '@/components/profile/ReviewProductModal';

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

const STATUS_ORDER = ["Ordered", "Packed", "Shipped", "Delivered"] as const;

const TRACKING_STEPS = [
  { key: "Ordered" as const, label: "Ordered", detail: "Order Received", icon: FileText },
  { key: "Packed" as const, label: "Packed", detail: "Order Packed", icon: Package },
  { key: "Shipped" as const, label: "Shipped", detail: "Out For Delivery", icon: Truck },
  { key: "Delivered" as const, label: "Delivered", detail: "Order Delivered", icon: PackageCheck },
];

const getStatusTitle = (status: string) => {
  switch (status) {
    case "Ordered": return "Placed";
    case "Packed": return "Packed";
    case "Shipped": return "Shipped";
    case "Delivered": return "Delivered";
    case "Returned": return "Returned";
    default: return status;
  }
};

const isStepActive = (orderStatus: string, stepKey: typeof STATUS_ORDER[number]) => {
  if (orderStatus === "Returned") return true;
  const orderStatusIndex = STATUS_ORDER.indexOf(orderStatus as any);
  const stepIndex = STATUS_ORDER.indexOf(stepKey);
  if (orderStatusIndex === -1) return false;
  return stepIndex <= orderStatusIndex;
};

const getStepDateTime = (placedDateStr: string, stepIndex: number) => {
  const date = new Date(placedDateStr);
  if (isNaN(date.getTime())) {
    return { date: "03/04/2026", time: "At 2.30 am" };
  }
  date.setDate(date.getDate() + stepIndex);
  
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  
  const times = ["At 2.30 am", "At 10:15 am", "At 3:45 pm", "At 11:00 am"];
  return {
    date: `${dd}/${mm}/${yyyy}`,
    time: times[stepIndex % times.length],
  };
};

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
  // Adding more mock orders to demonstrate pagination
  {
    id: '123458',
    status: 'Packed',
    datePlaced: 'January 18, 2026',
    totalItems: 2,
    totalPrice: 150.00,
    items: [
      { id: 'item-5', name: 'Mechanical Keyboard', quantity: 2, seller: 'keyb co', price: 75.00, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=150' },
    ],
  },
  {
    id: '123459',
    status: 'Shipped',
    datePlaced: 'January 20, 2026',
    totalItems: 1,
    totalPrice: 299.99,
    items: [
      { id: 'item-6', name: 'Gaming Monitor', quantity: 1, seller: 'displays inc', price: 299.99, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=150' },
    ],
  },
  {
    id: '123460',
    status: 'Returned',
    datePlaced: 'January 22, 2026',
    totalItems: 1,
    totalPrice: 45.00,
    items: [
      { id: 'item-7', name: 'Mouse', quantity: 1, seller: 'tech store', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479bd?q=80&w=150' },
    ],
  },
];

export default function ProfileOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState<TabType>('All Orders');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({
    '123456': true, // Default expand the first one like Figma
  });
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeTrackOrder, setActiveTrackOrder] = useState<OrderData | null>(null);

  // Handle ESC key press and body scroll lock for tracking modal
  useEffect(() => {
    if (activeTrackOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveTrackOrder(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTrackOrder]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCancelOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'Returned' as OrderStatus } : order
      )
    );
    toast.success(`Order #${orderId} has been cancelled.`);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(
      order => activeTab === 'All Orders' || order.status === activeTab
    );
  }, [orders, activeTab]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

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
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
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
        {paginatedOrders.length > 0 ? paginatedOrders.map((order) => {
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
                        <button 
                          type="button" 
                          onClick={(e) => handleCancelOrder(order.id, e)}
                          className="border-[0.75px] border-[#cb1b41] rounded-[2px] px-[16px] py-[12px] min-w-[80px] flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <span className="font-['Open_Sans'] font-normal text-[16px] text-[#cb1b1b] leading-[1.2] whitespace-nowrap">
                            Cancel Order
                          </span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setActiveTrackOrder(order)}
                          className="bg-[#dec33a] border border-[#dec33a] rounded-[2px] px-[16px] py-[12px] min-w-[80px] flex items-center justify-center hover:bg-[#c9b030] transition-colors cursor-pointer"
                        >
                          <span className="font-['Open_Sans'] font-normal text-[16px] text-black leading-[1.2] whitespace-nowrap">
                            Track Order
                          </span>
                        </button>
                      </>
                    )}
                    
                    {order.status === 'Delivered' && (
                      <button 
                        type="button" 
                        onClick={() => setReviewModalOpen(true)}
                        className="bg-[#dec33a] border border-[#dec33a] rounded-[2px] px-[16px] py-[12px] min-w-[80px] flex items-center justify-center hover:bg-[#c9b030] transition-colors cursor-pointer"
                      >
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
        }) : (
          <div className="w-full py-16 border border-dashed border-gray-300 rounded-[4px] flex flex-col items-center justify-center text-center px-4">
            <span className="text-gray-400 text-[18px] font-medium">No orders found for {activeTab}</span>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex gap-[4px] items-center justify-center w-full pt-[16px] pb-[8px]">
            <button 
              type="button" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex gap-[4px] items-center justify-center min-w-[80px] px-[12px] py-[8px] rounded-[6px] hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-black" />
              <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">Previous</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button 
                key={pageNum}
                type="button" 
                onClick={() => setCurrentPage(pageNum)}
                className={cn(
                  "flex items-center justify-center w-[40px] h-[40px] rounded-[2px] cursor-pointer transition-colors",
                  currentPage === pageNum 
                    ? "bg-[#cacace] border border-[#cacbce]" 
                    : "hover:bg-gray-100"
                )}
              >
                <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">{pageNum}</span>
              </button>
            ))}

            <button 
              type="button" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex gap-[4px] items-center justify-center min-w-[80px] px-[12px] py-[8px] rounded-[6px] hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">Next</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>
        )}
      </div>

      {/* ── Track Order Modal Overlay ── */}
      {activeTrackOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setActiveTrackOrder(null)}
        >
          {/* Modal Container */}
          <div
            className="bg-white w-full max-w-[800px] rounded-[4px] shadow-2xl relative p-8 sm:p-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveTrackOrder(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col gap-1 pb-6 border-b border-gray-100">
              <span className="text-[18px] text-gray-500 font-sans select-none">
                Your Order is
              </span>
              <h2 className="text-[32px] sm:text-[36px] font-bold text-gray-955 leading-tight">
                {getStatusTitle(activeTrackOrder.status)}
              </h2>
            </div>

            {/* Modal Content / Timeline */}
            <div className="py-10">
              <div className="flex flex-col gap-8 relative max-w-[600px] mx-auto">
                {TRACKING_STEPS.map((step, index) => {
                  const active = isStepActive(activeTrackOrder.status, step.key);
                  const { date, time } = getStepDateTime(activeTrackOrder.datePlaced, index);
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className="grid grid-cols-[100px_60px_1fr] sm:grid-cols-[160px_60px_1fr] gap-4 sm:gap-8 items-start relative"
                    >
                      {/* Left Column: Date & Time */}
                      <div className="flex flex-col items-end pt-3.5 select-none">
                        <span className="text-[14px] sm:text-[16px] font-bold text-gray-900 whitespace-nowrap">
                          {date}
                        </span>
                        <span className="text-[12px] sm:text-[14px] text-gray-400 mt-0.5 whitespace-nowrap">
                          {time}
                        </span>
                      </div>

                      {/* Center Column: Icon & Label */}
                      <div className="flex flex-col items-center relative">
                        {/* Connecting line */}
                        {index < TRACKING_STEPS.length - 1 && (
                          <div
                            className={cn(
                              "absolute top-[60px] bottom-[-48px] w-px left-1/2 -translate-x-1/2 bg-gray-200 z-0"
                            )}
                          />
                        )}

                        <div
                          className={cn(
                            "w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                            active
                              ? "bg-[#dec33a] text-black shadow-sm"
                              : "border border-[#5a6573] bg-white text-[#5a6573]"
                          )}
                        >
                          <StepIcon size={28} />
                        </div>
                        <span className="text-[13px] sm:text-[14px] font-bold text-gray-955 mt-2 bg-white px-2 relative z-10 select-none text-center">
                          {step.label}
                        </span>
                      </div>

                      {/* Right Column: Detail Status */}
                      <div className="h-[60px] flex items-center pt-1.5 pl-2 sm:pl-4">
                        <span className="text-[16px] sm:text-[18px] font-bold text-gray-900 select-none">
                          {step.detail}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <ReviewProductModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setReviewModalOpen(false)} 
      />
    </div>
  );
}
