'use client';

import ReviewProductModal from '@/components/profile/ReviewProductModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCancelOrder, useMyOrders } from '@/hooks/api/useOrder';
import {
  formatOrderImageUrl,
  mapBackendStatusToUI,
  type TabType,
  type UIOrderStatus,
} from '@/lib/api/order';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  Package,
  PackageCheck,
  Truck,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

interface OrderItemDisplay {
  id: string;
  name: string;
  quantity: number;
  seller: string;
  price: number;
  imageUrl: string;
}

interface OrderDataDisplay {
  id: string;
  orderNumber: string;
  status: UIOrderStatus;
  datePlaced: string;
  totalItems: number;
  totalPrice: number;
  items: OrderItemDisplay[];
}

const TABS: readonly TabType[] = [
  'All Orders',
  'Ordered',
  'Packed',
  'Shipped',
  'Delivered',
  'Returned',
] as const;

const STATUS_ORDER: readonly UIOrderStatus[] = ['Ordered', 'Packed', 'Shipped', 'Delivered'] as const;

const TRACKING_STEPS = [
  { key: 'Ordered' as const, label: 'Ordered', detail: 'Order Received', icon: FileText },
  { key: 'Packed' as const, label: 'Packed', detail: 'Order Packed', icon: Package },
  { key: 'Shipped' as const, label: 'Shipped', detail: 'Out For Delivery', icon: Truck },
  { key: 'Delivered' as const, label: 'Delivered', detail: 'Order Delivered', icon: PackageCheck },
];

const getStatusTitle = (status: string) => {
  switch (status) {
    case 'Ordered':
      return 'Placed';
    case 'Packed':
      return 'Packed';
    case 'Shipped':
      return 'Shipped';
    case 'Delivered':
      return 'Delivered';
    case 'Returned':
      return 'Returned';
    default:
      return status;
  }
};

const isStepActive = (orderStatus: string, stepKey: (typeof STATUS_ORDER)[number]) => {
  if (orderStatus === 'Returned') return true;
  const orderStatusIndex = STATUS_ORDER.indexOf(orderStatus as (typeof STATUS_ORDER)[number]);
  const stepIndex = STATUS_ORDER.indexOf(stepKey);
  if (orderStatusIndex === -1) return false;
  return stepIndex <= orderStatusIndex;
};

const getStepDateTime = (placedDateStr: string, stepIndex: number) => {
  const date = new Date(placedDateStr);
  if (isNaN(date.getTime())) {
    return { date: '03/04/2026', time: 'At 2.30 am' };
  }
  date.setDate(date.getDate() + stepIndex);

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  const times = ['At 2.30 am', 'At 10:15 am', 'At 3:45 pm', 'At 11:00 am'];
  return {
    date: `${dd}/${mm}/${yyyy}`,
    time: times[stepIndex % times.length],
  };
};

