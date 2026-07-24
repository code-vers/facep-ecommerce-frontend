'use client';

import ProductCarousel from '@/components/homepage/ProductCarousel';
import BrowsingHistory from '@/components/product/BrowsingHistory';
import { CarouselProduct } from '@/lib/homepage-data';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, FileText, Package, PackageCheck, Truck, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  name: string;
  seller: string;
  price: string;
  imageSrc: string;
}

interface Order {
  id: string;
  status: 'All Orders' | 'Ordered' | 'Packed' | 'Shipped' | 'Delivered' | 'Returned';
  placedDate: string;
  totalPrice: string;
  items: OrderItem[];
}

const ORDERS_MOCK_DATA: Order[] = [
  {
    id: '123456',
    status: 'Ordered',
    placedDate: 'January 15, 2026',
    totalPrice: '$4,949.97',
    items: [
      {
        id: 'item-1',
        name: 'Plant x 1',
        seller: 'By tech store',
        price: '$1,649.99',
        imageSrc:
          'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'item-2',
        name: 'Plant x 1',
        seller: 'By tech store',
        price: '$1,649.99',
        imageSrc:
          'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=300&auto=format&fit=crop',
      },
      {
        id: 'item-3',
        name: 'Plant x 1',
        seller: 'By tech store',
        price: '$1,649.99',
        imageSrc:
          'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=300&auto=format&fit=crop',
      },
    ],
  },
  {
    id: '789012',
    status: 'Delivered',
    placedDate: 'December 10, 2025',
    totalPrice: '$199.99',
    items: [
      {
        id: 'item-4',
        name: 'Office Chair x 1',
        seller: 'By chair co',
        price: '$199.99',
        imageSrc:
          'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=300&auto=format&fit=crop',
      },
    ],
  },
  {
    id: '345678',
    status: 'Shipped',
    placedDate: 'November 22, 2025',
    totalPrice: '$89.99',
    items: [
      {
        id: 'item-5',
        name: 'Mechanical Keyboard x 1',
        seller: 'By keyboard inc',
        price: '$89.99',
        imageSrc:
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=300&auto=format&fit=crop',
      },
    ],
  },
  {
    id: '901234',
    status: 'Returned',
    placedDate: 'October 05, 2025',
    totalPrice: '$49.99',
    items: [
      {
        id: 'item-6',
        name: 'Monitor Stand x 1',
        seller: 'By metalworks',
        price: '$49.99',
        imageSrc:
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&auto=format&fit=crop',
      },
    ],
  },
  {
    id: '567890',
    status: 'Packed',
    placedDate: 'September 14, 2025',
    totalPrice: '$299.99',
    items: [
      {
        id: 'item-7',
        name: 'Gaming Setup x 1',
        seller: 'By setups store',
        price: '$299.99',
        imageSrc:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop',
      },
    ],
  },
];

const RECENTLY_VIEWED_ITEMS: CarouselProduct[] = [
  {
    id: 'rv-1',
    title: 'Gaming Setup',
    imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300',
    imageAlt: 'Gaming Setup',
    rating: 4.5,
    reviewCount: '624+',
    price: '$299.99',
    offerText: 'Up to 30% off',
    shippingText: '$36 Shipping',
  },
  {
    id: 'rv-2',
    title: 'Gaming Setup',
    imageSrc: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300',
    imageAlt: 'Gaming Setup',
    rating: 4.5,
    reviewCount: '624+',
    price: '$299.99',
    offerText: 'No offers right now',
    shippingText: '$36 Shipping',
  },
  {
    id: 'rv-3',
    title: 'Gaming Setup',
    imageSrc: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=300',
    imageAlt: 'Gaming Setup',
    rating: 4.5,
    reviewCount: '624+',
    price: '$299.99',
    offerText: 'No offers right now',
    shippingText: '$36 Shipping',
  },
  {
    id: 'rv-4',
    title: 'Gaming Setup',
    imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300',
    imageAlt: 'Gaming Setup',
    rating: 4.5,
    reviewCount: '624+',
    price: '$299.99',
    offerText: 'No offers right now',
    shippingText: '$36 Shipping',
  },
  {
    id: 'rv-5',
    title: 'Gaming Setup',
    imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300',
    imageAlt: 'Gaming Setup',
    rating: 4.5,
    reviewCount: '624+',
    price: '$299.99',
    offerText: 'No offers right now',
    shippingText: '$36 Shipping',
  },
  {
    id: 'rv-6',
    title: 'Gaming Setup',
    imageSrc: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300',
    imageAlt: 'Gaming Setup',
    rating: 4.5,
    reviewCount: '624+',
    price: '$299.99',
    offerText: 'No offers right now',
    shippingText: '$36 Shipping',
  },
];

