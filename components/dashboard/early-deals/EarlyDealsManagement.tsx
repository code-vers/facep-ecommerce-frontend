'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Flame,
  Search,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Store,
  Tag,
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
  useUpdateProductEarlyDeal,
  useBatchUpdateEarlyDeals,
  formatProductImageUrl,
  calculateProductPrice,
  formatPriceCurrency,
} from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';
import type { Product } from '@/lib/api/product';
import { toast } from 'sonner';

export default function EarlyDealsManagement() {
  const router = useRouter();
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'ADMIN';

  // View state: 'table' or 'card'
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<'all' | 'early_deals' | 'not_deals'>('all');
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
      isEarlyDeal:
        activeTab === 'early_deals' ? true : activeTab === 'not_deals' ? false : undefined,
      status: 'active', // Only published active products
    };
  }, [currentPage, pageSize, debouncedSearch, selectedCategory, activeTab]);

  const { data, isLoading, isFetching, refetch } = useAdminProducts(queryParams);
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  const updateEarlyDealMutation = useUpdateProductEarlyDeal();
  const batchUpdateMutation = useBatchUpdateEarlyDeals();

  const products: Product[] = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: pageSize, totalPage: 1 };
  const totalPages = Math.max(1, meta.totalPage || Math.ceil((meta.total || 0) / pageSize));

  // Quick stats
  const totalPublished = meta.total || 0;
  const currentEarlyDealsOnPage = products.filter((p) => p.isEarlyDeal).length;

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

  // Toggle single product Early Deal
  const handleToggleEarlyDeal = async (product: Product) => {
    const nextStatus = !product.isEarlyDeal;
    setUpdatingProductId(product.id);
    try {
      await updateEarlyDealMutation.mutateAsync({
        id: product.id,
        isEarlyDeal: nextStatus,
      });
      toast.success(
        nextStatus
          ? `"${product.name}" marked as Early Deal!`
          : `"${product.name}" removed from Early Deals.`
      );
    } catch {
      toast.error('Failed to update Early Deal status.');
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Batch toggle
  const handleBatchUpdate = async (isEarlyDeal: boolean) => {
    if (!selectedProductIds.length) return;
    try {
      await batchUpdateMutation.mutateAsync({
        productIds: selectedProductIds,
        isEarlyDeal,
      });
      toast.success(
        isEarlyDeal
          ? `Successfully marked ${selectedProductIds.length} products as Early Deals!`
          : `Removed ${selectedProductIds.length} products from Early Deals.`
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
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#ffd014] to-[#f09000] flex items-center justify-center text-black shadow-sm">
              <Sparkles size={22} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-black">
                Early Deals Management
              </h1>
              <p className="text-xs sm:text-sm text-[#686F7D] mt-0.5">
                Mark down published products to showcase in Homepage Early Deals and the Early Deals storefront.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/early-deals"
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

        <div className="bg-white border border-[#DEC33A] rounded-[6px] p-4.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A7102]">
              Page Early Deals
            </span>
            <div className="text-2xl font-bold text-black mt-1">
              {isLoading ? '...' : currentEarlyDealsOnPage}
            </div>
          </div>
          <div className="h-11 w-11 rounded-lg bg-[#DEC33A]/20 flex items-center justify-center text-black">
            <Flame size={20} className="text-[#F09000]" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E6] rounded-[6px] p-4.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#686F7D]">
              Active Filter
            </span>
            <div className="text-2xl font-bold text-black mt-1 truncate max-w-[200px]">
              {selectedCategory === 'all' ? 'All Categories' : 'Filtered'}
            </div>
          </div>
          <div className="h-11 w-11 rounded-lg bg-[#F2F2F3] border border-[#E5E5E6] flex items-center justify-center text-black">
            <Tag size={20} />
          </div>
        </div>
      </div>

      {/* ── Main Toolbar: Filter Tabs + View Mode Switcher + Search ── */}
      <div className="flex flex-col gap-4 bg-white border border-[#E5E5E6] rounded-[6px] p-4 shadow-xs">
        {/* Row 1: Filter Tabs & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E5E6] pb-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Published ({totalPublished})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('early_deals');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all cursor-pointer ${
                activeTab === 'early_deals'
                  ? 'bg-[#DEC33A] text-black shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sparkles size={13} />
              <span>Marked as Early Deals</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('not_deals');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all cursor-pointer ${
                activeTab === 'not_deals'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Not in Deals
            </button>
          </div>

          {/* View Mode Toggle (Table View vs Card View) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#686F7D] font-medium hidden sm:inline">View:</span>
            <div className="flex items-center bg-[#F2F2F3] border border-[#E5E5E6] rounded-[4px] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-[3px] transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-black shadow-xs font-bold'
                    : 'text-[#686F7D] hover:text-black'
                }`}
              >
                <List size={14} />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                title="Card View"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-[3px] transition-all cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-white text-black shadow-xs font-bold'
                    : 'text-[#686F7D] hover:text-black'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Universal Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Universal Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, SKU, vendor name, or vendor email..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm border border-[#E5E5E6] rounded-[4px] focus:outline-none focus:border-black placeholder:text-gray-400 bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Dropdown & Page Size */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs sm:text-sm border border-[#E5E5E6] rounded-[4px] bg-white focus:outline-none focus:border-black text-gray-700 cursor-pointer min-w-[150px]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Page Size Selector */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 text-xs sm:text-sm border border-[#E5E5E6] rounded-[4px] bg-white focus:outline-none focus:border-black text-gray-700 cursor-pointer"
            >
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
            </select>

            {(debouncedSearch || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-[4px] border border-red-200 cursor-pointer transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Batch Selection Bar ── */}
        {selectedProductIds.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDF5] border border-[#DEC33A] rounded-[4px] p-3 px-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-black">
              <CheckSquare size={16} className="text-[#B4950A]" />
              <span>{selectedProductIds.length} products selected for batch action</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={batchUpdateMutation.isPending}
                onClick={() => handleBatchUpdate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#DEC33A] hover:bg-[#cbb130] text-black rounded-[4px] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {batchUpdateMutation.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Sparkles size={13} />
                )}
                <span>Mark Selected as Early Deals</span>
              </button>
              <button
                type="button"
                disabled={batchUpdateMutation.isPending}
                onClick={() => handleBatchUpdate(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#E5E5E6] text-gray-700 hover:bg-gray-100 rounded-[4px] transition-all disabled:opacity-50 cursor-pointer"
              >
                <X size={13} />
                <span>Remove from Deals</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedProductIds([])}
                className="text-xs text-gray-500 hover:text-black underline ml-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Data Presentation (TABLE VIEW or CARD VIEW) ── */}
      {viewMode === 'table' ? (
        /* ══════════════════════════════════════════════════════════
           TABLE VIEW
           ══════════════════════════════════════════════════════════ */
        <div className="w-full bg-white border border-[#E5E5E6] rounded-[6px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F2F2F3] border-b border-[#E5E5E6] text-[13px] font-semibold text-black">
                  <th className="py-3 px-3 w-[46px] text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="cursor-pointer text-gray-500 hover:text-black"
                    >
                      {isAllSelected ? (
                        <CheckSquare size={16} className="text-[#B4950A]" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Vendor / Email</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3 text-center">Early Deal Status</th>
                  <th className="py-3 px-3 text-center w-[110px]">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E5E6] text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-gray-500">
                      <Loader2 size={26} className="animate-spin mx-auto mb-2 text-[#DEC33A]" />
                      <span className="font-medium">Loading published products...</span>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-gray-500">
                      <div className="max-w-xs mx-auto flex flex-col items-center">
                        <ShoppingBag size={36} className="text-gray-300 mb-2" />
                        <p className="font-bold text-black text-sm">No products found</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try modifying your search or resetting filter criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isSelected = selectedProductIds.includes(product.id);
                    const isDeal = Boolean(product.isEarlyDeal);
                    const activePrice = calculateProductPrice(product);
                    const basePrice = Number(product.basePrice);
                    const hasDiscount = activePrice < basePrice;

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-[#FAF9F5]/80 transition-colors ${
                          isSelected ? 'bg-[#FFFBEB]/60' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(product.id)}
                            className="cursor-pointer text-gray-400 hover:text-black"
                          >
                            {isSelected ? (
                              <CheckSquare size={16} className="text-[#B4950A]" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </td>

                        {/* Product Info */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 rounded-[4px] border border-[#E5E5E6] overflow-hidden bg-white">
                              <Image
                                src={formatProductImageUrl(product.thumbnail)}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col max-w-[280px]">
                              <span
                                className="font-semibold text-black truncate"
                                title={product.name}
                              >
                                {product.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5 text-[#686F7D] text-[11px]">
                                <span>SKU: {product.sku || 'N/A'}</span>
                                {product.brand && (
                                  <>
                                    <span>•</span>
                                    <span>{product.brand}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Vendor Name & Vendor Email */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-medium text-black">
                              <Store size={13} className="text-gray-400 shrink-0" />
                              <span className="truncate">
                                {product.vendor?.storefront?.storeName ||
                                  product.vendor?.name ||
                                  'Direct Platform'}
                              </span>
                            </div>
                            {product.vendor?.email ? (
                              <div className="flex items-center gap-1.5 text-[#42454D] font-mono text-[11px]">
                                <Mail size={12} className="text-[#F09000] shrink-0" />
                                <span className="truncate">{product.vendor.email}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[11px]">No email listed</span>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="inline-block px-2 py-0.5 rounded-[3px] bg-gray-100 text-gray-700 text-[11px] font-medium">
                            {product.category?.name || 'Uncategorized'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-black text-[13px]">
                              {formatPriceCurrency(activePrice)}
                            </span>
                            {hasDiscount && (
                              <span className="text-[11px] text-gray-400 line-through">
                                {formatPriceCurrency(basePrice)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Discount */}
                        <td className="py-3 px-3">
                          {product.discountValue && Number(product.discountValue) > 0 ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                              <TrendingDown size={11} />
                              <span>
                                {product.discountValue}
                                {product.discountType === 'PERCENTAGE' ? '%' : '$'} OFF
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-[11px]">Regular Price</span>
                          )}
                        </td>

                        {/* Early Deal Toggle Status Button */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleEarlyDeal(product)}
                            disabled={updatingProductId === product.id || updateEarlyDealMutation.isPending}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all select-none ${
                              updatingProductId === product.id
                                ? 'bg-amber-50 text-black border border-[#DEC33A] cursor-wait'
                                : isDeal
                                ? 'bg-[#DEC33A] text-black shadow-xs hover:bg-[#cbb130] cursor-pointer'
                                : 'bg-[#F2F2F3] text-gray-600 hover:bg-gray-200 cursor-pointer'
                            }`}
                          >
                            {updatingProductId === product.id ? (
                              <>
                                <Loader2 size={13} className="animate-spin text-[#F09000]" />
                                <span>Updating...</span>
                              </>
                            ) : isDeal ? (
                              <>
                                <Sparkles size={13} className="text-black" />
                                <span>In Early Deals</span>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-500">+</span>
                                <span>Mark Down</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewProduct(product)}
                              className="p-1.5 rounded-[4px] text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Quick preview"
                            >
                              <Eye size={15} />
                            </button>
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-[4px] text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="View on site"
                            >
                              <ExternalLink size={15} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════
           CARD / GRID VIEW
           ══════════════════════════════════════════════════════════ */
        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={`skeleton-card-${i}`}
                  className="bg-white border border-[#E5E5E6] rounded-[6px] p-4 flex flex-col gap-3 animate-pulse"
                >
                  <div className="w-full h-44 bg-gray-200 rounded-[4px]" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#E5E5E6] rounded-[6px] p-16 text-center flex flex-col items-center justify-center">
              <ShoppingBag size={40} className="text-gray-300 mb-2" />
              <h3 className="text-base font-bold text-black">No products found</h3>
              <p className="text-xs text-gray-400 mt-1">
                Try modifying your search or changing the filter options above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
              {products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                const isDeal = Boolean(product.isEarlyDeal);
                const activePrice = calculateProductPrice(product);
                const basePrice = Number(product.basePrice);
                const hasDiscount = activePrice < basePrice;

                return (
                  <div
                    key={product.id}
                    className={`bg-white border rounded-[6px] flex flex-col justify-between overflow-hidden transition-all duration-200 group shadow-xs hover:shadow-md ${
                      isDeal
                        ? 'border-[#DEC33A] ring-1 ring-[#DEC33A]/50'
                        : isSelected
                        ? 'border-black'
                        : 'border-[#E5E5E6]'
                    }`}
                  >
                    {/* Card Top: Checkbox & Status Chip */}
                    <div className="flex items-center justify-between p-3 border-b border-[#F4F4F5] bg-[#FAF9F5]/40">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(product.id)}
                        className="cursor-pointer text-gray-400 hover:text-black flex items-center gap-1.5"
                      >
                        {isSelected ? (
                          <CheckSquare size={16} className="text-[#B4950A]" />
                        ) : (
                          <Square size={16} />
                        )}
                        <span className="text-[11px] text-gray-500 font-mono">
                          {product.sku || 'SKU'}
                        </span>
                      </button>

                      {isDeal ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DEC33A] text-black">
                          <Sparkles size={11} />
                          Early Deal
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                          Regular
                        </span>
                      )}
                    </div>

                    {/* Product Image Area */}
                    <div className="relative w-full h-44 bg-white p-2 overflow-hidden flex items-center justify-center">
                      <Image
                        src={formatProductImageUrl(product.thumbnail)}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details Area */}
                    <div className="p-3.5 flex flex-col gap-2 flex-1">
                      {/* Category Pill */}
                      <span className="text-[11px] font-semibold text-[#165DD0] uppercase tracking-wide truncate">
                        {product.category?.name || 'Category'}
                      </span>

                      {/* Product Title */}
                      <h4
                        className="text-[13px] font-bold text-black line-clamp-2 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      {/* Vendor & Vendor Email */}
                      <div className="flex flex-col gap-0.5 pt-1 text-[11px] text-[#686F7D] border-t border-[#F4F4F5]">
                        <div className="flex items-center gap-1 font-medium text-black truncate">
                          <Store size={12} className="text-gray-400 shrink-0" />
                          <span className="truncate">
                            {product.vendor?.storefront?.storeName ||
                              product.vendor?.name ||
                              'Direct Platform'}
                          </span>
                        </div>
                        {product.vendor?.email && (
                          <div className="flex items-center gap-1 text-[#42454D] font-mono text-[10px] truncate">
                            <Mail size={11} className="text-[#F09000] shrink-0" />
                            <span className="truncate">{product.vendor.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Pricing Block */}
                      <div className="flex items-center justify-between pt-2 mt-auto">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-black">
                            {formatPriceCurrency(activePrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPriceCurrency(basePrice)}
                            </span>
                          )}
                        </div>

                        {product.discountValue && Number(product.discountValue) > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            {product.discountValue}
                            {product.discountType === 'PERCENTAGE' ? '%' : '$'} OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 border-t border-[#E5E5E6] bg-[#FAF9F5] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleEarlyDeal(product)}
                        disabled={updatingProductId === product.id || updateEarlyDealMutation.isPending}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-[4px] transition-all shadow-xs ${
                          updatingProductId === product.id
                            ? 'bg-amber-50 text-black border border-[#DEC33A] cursor-wait'
                            : isDeal
                            ? 'bg-[#DEC33A] hover:bg-[#cbb130] text-black cursor-pointer'
                            : 'bg-white hover:bg-gray-100 text-black border border-[#E5E5E6] cursor-pointer'
                        }`}
                      >
                        {updatingProductId === product.id ? (
                          <>
                            <Loader2 size={13} className="animate-spin text-[#F09000]" />
                            <span>Updating...</span>
                          </>
                        ) : isDeal ? (
                          <>
                            <Sparkles size={13} />
                            <span>In Early Deals</span>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-400">+</span>
                            <span>Mark as Early Deal</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreviewProduct(product)}
                        className="p-2 rounded-[4px] bg-white border border-[#E5E5E6] text-gray-600 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                        title="Quick View"
                      >
                        <Eye size={15} />
                      </button>

                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="p-2 rounded-[4px] bg-white border border-[#E5E5E6] text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors cursor-pointer"
                        title="View on site"
                      >
                        <ExternalLink size={15} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Perfect Full-Featured Pagination Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-[#E5E5E6] rounded-[6px] bg-white shadow-xs">
        {/* Info label */}
        <div className="text-xs text-[#686F7D]">
          Showing{' '}
          <span className="font-bold text-black">
            {meta.total === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-bold text-black">
            {Math.min(currentPage * pageSize, meta.total || 0)}
          </span>{' '}
          of <span className="font-bold text-black">{meta.total || 0}</span> products
        </div>

        {/* Page controls */}
        <div className="flex items-center gap-1 select-none">
          {/* Previous Button */}
          <button
            type="button"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`flex items-center gap-1 py-1.5 px-3 text-xs font-semibold rounded-[4px] transition-colors ${
              currentPage <= 1 || isFetching
                ? 'opacity-40 pointer-events-none text-gray-400'
                : 'hover:bg-[#F2F2F3] text-black cursor-pointer'
            }`}
          >
            <ChevronLeft size={15} />
            <span>Previous</span>
          </button>

          {/* Numbered Buttons & Ellipsis */}
          {paginationRange.map((pageItem, index) => {
            if (typeof pageItem === 'string') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="h-8 w-8 flex items-center justify-center text-xs text-gray-400"
                >
                  ...
                </span>
              );
            }

            const isCurrent = pageItem === currentPage;

            return (
              <button
                key={`page-${pageItem}`}
                type="button"
                onClick={() => setCurrentPage(pageItem)}
                className={`h-8 w-8 flex items-center justify-center text-xs font-bold rounded-[4px] transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#DEC33A] text-black border border-[#B4950A] shadow-xs'
                    : 'hover:bg-[#F2F2F3] text-black'
                }`}
              >
                {pageItem}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            type="button"
            disabled={currentPage >= totalPages || isFetching}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={`flex items-center gap-1 py-1.5 px-3 text-xs font-semibold rounded-[4px] transition-colors ${
              currentPage >= totalPages || isFetching
                ? 'opacity-40 pointer-events-none text-gray-400'
                : 'hover:bg-[#F2F2F3] text-black cursor-pointer'
            }`}
          >
            <span>Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Quick Preview Modal ── */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[8px] shadow-2xl max-w-lg w-full overflow-hidden border border-[#E5E5E6] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E5E6] px-5 py-4 bg-[#FAF9F5]">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#F09000]" />
                <h3 className="font-bold text-black text-sm truncate max-w-sm">
                  {previewProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="relative h-48 w-full rounded-[4px] border border-[#E5E5E6] overflow-hidden bg-white">
                <Image
                  src={formatProductImageUrl(previewProduct.thumbnail)}
                  alt={previewProduct.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF9F5] p-3 rounded-[6px] border border-[#E5E5E6]">
                <div>
                  <span className="text-[#686F7D] block font-medium">Vendor Store</span>
                  <span className="font-bold text-black">
                    {previewProduct.vendor?.storefront?.storeName ||
                      previewProduct.vendor?.name ||
                      'Direct'}
                  </span>
                </div>
                <div>
                  <span className="text-[#686F7D] block font-medium">Vendor Email</span>
                  <span className="font-mono text-black font-semibold">
                    {previewProduct.vendor?.email || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#686F7D] block font-medium">Category</span>
                  <span className="font-semibold text-black">
                    {previewProduct.category?.name || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#686F7D] block font-medium">Pricing</span>
                  <span className="font-extrabold text-black text-sm">
                    {formatPriceCurrency(calculateProductPrice(previewProduct))}
                  </span>
                </div>
              </div>

              {previewProduct.shortDescription && (
                <p className="text-xs text-gray-600 line-clamp-3 bg-gray-50 p-2.5 rounded-[4px]">
                  {previewProduct.shortDescription}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#E5E5E6] px-5 py-3.5 bg-gray-50">
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-[4px] border border-[#E5E5E6] bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={updatingProductId === previewProduct.id}
                onClick={async () => {
                  await handleToggleEarlyDeal(previewProduct);
                  setPreviewProduct((prev) =>
                    prev ? { ...prev, isEarlyDeal: !prev.isEarlyDeal } : null
                  );
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-[4px] transition-colors flex items-center gap-1.5 ${
                  updatingProductId === previewProduct.id
                    ? 'bg-amber-100 text-black border border-[#DEC33A] cursor-wait'
                    : previewProduct.isEarlyDeal
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer'
                    : 'bg-[#DEC33A] hover:bg-[#cbb130] text-black shadow-xs cursor-pointer'
                }`}
              >
                {updatingProductId === previewProduct.id ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-[#F09000]" />
                    <span>Updating...</span>
                  </>
                ) : previewProduct.isEarlyDeal ? (
                  'Remove from Early Deals'
                ) : (
                  'Mark as Early Deal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