export default function ProfileOrdersPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('All Orders');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeTrackOrder, setActiveTrackOrder] = useState<OrderDataDisplay | null>(null);

  const { data, isLoading } = useMyOrders({
    page: currentPage,
    limit: itemsPerPage,
    status: activeTab,
  });

  const cancelOrderMutation = useCancelOrder();

  const rawOrders = data?.orders;
  const orders: OrderDataDisplay[] = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map((order) => {
      const placedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const totalItems =
        order.items?.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0) ||
        order.items?.length ||
        0;

      return {
        id: order.id,
        orderNumber: order.orderNumber || order.id,
        status: mapBackendStatusToUI(order.status),
        datePlaced: placedDate,
        totalItems,
        totalPrice: Number(order.total) || 0,
        items: (order.items || []).map((item) => ({
          id: item.id,
          name: item.productName || 'Item',
          quantity: item.quantity || 1,
          seller: item.vendorName || 'Facep Store',
          price: Number(item.price) || 0,
          imageUrl: formatOrderImageUrl(item.image),
        })),
      };
    });
  }, [rawOrders]);

  // Handle ESC key press and body scroll lock for tracking modal
  useEffect(() => {
    if (activeTrackOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTrackOrder(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTrackOrder]);

  const toggleOrder = (orderId: string, defaultExpanded: boolean) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: prev[orderId] !== undefined ? !prev[orderId] : !defaultExpanded,
    }));
  };

  const handleCancelOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    cancelOrderMutation.mutate({ orderId });
  };

  const totalPages = data?.meta?.totalPages || 1;

  if (!session?.user?.id) {
    return (
      <div className='flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 rounded-lg text-center gap-4 bg-white'>
        <p className='text-[18px] font-semibold text-gray-800'>Please login to view your orders</p>
        <Link
          href='/login'
          className='px-6 py-2.5 bg-[#dec33a] hover:bg-[#c9b034] text-black font-semibold rounded-xs transition-colors'
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 items-start w-full text-left'>
      {/* Menubar / Status Tabs */}
      <div className='w-full overflow-x-auto hide-scrollbar'>
        <div className='bg-white border border-[#cacbce] flex gap-1 items-start p-2 rounded-lg w-max lg:w-full min-w-full'>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type='button'
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={cn(
                  'flex items-center p-2 transition-all cursor-pointer rounded-xs',
                  isActive ? 'bg-[#ede7de]' : 'hover:bg-gray-50',
                )}
              >
                <div className='px-1.5'>
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
      <div className='flex flex-col gap-4.5 w-full'>
        {isLoading ? (
          <div className='w-full py-16 flex justify-center items-center'>
            <span className='text-gray-400 font-medium'>Loading orders...</span>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order, index) => {
            const defaultExpanded = index === 0;
            const isExpanded =
              expandedOrders[order.id] !== undefined
                ? expandedOrders[order.id]
                : defaultExpanded;

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
            } else if (order.status === 'Packed') {
              badgeBg = 'bg-purple-50';
              badgeBorder = 'border-purple-200';
              badgeText = 'text-purple-700';
            } else if (order.status === 'Shipped') {
              badgeBg = 'bg-amber-50';
              badgeBorder = 'border-amber-200';
              badgeText = 'text-amber-700';
            }

            return (
              <div key={order.id} className='border border-[#e5e5e6] p-6 flex flex-col gap-9 w-full bg-white'>
                {/* Card Header (Always visible) */}
                <div
                  className='flex items-start justify-between w-full cursor-pointer group select-none'
                  onClick={() => toggleOrder(order.id, defaultExpanded)}
                >
                  {/* Left side: Order ID, Badge, Date */}
                  <div className='flex flex-col gap-2 items-start'>
                    <div className='flex gap-4 sm:gap-6 items-center flex-wrap'>
                      <p className="font-['Open_Sans'] font-semibold text-[20px] sm:text-[22px] text-black leading-[1.2]">
                        Order #{order.orderNumber}
                      </p>
                      <div
                        className={`${badgeBg} border ${badgeBorder} rounded-xs px-2.5 py-1 flex items-center justify-center`}
                      >
                        <span
                          className={`font-['Open_Sans'] font-medium text-[12px] ${badgeText} leading-[1.3]`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <p className="font-['Open_Sans'] font-normal text-[16px] sm:text-[18px] text-[#42454d] leading-[1.2]">
                      Placed on {order.datePlaced}
                    </p>
                  </div>

                  {/* Right side: Price, Items, Chevron */}
                  <div className='flex gap-6 items-center'>
                    <div className='flex flex-col gap-1 sm:gap-2 items-end'>
                      <p className="font-['Open_Sans'] font-bold text-[20px] sm:text-[22px] text-black leading-[1.2]">
                        ${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="font-['Open_Sans'] font-normal text-[15px] sm:text-[18px] text-[#42454d] leading-[1.2]">
                        {order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className='w-6 h-6 flex items-center justify-center text-black'>
                      {isExpanded ? (
                        <ChevronUp className='w-5 h-5' />
                      ) : (
                        <ChevronDown className='w-5 h-5' />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <>
                    {/* Order Items */}
                    <div className='flex flex-col gap-4 w-full'>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className='border-b border-[#e5e5e6] py-3 flex gap-4 items-center w-full'
                        >
                          <div className='w-20 h-20 sm:w-24 sm:h-24 shrink-0 relative rounded-xs overflow-hidden border border-gray-100 bg-gray-50'>
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              unoptimized
                              className='object-cover'
                            />
                          </div>
                          <div className='flex flex-col gap-2 flex-1'>
                            <div className='flex justify-between items-start w-full gap-4'>
                              <div className='flex flex-col gap-1 items-start'>
                                <p className="font-['Open_Sans'] font-semibold text-black leading-[1.2] text-[16px] sm:text-[18px]">
                                  {item.name}{' '}
                                  <span className='text-[13px] font-normal text-gray-500'>x {item.quantity}</span>
                                </p>
                                <p className="font-['Open_Sans'] font-normal text-[13px] text-[#848995] leading-[1.3]">
                                  By {item.seller}
                                </p>
                              </div>
                              <p className="font-['Open_Sans'] font-bold text-[18px] sm:text-[20px] text-black leading-[1.2]">
                                $
                                {(item.price * item.quantity).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className='flex gap-3 sm:gap-4 items-center justify-end w-full flex-wrap pt-2'>
                      {order.status !== 'Delivered' && order.status !== 'Returned' && (
                        <button
                          type='button'
                          onClick={(e) => handleCancelOrder(order.id, e)}
                          disabled={cancelOrderMutation.isPending}
                          className='border-[0.75px] border-[#cb1b41] rounded-xs px-4 py-2.5 min-w-20 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50'
                        >
                          <span className="font-['Open_Sans'] font-medium text-[15px] text-[#cb1b1b] leading-[1.2] whitespace-nowrap">
                            Cancel Order
                          </span>
                        </button>
                      )}

                      <button
                        type='button'
                        onClick={() => setActiveTrackOrder(order)}
                        className='bg-[#dec33a] border border-[#dec33a] rounded-xs px-5 py-2.5 min-w-20 flex items-center justify-center hover:bg-[#c9b030] transition-colors cursor-pointer shadow-xs'
                      >
                        <span className="font-['Open_Sans'] font-semibold text-[15px] text-black leading-[1.2] whitespace-nowrap">
                          Track Order
                        </span>
                      </button>

                      {order.status === 'Delivered' && (
                        <button
                          type='button'
                          onClick={() => setReviewModalOpen(true)}
                          className='bg-black text-white rounded-xs px-5 py-2.5 min-w-20 flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer'
                        >
                          <span className="font-['Open_Sans'] font-semibold text-[15px] text-white leading-[1.2] whitespace-nowrap">
                            Leave a Review
                          </span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className='w-full py-16 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center px-4 bg-white'>
            <span className='text-gray-400 text-[18px] font-medium'>
              No orders found for &quot;{activeTab}&quot;
            </span>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex gap-1.5 items-center justify-center w-full pt-6 pb-2'>
            <button
              type='button'
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className='flex gap-1 items-center justify-center min-w-20 px-3 py-2 rounded-xs border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-700'
            >
              <ChevronLeft className='w-4 h-4 text-black' />
              <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">
                Previous
              </span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type='button'
                onClick={() => setCurrentPage(pageNum)}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xs cursor-pointer transition-colors border',
                  currentPage === pageNum
                    ? 'bg-[#2b323b] text-white border-[#2b323b] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                )}
              >
                <span className="font-['Open_Sans'] font-semibold text-[14px] leading-[1.2]">
                  {pageNum}
                </span>
              </button>
            ))}

            <button
              type='button'
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className='flex gap-1 items-center justify-center min-w-20 px-3 py-2 rounded-xs border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-700'
            >
              <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">
                Next
              </span>
              <ChevronRight className='w-4 h-4 text-black' />
            </button>
          </div>
        )}
      </div>

      {/* ── Track Order Modal Overlay ── */}
      {activeTrackOrder && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] transition-opacity duration-300'
          onClick={() => setActiveTrackOrder(null)}
        >
          <div
            className='bg-white w-full max-w-200 rounded-lg shadow-2xl relative p-8 sm:p-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveTrackOrder(null)}
              className='absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-full cursor-pointer'
              aria-label='Close modal'
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className='flex flex-col gap-1 pb-6 border-b border-gray-100'>
              <span className='text-[18px] text-gray-500 font-sans select-none'>
                Order #{activeTrackOrder.orderNumber} is
              </span>
              <h2 className='text-[32px] sm:text-[36px] font-bold text-gray-900 leading-tight'>
                {getStatusTitle(activeTrackOrder.status)}
              </h2>
            </div>

            {/* Modal Content / Timeline */}
            <div className='py-10'>
              <div className='flex flex-col gap-8 relative max-w-150 mx-auto'>
                {TRACKING_STEPS.map((step, index) => {
                  const active = isStepActive(activeTrackOrder.status, step.key);
                  const { date, time } = getStepDateTime(activeTrackOrder.datePlaced, index);
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className='grid grid-cols-[100px_60px_1fr] sm:grid-cols-[160px_60px_1fr] gap-4 sm:gap-8 items-start relative'
                    >
                      {/* Left Column: Date & Time */}
                      <div className='flex flex-col items-end pt-3.5 select-none'>
                        <span className='text-[14px] sm:text-[16px] font-bold text-gray-900 whitespace-nowrap'>
                          {date}
                        </span>
                        <span className='text-[12px] sm:text-[14px] text-gray-400 mt-0.5 whitespace-nowrap'>
                          {time}
                        </span>
                      </div>

                      {/* Center Column: Icon & Label */}
                      <div className='flex flex-col items-center relative'>
                        {/* Connecting line */}
                        {index < TRACKING_STEPS.length - 1 && (
                          <div
                            className={cn(
                              'absolute top-15 -bottom-12 w-px left-1/2 -translate-x-1/2 bg-gray-200 z-0',
                            )}
                          />
                        )}

                        <div
                          className={cn(
                            'w-15 h-15 rounded-full flex items-center justify-center transition-all duration-300 relative z-10',
                            active
                              ? 'bg-[#dec33a] text-black shadow-sm'
                              : 'border border-[#5a6573] bg-white text-[#5a6573]',
                          )}
                        >
                          <StepIcon size={28} />
                        </div>
                        <span className='text-[13px] sm:text-[14px] font-bold text-gray-900 mt-2 bg-white px-2 relative z-10 select-none text-center'>
                          {step.label}
                        </span>
                      </div>

                      {/* Right Column: Detail Status */}
                      <div className='h-15 flex items-center pt-1.5 pl-2 sm:pl-4'>
                        <span className='text-[16px] sm:text-[18px] font-bold text-gray-900 select-none'>
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

      <ReviewProductModal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} />
    </div>
  );
}