const FILTER_TABS = [
  'All Orders',
  'Ordered',
  'Packed',
  'Shipped',
  'Delivered',
  'Returned',
] as const;

const STATUS_ORDER = ['Ordered', 'Packed', 'Shipped', 'Delivered'] as const;

const TRACKING_STEPS = [
  {
    key: 'Ordered' as const,
    label: 'Ordered',
    detail: 'Order Received',
    icon: FileText,
  },
  {
    key: 'Packed' as const,
    label: 'Packed',
    detail: 'Order Packed',
    icon: Package,
  },
  {
    key: 'Shipped' as const,
    label: 'Shipped',
    detail: 'Out For Delivery',
    icon: Truck,
  },
  {
    key: 'Delivered' as const,
    label: 'Delivered',
    detail: 'Order Delivered',
    icon: PackageCheck,
  },
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

export default function ReturnsAndOrdersPage() {
  const [activeTab, setActiveTab] = useState<(typeof FILTER_TABS)[number]>('All Orders');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({ '123456': true });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTrackOrder, setActiveTrackOrder] = useState<Order | null>(null);

  // Handle ESC key press and body scroll lock
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

  // Toggle order expansion
  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Filtered list based on active tab
  const filteredOrders = ORDERS_MOCK_DATA.filter((order) => {
    if (activeTab === 'All Orders') return true;
    return order.status === activeTab;
  });

  return (
    <div className='w-full min-h-screen bg-white'>
      {/* Page Layout Container */}
      <div className='mx-auto w-full max-w-[1760px] px-6 sm:px-10 md:px-16 lg:px-20 py-8 sm:py-12 flex flex-col gap-8'>
        {/* Title */}
        <h1 className='text-[#0a0a0a] font-sans text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-tight'>
          Your Returns & Orders
        </h1>

        {/* Tab Filters */}
        <div className='flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100'>
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type='button'
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1); // reset pagination on filter change
                }}
                className={cn(
                  'px-4 py-2 text-[14px] font-semibold rounded-xs border shrink-0 transition-all cursor-pointer',
                  isActive
                    ? 'bg-[#2b323b] text-white border-[#2b323b] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100',
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        <div className='flex flex-col gap-6'>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const isExpanded = !!expandedOrders[order.id];
              return (
                <div
                  key={order.id}
                  className='w-full rounded-lg overflow-hidden border border-[#e5e5e6]'
                >
                  {/* Order Header / Toggle */}
                  <div
                    onClick={() => toggleOrder(order.id)}
                    className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#f8f9fa] border-b border-[#e5e5e6] p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors select-none gap-4'
                  >
                    <div className='flex flex-col gap-1 sm:gap-2'>
                      <div className='flex items-center gap-3'>
                        <span className='text-[16px] sm:text-[18px] font-bold text-gray-900'>
                          Order #{order.id}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 text-[12px] font-bold rounded-xs border',
                            order.status === 'Delivered' &&
                              'bg-emerald-50 text-emerald-700 border-emerald-200',
                            order.status === 'Ordered' &&
                              'bg-blue-50 text-blue-700 border-blue-200',
                            order.status === 'Shipped' &&
                              'bg-amber-50 text-amber-700 border-amber-200',
                            order.status === 'Returned' &&
                              'bg-rose-50 text-rose-700 border-rose-200',
                            order.status === 'Packed' &&
                              'bg-purple-50 text-purple-700 border-purple-200',
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                      <span className='text-[14px] text-gray-500'>
                        Placed on {order.placedDate}
                      </span>
                    </div>

                    <div className='flex items-center gap-6 self-stretch sm:self-auto justify-between'>
                      <div className='flex flex-col items-end'>
                        <span className='text-[16px] sm:text-[18px] font-bold text-gray-900'>
                          {order.totalPrice}
                        </span>
                        <span className='text-[14px] text-gray-500'>
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <button type='button' className='text-gray-500'>
                        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </button>
                    </div>
                  </div>

                  {/* Order Expanded Details */}
                  {isExpanded && (
                    <div className='bg-white p-4 sm:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300'>
                      {/* Items list */}
                      <div className='flex flex-col gap-6'>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className='flex flex-col sm:flex-row gap-4 sm:gap-6 py-4 border-b border-gray-100 last:border-b-0'
                          >
                            <div className='relative border border-gray-200 rounded w-25 h-25 flex items-center justify-center shrink-0 overflow-hidden select-none bg-gray-50'>
                              <Image
                                src={item.imageSrc}
                                alt={item.name}
                                fill
                                className='object-cover'
                              />
                            </div>
                            <div className='flex flex-col justify-between py-1 flex-1'>
                              <div className='flex flex-col gap-1'>
                                <h4 className='text-[16px] sm:text-[18px] font-bold text-gray-900 leading-tight'>
                                  {item.name}
                                </h4>
                                <span className='text-[14px] text-gray-500'>{item.seller}</span>
                              </div>
                              <span className='text-[18px] font-bold text-gray-950 mt-2 sm:mt-0'>
                                {item.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className='flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100'>
                        <button
                          type='button'
                          className='px-6 py-2.5 text-[15px] font-semibold border border-red-200 text-red-600 hover:bg-rose-50 active:bg-rose-100 rounded-xs transition-all cursor-pointer text-center'
                        >
                          Cancel Order
                        </button>
                        <button
                          type='button'
                          onClick={() => setActiveTrackOrder(order)}
                          className='px-6 py-2.5 text-[15px] font-semibold bg-[#dec33a] text-black hover:bg-[#c9b034] active:bg-[#b49a2e] rounded-xs transition-all cursor-pointer text-center'
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className='w-full py-16 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center px-4'>
              <span className='text-gray-400 text-[18px] font-medium'>
                No orders found for &quot;{activeTab}&quot;
              </span>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {filteredOrders.length > 0 && (
          <div className='flex justify-center items-center gap-1.5 py-4'>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              type='button'
              className='px-3 py-2 text-[14px] font-semibold rounded-xs border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer text-gray-700'
            >
              Previous
            </button>
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                type='button'
                className={cn(
                  'w-10 h-10 flex items-center justify-center text-[14px] font-semibold rounded-xs border transition-all cursor-pointer',
                  currentPage === pageNum
                    ? 'bg-[#2b323b] text-white border-[#2b323b] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                )}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, 5))}
              disabled={currentPage === 5}
              type='button'
              className='px-3 py-2 text-[14px] font-semibold rounded-xs border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer text-gray-700'
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── 4. Recently Viewed Carousel Section ── */}
      <div className='bg-[#F4F4F5] py-12 flex flex-col gap-12 border-t border-gray-200'>
        <div className='mx-auto w-full max-w-[1760px] px-6 sm:px-10 md:px-16 lg:px-20'>
          <ProductCarousel
            title='Your recently viewed items'
            products={RECENTLY_VIEWED_ITEMS}
            exploreHref='/products'
          />
        </div>

        {/* ── 5. Inspired Browsing History Section ── */}
        <BrowsingHistory />
      </div>

      {/* ── 6. Track Order Modal Overlay ── */}
      {activeTrackOrder && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] transition-opacity duration-300'
          onClick={() => setActiveTrackOrder(null)}
        >
          {/* Modal Container */}
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
              <span className='text-[18px] text-gray-500 font-sans select-none'>Your Order is</span>
              <h2 className='text-[32px] sm:text-[36px] font-bold text-gray-955 leading-tight'>
                {getStatusTitle(activeTrackOrder.status)}
              </h2>
            </div>

            {/* Modal Content / Timeline */}
            <div className='py-10'>
              <div className='flex flex-col gap-8 relative max-w-150 mx-auto'>
                {TRACKING_STEPS.map((step, index) => {
                  const active = isStepActive(activeTrackOrder.status, step.key);
                  const { date, time } = getStepDateTime(activeTrackOrder.placedDate, index);
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
                        <span className='text-[13px] sm:text-[14px] font-bold text-gray-955 mt-2 bg-white px-2 relative z-10 select-none text-center'>
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
    </div>
  );
}
