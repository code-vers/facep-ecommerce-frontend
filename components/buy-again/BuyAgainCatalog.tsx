'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  X,
  ChevronRight,
  List,
  LayoutGrid,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useMyOrders } from '@/hooks/api/useOrder';
import { useCartStore } from '@/contexts/CartContext';
import { formatOrderImageUrl, BackendOrder } from '@/lib/api/order';
import { cn } from '@/lib/utils';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import BrowsingHistory from '@/components/product/BrowsingHistory';
import { CarouselProduct } from '@/lib/homepage-data';

export interface BuyAgainItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sellerName: string;
  color?: string | null;
  size?: string | null;
  storage?: string | null;
  material?: string | null;
  lastDeliveredDate: string;
  lastDeliveredDateFormatted: string;
  lastOrderNumber: string;
  orderId: string;
  timesPurchased: number;
  totalQuantityPurchased: number;
}

type TabType = 'All Items' | 'Frequently Reordered' | 'Recently Delivered';

const BUY_AGAIN_TABS: readonly TabType[] = [
  'All Items',
  'Frequently Reordered',
  'Recently Delivered',
] as const;

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

export default function BuyAgainCatalog() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  const addToCart = useCartStore((state) => state.addToCart);

  const [activeTab, setActiveTab] = useState<TabType>('All Items');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'frequent' | 'price-asc' | 'price-desc' | 'name-asc'>('recent');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch delivered orders
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders({
    status: 'Delivered',
    limit: 100,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rawOrders: BackendOrder[] = ordersData?.orders || [];

  // Extract delivered items
  const deliveredItems: BuyAgainItem[] = useMemo(() => {
    const itemMap = new Map<string, BuyAgainItem>();

    rawOrders.forEach((order) => {
      const deliveredDate = order.updatedAt || order.createdAt;
      const formattedDate = new Date(deliveredDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      (order.items || []).forEach((item) => {
        const key = item.productId || item.slug || item.id;

        if (itemMap.has(key)) {
          const existing = itemMap.get(key)!;
          existing.timesPurchased += 1;
          existing.totalQuantityPurchased += item.quantity || 1;
          if (new Date(deliveredDate) > new Date(existing.lastDeliveredDate)) {
            existing.lastDeliveredDate = deliveredDate;
            existing.lastDeliveredDateFormatted = formattedDate;
            existing.lastOrderNumber = order.orderNumber;
            existing.orderId = order.id;
            existing.price = Number(item.price);
            if (item.image) existing.image = item.image;
          }
        } else {
          itemMap.set(key, {
            id: key,
            productId: item.productId,
            name: item.productName,
            slug: item.slug,
            price: Number(item.price),
            image: item.image || '',
            sellerName: item.vendorName || 'Facep Store',
            color: item.color,
            size: item.size,
            storage: item.storage,
            material: item.material,
            lastDeliveredDate: deliveredDate,
            lastDeliveredDateFormatted: formattedDate,
            lastOrderNumber: order.orderNumber,
            orderId: order.id,
            timesPurchased: 1,
            totalQuantityPurchased: item.quantity || 1,
          });
        }
      });
    });

    return Array.from(itemMap.values());
  }, [rawOrders]);

  // Tab filter + search + sort
  const filteredItems = useMemo(() => {
    let result = [...deliveredItems];

    // Tab filter
    if (activeTab === 'Frequently Reordered') {
      result = result.filter((item) => item.totalQuantityPurchased > 1 || item.timesPurchased > 1);
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.sellerName.toLowerCase().includes(q) ||
          item.lastOrderNumber.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'recent' || activeTab === 'Recently Delivered') {
      result.sort(
        (a, b) =>
          new Date(b.lastDeliveredDate).getTime() -
          new Date(a.lastDeliveredDate).getTime()
      );
    } else if (sortBy === 'frequent') {
      result.sort((a, b) => b.totalQuantityPurchased - a.totalQuantityPurchased);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [deliveredItems, activeTab, searchTerm, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleBuyAgain = (item: BuyAgainItem) => {
    const cartItemId = `${item.productId}-${item.color || ''}-${item.size || ''}-${item.storage || ''}-${item.material || ''}`;

    addToCart({
      id: item.productId,
      cartItemId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      quantity: 1,
      image: item.image,
      sellerName: item.sellerName,
      color: item.color || undefined,
      size: item.size || undefined,
      storage: item.storage || undefined,
      material: item.material || undefined,
    });

    toast.success(`Added "${item.name}" to your cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveTab('All Items');
    setSortBy('recent');
    setCurrentPage(1);
  };

  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <div className='w-full min-h-screen bg-white'>
      {/* Page Layout Container matching /orders */}
      <div className='mx-auto w-full max-w-[1760px] px-6 sm:px-10 md:px-16 lg:px-20 py-8 sm:py-12 flex flex-col gap-8'>
        
        {/* Title & Subtitle */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-[#0a0a0a] font-sans text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-tight'>
              Buy Again
            </h1>
            <p className='text-[14px] text-gray-500'>
              Delivered items from your order history, ready to repurchase in one click.
            </p>
          </div>
          <Link
            href='/orders'
            className='self-start sm:self-auto px-4 py-2 text-[14px] font-semibold rounded-xs border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all flex items-center gap-1.5'
          >
            <span>Your Returns &amp; Orders</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Tab Filters and Search/View Controls */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-3'>
          {/* Tab Filters */}
          <div className='flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide'>
            {BUY_AGAIN_TABS.map((tab) => {
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

          {/* Right side controls: Search, Sort, View Mode */}
          <div className='flex items-center gap-3 flex-wrap sm:flex-nowrap'>
            {/* Search Box */}
            <div className='relative flex-1 sm:w-64'>
              <Search
                size={16}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              />
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder='Search delivered items...'
                className='w-full pl-9 pr-8 py-2 text-[14px] border border-gray-300 rounded-xs bg-white text-gray-900 focus:outline-none focus:border-black placeholder:text-gray-400'
              />
              {searchTerm && (
                <button
                  type='button'
                  onClick={() => setSearchTerm('')}
                  className='absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black'
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className='px-3 py-2 text-[14px] font-medium border border-gray-300 rounded-xs bg-white text-gray-700 focus:outline-none focus:border-black cursor-pointer'
            >
              <option value='recent'>Recently Delivered</option>
              <option value='frequent'>Most Reordered</option>
              <option value='price-asc'>Price: Low to High</option>
              <option value='price-desc'>Price: High to Low</option>
              <option value='name-asc'>Product Name: A to Z</option>
            </select>

            {/* View Mode Toggle: List vs Grid */}
            <div className='flex items-center border border-gray-300 rounded-xs overflow-hidden shrink-0'>
              <button
                type='button'
                onClick={() => setViewMode('list')}
                title='List view'
                className={cn(
                  'p-2 transition-colors cursor-pointer',
                  viewMode === 'list'
                    ? 'bg-[#2b323b] text-white'
                    : 'bg-white text-gray-500 hover:text-black hover:bg-gray-50',
                )}
              >
                <List size={18} />
              </button>
              <button
                type='button'
                onClick={() => setViewMode('grid')}
                title='Grid view'
                className={cn(
                  'p-2 transition-colors cursor-pointer border-l border-gray-200',
                  viewMode === 'grid'
                    ? 'bg-[#2b323b] text-white'
                    : 'bg-white text-gray-500 hover:text-black hover:bg-gray-50',
                )}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className='flex flex-col gap-6'>
          {!authLoading && !isAuthenticated ? (
            <div className='w-full py-16 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center px-4 gap-3'>
              <span className='text-gray-600 text-[18px] font-semibold'>
                Please sign in to view your Buy Again items
              </span>
              <p className='text-gray-500 text-[14px] max-w-md'>
                Sign in to quickly access products from your delivered orders and repurchase your favorites with one click.
              </p>
              <Link
                href='/login?redirect=/buy-again'
                className='px-6 py-2.5 bg-[#dec33a] hover:bg-[#c9b034] text-black font-semibold rounded-xs transition-colors'
              >
                Sign In
              </Link>
            </div>
          ) : ordersLoading ? (
            <div className='w-full py-16 flex justify-center items-center'>
              <span className='text-gray-400 font-medium'>Loading your delivered items...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className='w-full py-16 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center px-4 gap-3'>
              <span className='text-gray-600 text-[18px] font-semibold'>
                {searchTerm ? 'No matching products found' : 'No delivered items yet'}
              </span>
              <p className='text-gray-500 text-[14px] max-w-md'>
                {searchTerm
                  ? `We couldn't find any delivered products matching "${searchTerm}". Try another search term.`
                  : 'Items from your successfully delivered orders will appear here automatically for easy one-click reordering.'}
              </p>
              {searchTerm ? (
                <button
                  type='button'
                  onClick={handleResetFilters}
                  className='px-5 py-2.5 text-[14px] font-semibold border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xs transition-colors mt-2 cursor-pointer'
                >
                  Clear Search
                </button>
              ) : (
                <div className='flex items-center gap-3 mt-2'>
                  <Link
                    href='/orders'
                    className='px-5 py-2.5 text-[14px] font-semibold border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xs transition-colors'
                  >
                    View Order History
                  </Link>
                  <Link
                    href='/products'
                    className='px-5 py-2.5 text-[14px] font-semibold bg-[#dec33a] hover:bg-[#c9b034] text-black rounded-xs transition-colors'
                  >
                    Explore Products
                  </Link>
                </div>
              )}
            </div>
          ) : viewMode === 'list' ? (
            /* ── List View (Matching /orders card styling) ── */
            <div className='flex flex-col gap-6'>
              {paginatedItems.map((item) => {
                const formattedImage = formatOrderImageUrl(item.image);

                return (
                  <div
                    key={item.id}
                    className='w-full rounded-lg overflow-hidden border border-[#e5e5e6]'
                  >
                    {/* Header */}
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#f8f9fa] border-b border-[#e5e5e6] p-4 sm:p-6 gap-4'>
                      <div className='flex flex-col gap-1 sm:gap-2'>
                        <div className='flex items-center gap-3'>
                          <span className='text-[16px] sm:text-[18px] font-bold text-gray-900'>
                            Delivered on {item.lastDeliveredDateFormatted}
                          </span>
                          <span className='px-2.5 py-0.5 text-[12px] font-bold rounded-xs border bg-emerald-50 text-emerald-700 border-emerald-200'>
                            Delivered
                          </span>
                        </div>
                        <span className='text-[14px] text-gray-500'>
                          Last Order #{item.lastOrderNumber} • Purchased {item.timesPurchased} {item.timesPurchased === 1 ? 'time' : 'times'} ({item.totalQuantityPurchased} units total)
                        </span>
                      </div>

                      <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-end'>
                          <span className='text-[18px] font-bold text-gray-900'>
                            ${item.price.toFixed(2)}
                          </span>
                          <span className='text-[13px] text-gray-500 font-medium'>
                            Unit Price
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className='bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
                      <div className='flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0'>
                        <Link
                          href={`/products/${item.slug}`}
                          className='relative border border-gray-200 rounded w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0 overflow-hidden select-none bg-gray-50 hover:opacity-95'
                        >
                          <Image
                            src={formattedImage}
                            alt={item.name}
                            fill
                            unoptimized
                            className='object-cover'
                          />
                        </Link>

                        <div className='flex flex-col gap-1 flex-1 min-w-0'>
                          <Link
                            href={`/products/${item.slug}`}
                            className='text-[16px] sm:text-[18px] font-bold text-gray-900 hover:text-[#165DD0] leading-tight line-clamp-2 transition-colors'
                          >
                            {item.name}
                          </Link>
                          <span className='text-[14px] text-gray-500'>
                            Sold by {item.sellerName}
                          </span>

                          {(item.color || item.size || item.storage || item.material) && (
                            <div className='flex flex-wrap gap-1.5 mt-1'>
                              {item.color && (
                                <span className='text-[12px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-xs'>
                                  Color: {item.color}
                                </span>
                              )}
                              {item.size && (
                                <span className='text-[12px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-xs'>
                                  Size: {item.size}
                                </span>
                              )}
                              {item.storage && (
                                <span className='text-[12px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-xs'>
                                  {item.storage}
                                </span>
                              )}
                              {item.material && (
                                <span className='text-[12px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-xs'>
                                  {item.material}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100'>
                        <Link
                          href={`/products/${item.slug}`}
                          className='px-5 py-2.5 text-[14px] font-semibold border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 rounded-xs transition-all text-center'
                        >
                          View Product
                        </Link>
                        <button
                          type='button'
                          onClick={() => handleBuyAgain(item)}
                          className='px-6 py-2.5 text-[15px] font-semibold bg-[#dec33a] text-black hover:bg-[#c9b034] active:bg-[#b49a2e] rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs'
                        >
                          <ShoppingCart size={16} />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Grid View (Matching /orders design language) ── */
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {paginatedItems.map((item) => {
                const formattedImage = formatOrderImageUrl(item.image);

                return (
                  <div
                    key={item.id}
                    className='w-full rounded-lg overflow-hidden border border-[#e5e5e6] bg-white flex flex-col justify-between hover:border-gray-400 transition-all shadow-xs'
                  >
                    {/* Header */}
                    <div className='flex items-center justify-between bg-[#f8f9fa] border-b border-[#e5e5e6] px-4 py-3'>
                      <span className='px-2 py-0.5 text-[11px] font-bold rounded-xs border bg-emerald-50 text-emerald-700 border-emerald-200'>
                        Delivered
                      </span>
                      <span className='text-[12px] text-gray-500 font-medium truncate max-w-37.5'>
                        {item.lastDeliveredDateFormatted}
                      </span>
                    </div>

                    {/* Image Frame */}
                    <Link
                      href={`/products/${item.slug}`}
                      className='relative w-full h-48 bg-white flex items-center justify-center p-3 border-b border-gray-100 overflow-hidden'
                    >
                      <Image
                        src={formattedImage}
                        alt={item.name}
                        fill
                        unoptimized
                        className='object-contain p-2 hover:scale-105 transition-transform duration-200'
                      />
                    </Link>

                    {/* Content */}
                    <div className='p-4 flex flex-col flex-1 justify-between gap-4'>
                      <div className='flex flex-col gap-1.5'>
                        <Link
                          href={`/products/${item.slug}`}
                          className='text-[15px] font-bold text-gray-900 hover:text-[#165DD0] leading-snug line-clamp-2 transition-colors'
                        >
                          {item.name}
                        </Link>
                        <span className='text-[13px] text-gray-500 truncate'>
                          Sold by {item.sellerName}
                        </span>
                        <div className='flex items-center justify-between pt-1'>
                          <span className='text-[18px] font-bold text-gray-950'>
                            ${item.price.toFixed(2)}
                          </span>
                          <span className='text-[11px] text-gray-400 font-semibold'>
                            Order #{item.lastOrderNumber}
                          </span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className='flex flex-col gap-2 pt-2 border-t border-gray-100'>
                        <button
                          type='button'
                          onClick={() => handleBuyAgain(item)}
                          className='w-full py-2.5 px-4 text-[14px] font-semibold bg-[#dec33a] text-black hover:bg-[#c9b034] active:bg-[#b49a2e] rounded-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs'
                        >
                          <ShoppingCart size={15} />
                          <span>Buy Again</span>
                        </button>
                        <Link
                          href={`/products/${item.slug}`}
                          className='text-[12px] font-semibold text-center text-gray-600 hover:text-black py-1 transition-colors'
                        >
                          View Product Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Section (matching /orders) */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-1.5 py-4'>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              type='button'
              className='px-3 py-2 text-[14px] font-semibold rounded-xs border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer text-gray-700'
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isCurrent = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  type='button'
                  className={cn(
                    'w-9 h-9 text-[14px] font-semibold rounded-xs border transition-all cursor-pointer flex items-center justify-center',
                    isCurrent
                      ? 'bg-[#2b323b] text-white border-[#2b323b]'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              type='button'
              className='px-3 py-2 text-[14px] font-semibold rounded-xs border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer text-gray-700'
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* ── Bottom Carousel & Browsing History Section matching /orders ── */}
      <div className='bg-[#F4F4F5] py-12 flex flex-col gap-12 border-t border-gray-200 mt-8'>
        <div className='mx-auto w-full max-w-[1760px] px-6 sm:px-10 md:px-16 lg:px-20'>
          <ProductCarousel
            title='Your recently viewed items'
            products={RECENTLY_VIEWED_ITEMS}
            exploreHref='/products'
          />
        </div>

        <BrowsingHistory />
      </div>

    </div>
  );
}
