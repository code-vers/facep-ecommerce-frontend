'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Eye,
  PenLine,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  FolderKanban,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useVendorProducts, useDeleteProduct } from '@/hooks/api/useProduct';
import { useCategories } from '@/hooks/api/useCategory';
import type { Product } from '@/lib/api/product';

// Helper to construct absolute image URL for backend uploads
const getImageUrl = (path?: string | null) => {
  if (!path) return '/placeholder.png';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '')
    : 'http://localhost:5000';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Helper to format title accurately from API response fields
const getProductTitle = (product: Product) => {
  if (product.name && product.name.trim()) return product.name;
  if (product.brand && product.brand.trim()) return product.brand;
  if (product.productType && product.productType.trim()) return product.productType;
  if (product.shortDescription && product.shortDescription.trim()) return product.shortDescription;
  return product.sku || 'Untitled Product';
};

// Helper to format category name
const getCategoryName = (product: Product) => {
  if (product.category?.name) return product.category.name;
  if (product.subcategory?.name) return product.subcategory.name;
  return 'Uncategorized';
};

// Helper to format price string/number
const formatPrice = (price?: number | string | null) => {
  if (price === undefined || price === null) return '$0.00';
  const num = typeof price === 'number' ? price : parseFloat(price);
  return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
};

export default function ProductTable() {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'ADMIN';

  // State for search, filter & pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  // Fetch real product data via TanStack Query hook
  const { data, isLoading, isError, refetch } = useVendorProducts({
    page: currentPage,
    limit,
    searchTerm: searchTerm || undefined,
    categoryId: selectedCategory || undefined,
    status: selectedStatus !== 'All' ? selectedStatus : undefined,
  });

  // Fetch categories for category filter dropdown
  const { data: categoryData } = useCategories(1, 100);
  const categories = categoryData?.data || [];

  // Delete product hook
  const deleteProductMutation = useDeleteProduct();

  const products: Product[] = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete product "${title}"?`)) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-white border border-[#E5E5E6] rounded-[4px] shadow-sm w-full">
      {/* ── Action & Filter Header Bar ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
        {/* Title */}
        <div>
          <h2 className="text-[20px] font-semibold font-sans leading-[1.2] text-black">
            Products Catalog
          </h2>
          <p className="text-[13px] text-[#686F7D] mt-0.5">
            {isAdmin ? 'Showing all products across all vendors' : 'Manage your product inventory'}
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input Field */}
          <div className="relative w-full sm:w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848995]" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search product, SKU..."
              className="w-full bg-white border border-[#E5E5E6] rounded-[2px] pl-9 pr-8 py-2 text-[14px] leading-[1.3] text-[#42454D] placeholder-[#848995] focus:outline-none focus:border-[#F09000]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#848995] hover:text-black"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full sm:w-[180px]">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none bg-white border border-[#E5E5E6] rounded-[2px] px-3 py-2 text-[14px] leading-[1.3] text-[#42454D] focus:outline-none focus:border-[#F09000] cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#848995]">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full sm:w-[160px]">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none bg-white border border-[#E5E5E6] rounded-[2px] px-3 py-2 text-[14px] leading-[1.3] text-[#42454D] focus:outline-none focus:border-[#F09000] cursor-pointer"
            >
              <option value="All">Filter By Status</option>
              <option value="Active">Active</option>
              <option value="Out Of Stock">Out Of Stock</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#848995]">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Category & Add New Product Buttons - Shown for Vendor, hidden for Admin */}
          {!isAdmin && (
            <>
              <Link
                href="/dashboard/categories"
                className="flex h-9 items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-[#E5E5E6] text-[#42454D] font-sans font-normal text-[14px] rounded-[2px] px-3 py-2 transition-all active:scale-[0.98] select-none whitespace-nowrap"
              >
                <FolderKanban size={16} />
                <span>Categories</span>
              </Link>

              <Link
                href="/dashboard/add-new-products"
                className="flex h-9 items-center justify-center gap-1 bg-[#F09000] hover:bg-[#d88200] border border-[#F09000] text-black font-sans font-normal text-[14px] leading-[1.2] rounded-[2px] px-3.5 py-2 transition-all active:scale-[0.98] select-none whitespace-nowrap"
              >
                <span>Add New Product</span>
                <Plus size={16} />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Main Products Table ── */}
      <div className="overflow-x-auto w-full border border-[#E5E5E6] rounded-[2px]">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#F2F2F3] border-b border-[#E5E5E6]">
              <th scope="col" className="w-[70px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                Image
              </th>
              <th scope="col" className="w-[120px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                SKU
              </th>
              <th scope="col" className="text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                Title / Details
              </th>
              <th scope="col" className="w-[130px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                Category
              </th>
              {isAdmin && (
                <th scope="col" className="w-[140px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Vendor
                </th>
              )}
              <th scope="col" className="w-[110px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                Price
              </th>
              <th scope="col" className="w-[90px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                Stock
              </th>
              <th scope="col" className="w-[120px] text-center text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                Status
              </th>
              <th scope="col" className="w-[110px] text-center text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E5E5E6]">
            {isLoading ? (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-[#848995]">
                    <Loader2 size={24} className="animate-spin text-[#F09000]" />
                    <span className="text-[14px]">Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="px-4 py-8 text-center text-[14px] text-[#CB1B1B]">
                  Failed to load products. <button onClick={() => refetch()} className="underline font-semibold ml-1">Retry</button>
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => {
                const isAvailable = product.stockStatus === 'AVAILABLE';
                const title = getProductTitle(product);
                const categoryName = getCategoryName(product);
                const priceFormatted = formatPrice(product.basePrice);

                return (
                  <tr key={product.id} className="hover:bg-black/[0.01] transition-colors">
                    {/* Thumbnail Image */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="relative h-10 w-10 overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-[#F8F9FA]">
                        <Image
                          src={getImageUrl(product.thumbnail)}
                          alt={title}
                          fill
                          sizes="40px"
                          className="object-cover object-center"
                          unoptimized
                        />
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-2 text-[12px] font-mono leading-[1.3] text-[#42454D] whitespace-nowrap max-w-[120px] truncate" title={product.sku}>
                      {product.sku}
                    </td>

                    {/* Title / Description */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D]">
                      <div className="font-medium text-black truncate max-w-[220px]" title={title}>
                        {title}
                      </div>
                      {product.shortDescription && (
                        <div className="text-[11px] text-[#848995] truncate max-w-[220px]" title={product.shortDescription}>
                          {product.shortDescription}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                      <span className="inline-block bg-[#F2F2F3] border border-[#E5E5E6] px-2 py-0.5 rounded-[2px] text-[11px]">
                        {categoryName}
                      </span>
                    </td>

                    {/* Vendor (Admin View Only) */}
                    {isAdmin && (
                      <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                        {product.vendor?.name || product.vendor?.email || 'Admin / Direct'}
                      </td>
                    )}

                    {/* Base Price */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap font-medium">
                      {priceFormatted}
                      {product.oldPrice && (
                        <span className="text-[10px] text-[#848995] line-through ml-1">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock Quantity */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                      {product.stockQuantity ?? 0}
                    </td>

                    {/* Stock Status */}
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <span
                        className={`inline-block rounded-[2px] px-2.5 py-1 text-[12px] font-normal leading-[1.3] border text-center ${
                          isAvailable
                            ? 'bg-[#F0F4F2] border-[#E0EBE4] text-[#229A4E]'
                            : 'bg-[#F4F0F0] border-[#ECDFDF] text-[#CB1B1B]'
                        }`}
                      >
                        {isAvailable ? 'Active' : 'Out of stock'}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3 text-[#42454D]">
                        <Link
                          href={`/products/${product.slug}`}
                          className="hover:text-[#165DD0] active:scale-95 transition-all p-0.5"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="hover:text-[#F09000] active:scale-95 transition-all p-0.5"
                          title="Edit Product"
                        >
                          <PenLine size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, title)}
                          className="hover:text-[#CB1B1B] active:scale-95 transition-all p-0.5"
                          title="Delete Product"
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="px-4 py-8 text-center text-[14px] text-[#848995]">
                  No products found matching your search and filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Bar ── */}
      {meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-1 mt-2 py-4 border-t border-[#F4F4F5]">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 py-2 px-3 text-[14px] leading-[1.2] rounded-[6px] transition-colors select-none ${
              currentPage === 1
                ? 'opacity-40 pointer-events-none text-black'
                : 'hover:bg-[#F2F2F3] text-black cursor-pointer'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`h-9 w-9 flex items-center justify-center text-[14px] font-normal rounded-[2px] select-none transition-all ${
                currentPage === pageNum
                  ? 'bg-[#F2F2F3] border border-[#CACBCE] text-black font-semibold'
                  : 'hover:bg-[#F2F2F3] text-black'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPage))}
            disabled={currentPage >= meta.totalPage}
            className={`flex items-center gap-1 py-2 px-3 text-[14px] leading-[1.2] rounded-[6px] transition-colors select-none ${
              currentPage >= meta.totalPage
                ? 'opacity-40 pointer-events-none text-black'
                : 'hover:bg-[#F2F2F3] text-black cursor-pointer'
            }`}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
