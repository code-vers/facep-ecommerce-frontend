'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gift,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
  CheckSquare,
  Square,
  TrendingDown,
  ShoppingBag,
  ExternalLink,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  useAdminProducts,
  useUpdateProductHolidayDealStatus,
  useBatchUpdateHolidayDeals,
  formatProductImageUrl,
  calculateProductPrice,
  formatPriceCurrency,
} from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';
import type { Product } from '@/lib/api/product';
import { toast } from 'sonner';

export default function HolidayDealsManagement() {
  const router = useRouter();
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'ADMIN';

  // View state: 'table' or 'card'
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<'all' | 'holiday_deals' | 'not_holiday'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pageSize, setPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Auth guard
  useEffect(() => {
    if (session && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [session, isAdmin, router]);

  // API Query parameters
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch || undefined,
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      isHolidayDeal:
        activeTab === 'holiday_deals' ? true : activeTab === 'not_holiday' ? false : undefined,
      status: 'active', // Only published active products
    };
  }, [currentPage, pageSize, debouncedSearch, selectedCategory, activeTab]);

  const { data, isLoading, isFetching, refetch } = useAdminProducts(queryParams);
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  const updateHolidayMutation = useUpdateProductHolidayDealStatus();
  const batchUpdateMutation = useBatchUpdateHolidayDeals();

  const products: Product[] = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: pageSize, totalPage: 1 };
  const totalPages = Math.max(1, meta.totalPage || Math.ceil((meta.total || 0) / pageSize));

  // Quick stats
  const totalPublished = meta.total || 0;

  // Selection helpers
  const isAllSelected =
    products.length > 0 && products.every((p) => selectedProductIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle single product Holiday Deal status with loader
  const handleToggleHolidayDeal = async (product: Product) => {
    const nextStatus = !product.isHolidayDeal;
    setUpdatingProductId(product.id);
    try {
      await updateHolidayMutation.mutateAsync({
        id: product.id,
        isHolidayDeal: nextStatus,
      });
      toast.success(
        nextStatus
          ? `"${product.name}" added to Holiday Deals!`
          : `"${product.name}" removed from Holiday Deals.`
      );
    } catch {
      toast.error('Failed to update Holiday Deal status.');
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Batch toggle
  const handleBatchUpdate = async (isHolidayDeal: boolean) => {
    if (!selectedProductIds.length) return;
    try {
      await batchUpdateMutation.mutateAsync({
        productIds: selectedProductIds,
        isHolidayDeal,
      });
      toast.success(
        isHolidayDeal
          ? `Successfully added ${selectedProductIds.length} products to Holiday Deals!`
          : `Removed ${selectedProductIds.length} products from Holiday Deals.`
      );
      setSelectedProductIds([]);
    } catch {
      toast.error('Failed to perform batch update.');
    }
  };

  // Pagination helper: generates array of page numbers with ellipsis
  const paginationRange = useMemo(() => {
    const total = totalPages;
    const current = currentPage;
    const delta = 2;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }
    if (right < total - 1) pages.push('...');
    pages.push(total);

    return pages;
  }, [totalPages, currentPage]);

  if (session && !isAdmin) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1680px] mx-auto min-h-screen">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E6] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
              <Gift size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-black">
                Holiday Deals Campaign Management
              </h1>
              <p className="text-xs sm:text-sm text-[#686F7D] mt-0.5">
                Curate festive offers, seasonal discounts, and gift selections for the live Holiday Deals catalog.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/holiday-deals"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-[#E5E5E6] rounded-sm hover:bg-gray-50 transition-all shadow-xs"
          >
            <Eye size={15} />
            <span>Storefront View</span>
            <ExternalLink size={12} className="text-gray-400" />
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-[#DEC33A] hover:bg-[#cbb130] rounded-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* ── Summary Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E5E6] rounded-[6px] p-4.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#686F7D]">
              Total Published Products
            </span>
            <div className="text-2xl font-bold text-black mt-1">
              {isLoading ? '...' : totalPublished.toLocaleString()}
            </div>
          </div>
          <div className="h-11 w-11 rounded-lg bg-[#F2F2F3] border border-[#E5E5E6] flex items-center justify-center text-black">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="bg-white border border-rose-300 rounded-[6px] p-4.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">
              Holiday Deals (Live)
            </span>
            <div className="text-2xl font-bold text-black mt-1">
              {isLoading ? (
                '...'
              ) : activeTab === 'holiday_deals' ? (
                meta.total.toLocaleString()
              ) : (
                <span className="text-sm font-semibold text-rose-600">
                  Switch to Holiday Deals tab
                </span>
              )}
            </div>
          </div>
          <div className="h-11 w-11 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Gift size={20} />
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E6] rounded-[6px] p-4.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#686F7D]">
              Active Festive Discounts
            </span>
            <div className="text-2xl font-bold text-black mt-1">
              {products.filter((p) => Number(p.discountValue || 0) > 0).length} on page
            </div>
          </div>
          <div className="h-11 w-11 rounded-lg bg-[#F2F2F3] border border-[#E5E5E6] flex items-center justify-center text-black">
            <TrendingDown size={20} />
          </div>
        </div>
      </div>

      {/* ── Filters & Controls Bar ── */}
      <div className="bg-white border border-[#E5E5E6] rounded-[6px] p-4 flex flex-col gap-4 shadow-xs">
        {/* Top: Status Tabs + View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E6] pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
                setSelectedProductIds([]);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-[#565959] hover:bg-gray-200'
              }`}
            >
              All Products
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('holiday_deals');
                setCurrentPage(1);
                setSelectedProductIds([]);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'holiday_deals'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <Gift size={13} />
              Holiday Deals (Live)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('not_holiday');
                setCurrentPage(1);
                setSelectedProductIds([]);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'not_holiday'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-[#565959] hover:bg-gray-200'
              }`}
            >
              Not in Holiday Deals
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-sm border cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-[#E5E5E6] hover:bg-gray-50'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-sm border cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-[#E5E5E6] hover:bg-gray-50'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Bottom: Search Input + Category Filter + Page Size */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by product name, SKU, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-[#E5E5E6] rounded-sm focus:border-black focus:outline-none bg-white text-black placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs border border-[#E5E5E6] rounded-sm focus:border-black focus:outline-none bg-white text-black"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Page Size */}
          <div className="sm:col-span-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs border border-[#E5E5E6] rounded-sm focus:border-black focus:outline-none bg-white text-black"
            >
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
            </select>
          </div>
        </div>

        {/* ── Multi-select Batch Action Bar ── */}
        {selectedProductIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-rose-50 border border-rose-200 rounded-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-900">
                {selectedProductIds.length} item{selectedProductIds.length > 1 ? 's' : ''} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedProductIds([])}
                className="text-[11px] text-gray-500 hover:text-black underline cursor-pointer"
              >
                Deselect all
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBatchUpdate(true)}
                disabled={batchUpdateMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-sm transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Gift size={13} />
                <span>Add to Holiday Deals</span>
              </button>
              <button
                type="button"
                onClick={() => handleBatchUpdate(false)}
                disabled={batchUpdateMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-800 bg-white border border-[#E5E5E6] hover:bg-gray-100 rounded-sm transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <X size={13} />
                <span>Remove from Holiday Deals</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Products List View ── */}
      {isLoading ? (
        <div className="w-full bg-white border border-[#E5E5E6] rounded-[6px] p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-rose-500" />
          <span className="text-sm font-semibold text-gray-500">
            Loading products catalog...
          </span>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full bg-white border border-[#E5E5E6] rounded-[6px] p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="h-14 w-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
            <Gift size={28} />
          </div>
          <h3 className="text-base font-bold text-black">No products found</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Try adjusting your search criteria, category filter, or status tab.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* ── TABLE VIEW ── */
        <div className="w-full bg-white border border-[#E5E5E6] rounded-[6px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#E5E5E6] text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-gray-500 hover:text-black cursor-pointer"
                      title={isAllSelected ? 'Deselect all' : 'Select all on page'}
                    >
                      {isAllSelected ? (
                        <CheckSquare size={16} className="text-rose-600" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price &amp; Deal</th>
                  <th className="py-3 px-3">Holiday Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E6] text-xs">
                {products.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);
                  const isUpdating = updatingProductId === product.id;
                  const finalPrice = calculateProductPrice(product);
                  const hasDiscount = Number(product.discountValue || 0) > 0;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        isSelected ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(product.id)}
                          className="text-gray-400 hover:text-black cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-rose-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>

                      {/* Product Thumbnail + Name + SKU */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded border border-gray-200 bg-gray-50 overflow-hidden relative shrink-0">
                            <Image
                              src={formatProductImageUrl(product.thumbnail)}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex flex-col max-w-[320px]">
                            <span className="font-semibold text-black line-clamp-1 hover:text-[#165DD0]">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              SKU: {product.sku || 'N/A'}
                            </span>
                            {product.vendor?.storefront?.storeName && (
                              <span className="text-[10px] text-gray-400">
                                Sold by: {product.vendor.storefront.storeName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Price & Discount */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-black">
                            {formatPriceCurrency(finalPrice)}
                          </span>
                          {hasDiscount && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="line-through text-gray-400">
                                {formatPriceCurrency(product.basePrice)}
                              </span>
                              <span className="font-bold text-rose-600">
                                -{product.discountType === 'PERCENTAGE'
                                  ? `${product.discountValue}%`
                                  : `$${product.discountValue}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Holiday Status Badge */}
                      <td className="py-3 px-3">
                        {product.isHolidayDeal ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                            <Gift size={12} className="text-rose-600" />
                            Holiday Deal
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] text-gray-400">
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Holiday Deal Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleHolidayDeal(product)}
                            disabled={isUpdating}
                            className={`p-1.5 rounded-sm border transition-all cursor-pointer ${
                              product.isHolidayDeal
                                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                                : 'bg-white text-gray-400 border-gray-200 hover:text-black hover:border-black'
                            }`}
                            title={
                              product.isHolidayDeal
                                ? 'Remove from Holiday Deals'
                                : 'Add to Holiday Deals'
                            }
                          >
                            {isUpdating ? (
                              <Loader2 size={15} className="animate-spin text-rose-600" />
                            ) : (
                              <Gift
                                size={15}
                                className={product.isHolidayDeal ? 'text-rose-600' : ''}
                              />
                            )}
                          </button>

                          {/* Quick Preview Button */}
                          <button
                            type="button"
                            onClick={() => setPreviewProduct(product)}
                            className="p-1.5 rounded-sm border border-gray-200 text-gray-500 hover:text-black hover:border-black bg-white transition-all cursor-pointer"
                            title="Quick View Details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── CARD GRID VIEW ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => {
            const isSelected = selectedProductIds.includes(product.id);
            const isUpdating = updatingProductId === product.id;
            const finalPrice = calculateProductPrice(product);
            const hasDiscount = Number(product.discountValue || 0) > 0;

            return (
              <div
                key={product.id}
                className={`bg-white border rounded-[6px] p-3.5 flex flex-col justify-between transition-all relative shadow-xs ${
                  product.isHolidayDeal
                    ? 'border-rose-300 ring-1 ring-rose-300/50'
                    : 'border-[#E5E5E6]'
                } ${isSelected ? 'bg-rose-50/40' : ''}`}
              >
                {/* Top Corner Badge & Checkbox */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => toggleSelectOne(product.id)}
                    className="text-gray-400 hover:text-black cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare size={16} className="text-rose-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>

                  {product.isHolidayDeal && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                      <Gift size={11} className="text-rose-600" />
                      Holiday Deal
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="w-full aspect-square rounded bg-gray-50 border border-gray-100 overflow-hidden relative mb-2.5">
                  <Image
                    src={formatProductImageUrl(product.thumbnail)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      -{product.discountType === 'PERCENTAGE'
                        ? `${product.discountValue}%`
                        : `$${product.discountValue}`}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] text-gray-500 font-medium">
                    {product.category?.name || 'Category'}
                  </span>
                  <h4 className="text-xs font-semibold text-black line-clamp-2 mt-0.5">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm font-bold text-black">
                      {formatPriceCurrency(finalPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPriceCurrency(product.basePrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewProduct(product)}
                    className="px-2.5 py-1 text-xs text-gray-600 hover:text-black border border-gray-200 rounded-sm hover:border-black transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleHolidayDeal(product)}
                    disabled={isUpdating}
                    className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                      product.isHolidayDeal
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isUpdating ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Gift size={13} />
                    )}
                    <span>{product.isHolidayDeal ? 'In Deals' : 'Add Deal'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination Controls ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E5E5E6] rounded-[6px] p-4 shadow-xs">
          <span className="text-xs text-gray-500">
            Showing{' '}
            <strong className="text-black">
              {(currentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-black">
              {Math.min(currentPage * pageSize, meta.total)}
            </strong>{' '}
            of <strong className="text-black">{meta.total}</strong> products
          </span>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-sm border border-[#E5E5E6] text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {paginationRange.map((page, index) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-xs text-gray-400 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  type="button"
                  onClick={() => setCurrentPage(Number(page))}
                  className={`min-w-7 h-7 px-2 text-xs font-semibold rounded-sm border transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-[#E5E5E6] hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-sm border border-[#E5E5E6] text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Quick Product Preview Modal ── */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-xl">
            <button
              type="button"
              onClick={() => setPreviewProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer p-1"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-44 aspect-square rounded-md overflow-hidden bg-gray-50 relative shrink-0 border border-gray-100">
                <Image
                  src={formatProductImageUrl(previewProduct.thumbnail)}
                  alt={previewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">
                      {previewProduct.category?.name || 'Category'}
                    </span>
                    {previewProduct.isHolidayDeal && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                        <Gift size={11} className="text-rose-600" />
                        Holiday Deal
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-black leading-snug">
                    {previewProduct.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    SKU: {previewProduct.sku || 'N/A'}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-black">
                      {formatPriceCurrency(calculateProductPrice(previewProduct))}
                    </span>
                    {Number(previewProduct.discountValue || 0) > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPriceCurrency(previewProduct.basePrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/products/${previewProduct.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-[#165DD0] hover:underline flex items-center gap-1"
                  >
                    <span>Open product page</span>
                    <ExternalLink size={12} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      handleToggleHolidayDeal(previewProduct);
                      setPreviewProduct((prev) =>
                        prev ? { ...prev, isHolidayDeal: !prev.isHolidayDeal } : null
                      );
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                      previewProduct.isHolidayDeal
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <Gift size={13} />
                    <span>
                      {previewProduct.isHolidayDeal
                        ? 'Remove from Holiday Deals'
                        : 'Add to Holiday Deals'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
