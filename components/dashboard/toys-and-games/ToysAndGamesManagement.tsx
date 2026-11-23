'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gamepad2,
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
  useUpdateProductToysAndGamesStatus,
  useBatchUpdateToysAndGames,
  formatProductImageUrl,
  calculateProductPrice,
  formatPriceCurrency,
} from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';
import type { Product } from '@/lib/api/product';
import { toast } from 'sonner';

export default function ToysAndGamesManagement() {
  const router = useRouter();
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'ADMIN';

  // View state: 'table' or 'card'
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<'all' | 'toys_and_games' | 'not_toys_and_games'>('all');
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
      isToysAndGames:
        activeTab === 'toys_and_games' ? true : activeTab === 'not_toys_and_games' ? false : undefined,
      status: 'active', // Only published active products
    };
  }, [currentPage, pageSize, debouncedSearch, selectedCategory, activeTab]);

  const { data, isLoading, isFetching, refetch } = useAdminProducts(queryParams);
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  const updateToysMutation = useUpdateProductToysAndGamesStatus();
  const batchUpdateMutation = useBatchUpdateToysAndGames();

  const products: Product[] = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: pageSize, totalPage: 1 };
  const totalPages = Math.max(1, meta.totalPage || Math.ceil((meta.total || 0) / pageSize));

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

  // Toggle single product Toys & Games status with loader
  const handleToggleToysAndGames = async (product: Product) => {
    const nextStatus = !product.isToysAndGames;
    setUpdatingProductId(product.id);
    try {
      await updateToysMutation.mutateAsync({
        id: product.id,
        isToysAndGames: nextStatus,
      });
      toast.success(
        nextStatus
          ? `"${product.name}" added to Toys & Games!`
          : `"${product.name}" removed from Toys & Games.`
      );
    } catch {
      toast.error('Failed to update Toys & Games status.');
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Batch toggle
  const handleBatchUpdate = async (isToysAndGames: boolean) => {
    if (!selectedProductIds.length) return;
    try {
      await batchUpdateMutation.mutateAsync({
        productIds: selectedProductIds,
        isToysAndGames,
      });
      toast.success(
        isToysAndGames
          ? `Successfully added ${selectedProductIds.length} products to Toys & Games!`
          : `Removed ${selectedProductIds.length} products from Toys & Games.`
      );
      setSelectedProductIds([]);
    } catch {
      toast.error('Failed to perform batch update.');
    }
  };

  // Pagination helper
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
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Gamepad2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-black">
                Toys &amp; Games Management
              </h1>
              <p className="text-xs sm:text-sm text-[#686F7D] mt-0.5">
                Curate toys, board games, video games, outdoor play, and entertainment for the live Toys &amp; Games catalog.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/toys-and-games"
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
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Filter & Search Control Panel ── */}
      <div className="flex flex-col gap-4 bg-white border border-[#E5E5E6] rounded-md p-4 sm:p-5 shadow-xs">
        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              All Products
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('toys_and_games');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'toys_and_games'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Gamepad2 size={13} className="text-indigo-600" />
              <span>In Toys &amp; Games</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('not_toys_and_games');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'not_toys_and_games'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Not in Toys &amp; Games
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 border border-[#E5E5E6] rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#F5F5F7] text-black font-bold' : 'text-gray-400 hover:text-black'
              }`}
              title="Table view"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                viewMode === 'card' ? 'bg-[#F5F5F7] text-black font-bold' : 'text-gray-400 hover:text-black'
              }`}
              title="Card grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Search, Category Filter & Page Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="relative sm:col-span-2 lg:col-span-6">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, SKU, or brand..."
              className="w-full pl-9 pr-9 py-2 text-xs bg-[#F9FAFB] border border-[#E5E5E6] rounded-md focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-1 lg:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-[#F9FAFB] border border-[#E5E5E6] rounded-md focus:outline-none focus:border-black focus:bg-white transition-colors text-gray-700 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Page size dropdown */}
          <div className="sm:col-span-1 lg:col-span-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-[#F9FAFB] border border-[#E5E5E6] rounded-md focus:outline-none focus:border-black focus:bg-white transition-colors text-gray-700 cursor-pointer"
            >
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
          </div>
        </div>

        {/* Batch Action Bar (Appears when items are selected) */}
        {selectedProductIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50/80 border border-indigo-200 rounded-md px-4 py-2.5 transition-all">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
              <CheckSquare size={16} className="text-indigo-600" />
              <span>
                {selectedProductIds.length} product{selectedProductIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBatchUpdate(true)}
                disabled={batchUpdateMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {batchUpdateMutation.isPending && <Loader2 size={13} className="animate-spin" />}
                <span>Add to Toys &amp; Games</span>
              </button>
              <button
                type="button"
                onClick={() => handleBatchUpdate(false)}
                disabled={batchUpdateMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 border border-gray-300 rounded-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>Remove from Toys &amp; Games</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedProductIds([])}
                className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Products Display (Table or Grid) ── */}
      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-white border border-[#E5E5E6] rounded-md gap-3">
          <Loader2 size={32} className="animate-spin text-[#DEC33A]" />
          <p className="text-xs text-gray-500 font-medium">Loading catalog products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-16 bg-white border border-[#E5E5E6] rounded-md gap-3 text-center px-4">
          <div className="size-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Gamepad2 size={24} />
          </div>
          <h3 className="text-sm font-bold text-black">No products found</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            {searchTerm || selectedCategory !== 'all' || activeTab !== 'all'
              ? 'Try adjusting your search criteria or switching to a different tab.'
              : 'There are currently no active products in your store to display.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="w-full bg-white border border-[#E5E5E6] rounded-md shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#E5E5E6] text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-gray-500 hover:text-black cursor-pointer flex items-center"
                    >
                      {isAllSelected ? (
                        <CheckSquare size={16} className="text-indigo-600" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 min-w-[280px]">Product</th>
                  <th className="py-3 px-4 min-w-[130px]">Category</th>
                  <th className="py-3 px-4 min-w-[100px]">Price</th>
                  <th className="py-3 px-4 min-w-[90px]">Stock</th>
                  <th className="py-3 px-4 min-w-[150px] text-center">Toys &amp; Games Status</th>
                  <th className="py-3 px-4 min-w-[90px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E6]">
                {products.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);
                  const isUpdating = updatingProductId === product.id;
                  const price = calculateProductPrice(product);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-[#F9FAFB] transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(product.id)}
                          className="text-gray-500 hover:text-black cursor-pointer flex items-center"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-indigo-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>

                      {/* Product details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 rounded-md border border-[#E5E5E6] overflow-hidden bg-gray-50 shrink-0">
                            <Image
                              src={formatProductImageUrl(product.thumbnail)}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="font-semibold text-black hover:text-[#165DD0] line-clamp-1 text-xs"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                              <span>SKU: {product.sku}</span>
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

                      {/* Category */}
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {product.category?.name || 'Unassigned'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-black">
                            {formatPriceCurrency(price)}
                          </span>
                          {product.oldPrice && Number(product.oldPrice) > price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatPriceCurrency(Number(product.oldPrice))}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            product.stockQuantity > 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Switch Toggle */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleToysAndGames(product)}
                            disabled={isUpdating}
                            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              product.isToysAndGames ? 'bg-indigo-600' : 'bg-gray-200'
                            } disabled:opacity-50`}
                          >
                            <span
                              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                product.isToysAndGames ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          {isUpdating ? (
                            <Loader2 size={13} className="animate-spin text-gray-400" />
                          ) : (
                            <span
                              className={`text-[11px] font-semibold ${
                                product.isToysAndGames ? 'text-indigo-600' : 'text-gray-400'
                              }`}
                            >
                              {product.isToysAndGames ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewProduct(product)}
                            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-sm transition-colors cursor-pointer"
                            title="Preview item"
                          >
                            <Eye size={15} />
                          </button>
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-sm transition-colors"
                            title="Open in new tab"
                          >
                            <ExternalLink size={14} />
                          </Link>
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
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const isSelected = selectedProductIds.includes(product.id);
            const isUpdating = updatingProductId === product.id;
            const price = calculateProductPrice(product);

            return (
              <div
                key={product.id}
                className={`flex flex-col bg-white border rounded-md overflow-hidden transition-all shadow-xs relative ${
                  isSelected ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-[#E5E5E6] hover:border-gray-300'
                }`}
              >
                {/* Select button top-left */}
                <button
                  type="button"
                  onClick={() => toggleSelectOne(product.id)}
                  className="absolute top-2.5 left-2.5 z-10 p-1 rounded-sm bg-white/90 backdrop-blur-xs shadow-xs text-gray-600 hover:text-black cursor-pointer"
                >
                  {isSelected ? (
                    <CheckSquare size={16} className="text-indigo-600" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>

                {/* Badge top-right */}
                {product.isToysAndGames && (
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    <Gamepad2 size={11} />
                    <span>In Toys &amp; Games</span>
                  </div>
                )}

                {/* Thumbnail */}
                <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                  <Image
                    src={formatProductImageUrl(product.thumbnail)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-3.5 gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    {product.category?.name || 'Department'}
                  </span>

                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="font-semibold text-xs text-black hover:text-[#165DD0] line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-baseline gap-2 mt-auto pt-2">
                    <span className="font-extrabold text-sm text-black">
                      {formatPriceCurrency(price)}
                    </span>
                    {product.oldPrice && Number(product.oldPrice) > price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPriceCurrency(Number(product.oldPrice))}
                      </span>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-1">
                    <button
                      type="button"
                      onClick={() => handleToggleToysAndGames(product)}
                      disabled={isUpdating}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                        product.isToysAndGames
                          ? 'bg-indigo-50 text-indigo-700 hover:bg-red-50 hover:text-red-700'
                          : 'bg-[#DEC33A] text-black hover:bg-[#cbb130]'
                      } disabled:opacity-50`}
                    >
                      {isUpdating ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Gamepad2 size={13} />
                      )}
                      <span>
                        {product.isToysAndGames ? 'Remove' : 'Add to Catalog'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewProduct(product)}
                      className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-sm transition-colors cursor-pointer"
                      title="Quick Preview"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination Bar ── */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E5E5E6] rounded-md px-4 py-3 shadow-xs">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-black">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-black">
              {Math.min(currentPage * pageSize, meta.total || 0)}
            </span>{' '}
            of <span className="font-semibold text-black">{meta.total}</span> products
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-sm border border-[#E5E5E6] hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {paginationRange.map((page, idx) =>
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  type="button"
                  onClick={() => setCurrentPage(Number(page))}
                  className={`min-w-8 h-8 px-2 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'border border-[#E5E5E6] text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-sm border border-[#E5E5E6] hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Quick Product Preview Modal ── */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl relative border border-[#E5E5E6] flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setPreviewProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative size-20 rounded-md border border-[#E5E5E6] overflow-hidden bg-gray-50 shrink-0">
                <Image
                  src={formatProductImageUrl(previewProduct.thumbnail)}
                  alt={previewProduct.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm text-black line-clamp-2">{previewProduct.name}</h3>
                <span className="text-xs text-gray-500 mt-1">SKU: {previewProduct.sku}</span>
                <span className="text-xs font-bold text-indigo-700 mt-1">
                  {formatPriceCurrency(calculateProductPrice(previewProduct))}
                </span>
              </div>
            </div>

            {previewProduct.shortDescription && (
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md line-clamp-3">
                {previewProduct.shortDescription}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-500">
                Status:{' '}
                <strong className={previewProduct.isToysAndGames ? 'text-indigo-600' : 'text-gray-600'}>
                  {previewProduct.isToysAndGames ? 'In Toys & Games' : 'Not Featured'}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${previewProduct.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  View Live
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await handleToggleToysAndGames(previewProduct);
                    setPreviewProduct(null);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-black bg-[#DEC33A] hover:bg-[#cbb130] rounded-sm"
                >
                  {previewProduct.isToysAndGames ? 'Remove' : 'Add to Toys & Games'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
