/**
 * @fileoverview Products Table component for the Vendor dashboard.
 * Implements search filtration by status, item listing, badge states, action buttons, and responsive view ports.
 *
 * @module components/dashboard/vendor/product-management/ProductTable
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, PenLine, Trash2, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import type { VendorProduct } from '@/lib/vendor-data';

interface ProductTableProps {
  products: VendorProduct[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Status Filter options
  const statusOptions = ['All', 'Active', 'Low stock', 'Out Of Stock'];

  // Handle filtering
  const filteredProducts = useMemo(() => {
    if (selectedStatus === 'All') return products;
    return products.filter(
      (product) => product.status.toLowerCase() === selectedStatus.toLowerCase()
    );
  }, [products, selectedStatus]);

  // Handle action buttons
  const handleView = (id: string) => {
    alert(`Viewing product details for ${id}`);
  };

  const handleEdit = (id: string) => {
    alert(`Navigating to edit view for ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete product ${id}?`)) {
      alert(`Deleted product ${id}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-white border border-[#E5E5E6] rounded-[4px] shadow-sm">
      
      {/* Table Header / Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[20px] font-semibold font-sans leading-[1.2] text-black">
          Products
        </h2>
        
        <div className="flex flex-col gap-3 xs:flex-row xs:items-center sm:gap-4 shrink-0">
          {/* Status Dropdown */}
          <div className="relative w-full xs:w-[250px]">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1); // Reset page on filter change
              }}
              className="w-full appearance-none bg-white border border-[#E5E5E6] rounded-[2px] px-3 py-2 text-[14px] leading-[1.3] text-[#42454D] focus:outline-none focus:border-[#F09000] cursor-pointer"
            >
              <option value="All">Filter By Status</option>
              {statusOptions.slice(1).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {/* Custom Dropdown Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#848995]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          {/* Add New Product Button */}
          <Link
            href="/dashboard/vendor/products/new"
            className="flex h-9 items-center justify-center gap-1 bg-[#F09000] hover:bg-[#d88200] border border-[#F09000] text-black font-sans font-normal text-[14px] leading-[1.2] rounded-[2px] px-3.5 py-2 transition-all active:scale-[0.98] select-none whitespace-nowrap"
          >
            <span>Add New Product</span>
            <Plus size={16} />
          </Link>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="overflow-x-auto w-full -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-[#F2F2F3] border-y border-[#E5E5E6]">
                <th scope="col" className="w-[87px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Image
                </th>
                <th scope="col" className="w-[122px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  ID
                </th>
                <th scope="col" className="text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Name
                </th>
                <th scope="col" className="w-[130px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Category
                </th>
                <th scope="col" className="w-[110px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Price
                </th>
                <th scope="col" className="w-[110px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Stock
                </th>
                <th scope="col" className="w-[130px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Units Sold
                </th>
                <th scope="col" className="w-[140px] text-center text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Status
                </th>
                <th scope="col" className="w-[120px] text-center text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Action
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-[#E5E5E6]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-black/[0.01] transition-colors">
                    {/* Image */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="relative h-10 w-10 overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white">
                        <Image
                          src={product.imageSrc}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover object-center"
                          unoptimized
                        />
                      </div>
                    </td>
                    
                    {/* ID */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                      {product.id}
                    </td>
                    
                    {/* Name */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                      {product.name}
                    </td>
                    
                    {/* Category */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                      {product.category}
                    </td>
                    
                    {/* Price */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </td>
                    
                    {/* Stock */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                      {product.stock.toLocaleString()}
                    </td>
                    
                    {/* Units Sold */}
                    <td className="px-4 py-2 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                      {product.unitsSold.toLocaleString()}
                    </td>
                    
                    {/* Status */}
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <span
                        className={`inline-block rounded-[2px] px-2.5 py-1 text-[12px] font-normal leading-[1.3] border text-center ${
                          product.status === 'Active'
                            ? 'bg-[#F0F4F2] border-[#E0EBE4] text-[#229A4E]'
                            : product.status === 'Low stock'
                            ? 'bg-[#EEEBE2] border-[#E3D7B5] text-[#EBAF0A]'
                            : 'bg-[#F4F0F0] border-[#ECDFDF] text-[#CB1B1B]'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    
                    {/* Action */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3 text-[#42454D]">
                        <button
                          type="button"
                          onClick={() => handleView(product.id)}
                          className="hover:text-[#165DD0] active:scale-95 transition-all p-0.5"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(product.id)}
                          className="hover:text-[#F09000] active:scale-95 transition-all p-0.5"
                          title="Edit Product"
                        >
                          <PenLine size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="hover:text-[#CB1B1B] active:scale-95 transition-all p-0.5"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[14px] text-[#848995]">
                    No products found matching the status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-1 mt-2 py-4 border-t border-[#F4F4F5]">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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

        {/* Page 1 (Selected) */}
        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          className={`h-10 w-10 flex items-center justify-center text-[14px] font-normal rounded-[2px] select-none transition-all ${
            currentPage === 1
              ? 'bg-[#F2F2F3] border border-[#CACBCE] text-black font-semibold'
              : 'hover:bg-[#F2F2F3] text-black'
          }`}
        >
          1
        </button>

        {/* Page 2 */}
        <button
          type="button"
          onClick={() => setCurrentPage(2)}
          className={`h-10 w-10 flex items-center justify-center text-[14px] font-normal rounded-[2px] select-none transition-all ${
            currentPage === 2
              ? 'bg-[#F2F2F3] border border-[#CACBCE] text-black font-semibold'
              : 'hover:bg-[#F2F2F3] text-black'
          }`}
        >
          2
        </button>

        {/* Page 3 */}
        <button
          type="button"
          onClick={() => setCurrentPage(3)}
          className={`h-10 w-10 flex items-center justify-center text-[14px] font-normal rounded-[2px] select-none transition-all ${
            currentPage === 3
              ? 'bg-[#F2F2F3] border border-[#CACBCE] text-black font-semibold'
              : 'hover:bg-[#F2F2F3] text-black'
          }`}
        >
          3
        </button>

        {/* Page 4 */}
        <button
          type="button"
          onClick={() => setCurrentPage(4)}
          className={`h-10 w-10 flex items-center justify-center text-[14px] font-normal rounded-[2px] select-none transition-all ${
            currentPage === 4
              ? 'bg-[#F2F2F3] border border-[#CACBCE] text-black font-semibold'
              : 'hover:bg-[#F2F2F3] text-black'
          }`}
        >
          4
        </button>

        {/* Dots */}
        <div className="h-10 w-10 flex items-center justify-center text-[#848995] select-none">
          <MoreHorizontal size={16} />
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => currentPage < 4 && setCurrentPage(currentPage + 1)}
          disabled={currentPage === 4}
          className={`flex items-center gap-1 py-2 px-3 text-[14px] leading-[1.2] rounded-[6px] transition-colors select-none ${
            currentPage === 4
              ? 'opacity-40 pointer-events-none text-black'
              : 'hover:bg-[#F2F2F3] text-black cursor-pointer'
          }`}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
