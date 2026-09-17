'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, Store, Loader2 } from 'lucide-react';
import { useVendors, useUpdateVendorStatus, useBulkUpdateVendorStatus } from '@/hooks/api/useVendor';
import { profileAssetUrl } from '@/lib/api/profile';

export default function PendingApprovalsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, isError } = useVendors({
    page: currentPage,
    limit: 10,
    status: 'PENDING',
  });

  const updateStatusMutation = useUpdateVendorStatus();
  const bulkUpdateMutation = useBulkUpdateVendorStatus();

  const pendingVendors = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Checkbox Selection
  const allCurrentIds = pendingVendors.map((v) => v.id);
  const isAllSelected = allCurrentIds.length > 0 && allCurrentIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allCurrentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allCurrentIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkAction = (status: 'ACTIVE' | 'SUSPENDED') => {
    if (!selectedIds.length) return;
    bulkUpdateMutation.mutate(
      { ids: selectedIds, status },
      {
        onSuccess: () => {
          setSelectedIds([]);
        },
      }
    );
  };

  // Single Actions
  const handleSingleAction = (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
        <div>
          <h3 className="font-semibold text-[20px] text-black">Pending Store Approvals</h3>
          <p className="text-[13px] text-[#848995]">Review and accept or reject new vendor seller applications</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!selectedIds.length || bulkUpdateMutation.isPending}
            onClick={() => handleBulkAction('SUSPENDED')}
            className="border border-[#cb1b1b] rounded-[2px] h-[36px] px-3 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="text-[13px] font-medium text-[#cb1b1b]">
              Reject Selected {selectedIds.length ? `(${selectedIds.length})` : ''}
            </span>
            <X size={15} className="text-[#cb1b1b]" />
          </button>

          <button
            type="button"
            disabled={!selectedIds.length || bulkUpdateMutation.isPending}
            onClick={() => handleBulkAction('ACTIVE')}
            className="border border-[#229a4e] rounded-[2px] h-[36px] px-3 flex items-center justify-center gap-2 hover:bg-green-50 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="text-[13px] font-medium text-[#229a4e]">
              Accept Selected {selectedIds.length ? `(${selectedIds.length})` : ''}
            </span>
            <Check size={15} className="text-[#229a4e]" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full flex flex-col border border-[#e5e5e6] rounded-[2px] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px] w-full flex flex-col">
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[11px] text-[13px] font-semibold text-black">
              <div className="w-[40px] shrink-0 px-2 flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  disabled={!pendingVendors.length}
                  className="size-[15px] rounded-[2px] border-[#e5e5e6] accent-[#f09000] cursor-pointer"
                />
              </div>
              <div className="w-[70px] shrink-0 px-2">Logo</div>
              <div className="flex-2 px-2">Store</div>
              <div className="flex-2 px-2">Vendor</div>
              <div className="flex-2 px-2">Email</div>
              <div className="flex-2 px-2 text-center">Application Date</div>
              <div className="w-[110px] shrink-0 px-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-2 text-gray-500">
                <Loader2 size={24} className="animate-spin text-[#f09000]" />
                <span className="text-[14px]">Loading pending approvals...</span>
              </div>
            ) : isError ? (
              <div className="p-12 text-center text-red-500 text-[14px]">
                Failed to load pending approvals. Please try again.
              </div>
            ) : pendingVendors.length === 0 ? (
              <div className="p-12 text-center text-[#848995] text-[14px]">
                No pending store approvals found.
              </div>
            ) : (
              pendingVendors.map((vendor) => {
                const logoSrc = profileAssetUrl(vendor.avatarUrl);
                const isChecked = selectedIds.includes(vendor.id);

                return (
                  <div
                    key={vendor.id}
                    className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    {/* Checkbox */}
                    <div className="w-[40px] shrink-0 px-2 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(vendor.id)}
                        className="size-[15px] rounded-[2px] border-[#e5e5e6] accent-[#f09000] cursor-pointer"
                      />
                    </div>

                    {/* Logo */}
                    <div className="w-[70px] shrink-0 px-2 flex items-center">
                      <div className="size-10 bg-gray-100 overflow-hidden rounded-[4px] border border-[#e5e5e6] relative flex items-center justify-center">
                        {logoSrc ? (
                          <Image
                            src={logoSrc}
                            alt={vendor.storeName || vendor.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Store size={18} className="text-[#848995]" />
                        )}
                      </div>
                    </div>

                    {/* Store */}
                    <div className="flex-2 text-[13px] font-medium text-[#101828] px-2 truncate" title={vendor.storeName || vendor.name}>
                      {vendor.storeName || vendor.name}
                    </div>

                    {/* Vendor */}
                    <div className="flex-2 text-[13px] text-[#42454d] px-2 truncate" title={vendor.name}>
                      {vendor.name}
                    </div>

                    {/* Email */}
                    <div className="flex-2 text-[13px] text-[#42454d] px-2 truncate" title={vendor.email}>
                      {vendor.email}
                    </div>

                    {/* Application Date */}
                    <div className="flex-2 text-[13px] text-[#42454d] px-2 text-center whitespace-nowrap">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </div>

                    {/* Action */}
                    <div className="w-[110px] shrink-0 px-2 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSingleAction(vendor.id, 'ACTIVE')}
                        disabled={updateStatusMutation.isPending}
                        className="size-7 flex items-center justify-center rounded bg-green-50 border border-green-200 text-[#229a4e] hover:bg-green-100 transition-colors cursor-pointer"
                        title="Accept Application"
                      >
                        <Check size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSingleAction(vendor.id, 'SUSPENDED')}
                        disabled={updateStatusMutation.isPending}
                        className="size-7 flex items-center justify-center rounded bg-red-50 border border-red-200 text-[#cb1b1b] hover:bg-red-100 transition-colors cursor-pointer"
                        title="Reject Application"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="w-full flex items-center justify-center gap-2 mt-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="text-[13px] text-[#848995] hover:text-black mr-2 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            &lt; Previous
          </button>

          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-[32px] h-[32px] text-[13px] flex items-center justify-center rounded-[2px] transition-colors ${
                currentPage === page
                  ? 'bg-[#f09000] text-black font-bold'
                  : 'bg-white border border-[#e5e5e6] text-[#42454d] hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === meta.totalPages}
            onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
            className="text-[13px] text-black hover:opacity-70 ml-2 font-medium disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}
