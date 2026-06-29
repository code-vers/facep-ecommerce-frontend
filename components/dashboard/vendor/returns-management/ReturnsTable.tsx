/**
 * @fileoverview ReturnsTable component for the Vendor returns page.
 * Displays return requests, and supports accepting/declining requests.
 *
 * @module components/dashboard/vendor/returns-management/ReturnsTable
 */

'use client';

import { useState } from 'react';
import { Check, X, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import type { VendorReturnRequest } from '@/lib/vendor-data';

interface ReturnsTableProps {
  initialReturns: VendorReturnRequest[];
}

export default function ReturnsTable({ initialReturns }: ReturnsTableProps) {
  const [requests, setRequests] = useState<VendorReturnRequest[]>(initialReturns);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleAccept = (orderId: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.orderId === orderId ? { ...req, status: 'approved' } : req))
    );
  };

  const handleDecline = (orderId: string) => {
    if (confirm(`Are you sure you want to decline return request for order ${orderId}?`)) {
      setRequests((prev) =>
        prev.map((req) => (req.orderId === orderId ? { ...req, status: 'declined' } : req))
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-white border border-[#E5E5E6] rounded-[4px] shadow-sm">
      
      {/* Table Title Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold font-sans leading-[1.2] text-black">
          Return Requests
        </h2>
      </div>

      {/* Main Table Wrapper */}
      <div className="overflow-x-auto w-full -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-[#F2F2F3] border-y border-[#E5E5E6]">
                <th scope="col" className="w-[120px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Order ID
                </th>
                <th scope="col" className="w-[150px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Customer
                </th>
                <th scope="col" className="w-[180px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Customer Contact No
                </th>
                <th scope="col" className="w-[210px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Product
                </th>
                <th scope="col" className="text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Reason
                </th>
                <th scope="col" className="w-[160px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Product Condition
                </th>
                <th scope="col" className="w-[130px] text-left text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Pickup Date
                </th>
                <th scope="col" className="w-[120px] text-center text-[14px] font-normal leading-[1.3] text-black px-4 py-2.5">
                  Action
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-[#E5E5E6]">
              {requests.map((request) => (
                <tr key={request.orderId} className="hover:bg-black/[0.01] transition-colors">
                  {/* Order ID */}
                  <td className="px-4 py-3.5 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                    {request.orderId}
                  </td>
                  
                  {/* Customer */}
                  <td className="px-4 py-3.5 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                    {request.customerName}
                  </td>
                  
                  {/* Contact No */}
                  <td className="px-4 py-3.5 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                    {request.contactNo}
                  </td>
                  
                  {/* Product */}
                  <td className="px-4 py-3.5 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                    {request.productName}
                  </td>
                  
                  {/* Reason */}
                  <td className="px-4 py-3.5 text-[12px] font-normal leading-[1.3] text-[#42454D]">
                    {request.reason}
                  </td>
                  
                  {/* Condition */}
                  <td className="px-4 py-3.5 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                    {request.condition}
                  </td>
                  
                  {/* Pickup Date */}
                  <td className="px-4 py-3.5 text-[12px] font-normal leading-[1.3] text-[#42454D] whitespace-nowrap">
                    {request.pickupDate}
                  </td>
                  
                  {/* Action */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {request.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleAccept(request.orderId)}
                          className="flex h-7 w-7 items-center justify-center rounded border border-[#E0EBE4] bg-[#F0F4F2] text-[#229A4E] hover:bg-[#e0ebe4] active:scale-95 transition-all cursor-pointer"
                          title="Accept Return"
                        >
                          <Check size={14} className="stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecline(request.orderId)}
                          className="flex h-7 w-7 items-center justify-center rounded border border-[#ECDFDF] bg-[#F4F0F0] text-[#CB1B1B] hover:bg-[#ecdfdf] active:scale-95 transition-all cursor-pointer"
                          title="Decline Return"
                        >
                          <X size={14} className="stroke-[2.5]" />
                        </button>
                      </div>
                    ) : request.status === 'approved' ? (
                      <span className="inline-block rounded-[2px] px-2.5 py-1 text-[12px] font-normal leading-[1.3] border border-[#E0EBE4] bg-[#F0F4F2] text-[#229A4E] text-center">
                        Accepted
                      </span>
                    ) : (
                      <span className="inline-block rounded-[2px] px-2.5 py-1 text-[12px] font-normal leading-[1.3] border border-[#ECDFDF] bg-[#F4F0F0] text-[#CB1B1B] text-center">
                        Declined
                      </span>
                    )}
                  </td>
                </tr>
              ))}
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

        {/* Page Items */}
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
