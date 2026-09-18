'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Save, Eye, Trash2, Search, X, Loader2, Store, DollarSign, Package } from 'lucide-react';
import { useVendors, useUpdateVendorStatus, useDeleteVendor } from '@/hooks/api/useVendor';
import { profileAssetUrl } from '@/lib/api/profile';
import type { VendorItem } from '@/lib/api/vendor';

export default function AllStoresTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'SUSPENDED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);
  const [selectedVendorForView, setSelectedVendorForView] = useState<VendorItem | null>(null);
  const [vendorToSuspend, setVendorToSuspend] = useState<VendorItem | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useVendors({
    page: currentPage,
    limit: 10,
    searchTerm: debouncedSearch || undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
  });

  const updateStatusMutation = useUpdateVendorStatus();
  const deleteVendorMutation = useDeleteVendor();

  const vendors = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Status Change Handler
  const handleStatusChange = (id: string, newStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => {
    updateStatusMutation.mutate({ id, status: newStatus });
    setOpenStatusDropdownId(null);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (!vendors.length) return;
    const headers = ['Store Name', 'Vendor Name', 'Email', 'Contact', 'Address', 'Products', 'Total Sales', 'Status', 'Joined Date'];
    const rows = vendors.map((v) => [
      `"${v.storeName || v.name}"`,
      `"${v.name}"`,
      `"${v.email}"`,
      `"${v.contactNumber || ''}"`,
      `"${v.address || ''}"`,
      v.productsCount,
      `"$${v.totalSales.toFixed(2)}"`,
      v.status,
      new Date(v.createdAt).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vendors_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
        <div>
          <h3 className="font-semibold text-[20px] text-black">Vendors</h3>
          <p className="text-[13px] text-[#848995]">Manage registered sellers, stores, and account status</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="flex items-center bg-white border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 w-full sm:w-[220px]">
            <Search size={14} className="text-[#848995] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search vendor or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-[13px] text-black outline-none placeholder:text-[#848995]"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-[#848995] hover:text-black">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 pr-8 text-[13px] text-black outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#848995] pointer-events-none" />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={!vendors.length}
            className="border border-[#686f7d] rounded-[2px] h-[36px] px-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span className="text-[13px] text-black font-medium">Export CSV</span>
            <Save size={14} className="text-black" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full flex flex-col border border-[#e5e5e6] rounded-[2px] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px] w-full flex flex-col">
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[11px] text-[13px] font-semibold text-black">
              <div className="w-[70px] shrink-0 px-2">Logo</div>
              <div className="flex-[2] px-2">Store</div>
              <div className="flex-[1.5] px-2">Vendor</div>
              <div className="flex-[2] px-2">Email</div>
              <div className="flex-1 px-2 text-center">Products</div>
              <div className="flex-1 px-2 text-right">Sales</div>
              <div className="flex-1 px-2 text-center">Rating</div>
              <div className="flex-[1.5] px-2 text-center">Open Date</div>
              <div className="w-[130px] shrink-0 px-2 text-center">Status</div>
              <div className="w-[90px] shrink-0 px-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-2 text-gray-500">
                <Loader2 size={24} className="animate-spin text-[#f09000]" />
                <span className="text-[14px]">Loading vendors...</span>
              </div>
            ) : isError ? (
              <div className="p-12 text-center text-red-500 text-[14px]">
                Failed to load vendors. Please try again.
              </div>
            ) : vendors.length === 0 ? (
              <div className="p-12 text-center text-[#848995] text-[14px]">
                No vendors found matching your criteria.
              </div>
            ) : (
              vendors.map((vendor) => {
                const logoSrc = profileAssetUrl(vendor.avatarUrl);
                const isDropdownOpen = openStatusDropdownId === vendor.id;

                return (
                  <div
                    key={vendor.id}
                    className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-2 hover:bg-gray-50 transition-colors relative"
                  >
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
                    <div className="flex-[2] text-[13px] font-medium text-[#101828] px-2 truncate" title={vendor.storeName || vendor.name}>
                      {vendor.storeName || vendor.name}
                    </div>

                    {/* Vendor */}
                    <div className="flex-[1.5] text-[13px] text-[#42454d] px-2 truncate" title={vendor.name}>
                      {vendor.name}
                    </div>

                    {/* Email */}
                    <div className="flex-[2] text-[13px] text-[#42454d] px-2 truncate" title={vendor.email}>
                      {vendor.email}
                    </div>

                    {/* Products */}
                    <div className="flex-1 text-[13px] text-[#42454d] px-2 text-center font-medium">
                      {vendor.productsCount}
                    </div>

                    {/* Sales */}
                    <div className="flex-1 text-[13px] text-[#101828] font-semibold px-2 text-right">
                      ${vendor.totalSales.toFixed(2)}
                    </div>

                    {/* Rating */}
                    <div className="flex-1 text-[13px] text-[#42454d] px-2 flex items-center justify-center gap-1">
                      <span className="text-[#f09000] text-[14px]">★</span>
                      <span>4.8</span>
                    </div>

                    {/* Open Date */}
                    <div className="flex-[1.5] text-[13px] text-[#42454d] px-2 text-center whitespace-nowrap">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </div>

                    {/* Status Dropdown */}
                    <div className="w-[130px] shrink-0 px-2 relative">
                      <button
                        type="button"
                        onClick={() => setOpenStatusDropdownId(isDropdownOpen ? null : vendor.id)}
                        className={`w-full rounded-[2px] px-2.5 py-1 flex items-center justify-between text-[12px] font-semibold transition-all border cursor-pointer ${
                          vendor.status === 'Active'
                            ? 'bg-[#e7f4eb] border-[#229a4e] text-[#229a4e]'
                            : vendor.status === 'Pending'
                            ? 'bg-[#fdf4e5] border-[#f09000] text-[#f09000]'
                            : 'bg-[#fbe8e8] border-[#cb1b1b] text-[#cb1b1b]'
                        }`}
                      >
                        <span>{vendor.status}</span>
                        <ChevronDown size={13} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute left-2 top-full mt-1 w-[120px] bg-white border border-[#e5e5e6] rounded shadow-lg py-1 z-30 animate-in fade-in">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(vendor.id, 'ACTIVE')}
                            className="w-full text-left px-3 py-1.5 text-[12px] text-green-700 hover:bg-green-50 font-medium"
                          >
                            Active
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(vendor.id, 'PENDING')}
                            className="w-full text-left px-3 py-1.5 text-[12px] text-amber-700 hover:bg-amber-50 font-medium"
                          >
                            Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(vendor.id, 'SUSPENDED')}
                            className="w-full text-left px-3 py-1.5 text-[12px] text-red-700 hover:bg-red-50 font-medium"
                          >
                            Suspend
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="w-[90px] shrink-0 px-2 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedVendorForView(vendor)}
                        className="text-[#42454d] hover:text-[#165DD0] transition-colors p-1"
                        title="View Store Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setVendorToSuspend(vendor)}
                        className="text-[#848995] hover:text-[#cb1b1b] transition-colors p-1"
                        title="Suspend / Deactivate Vendor"
                      >
                        <Trash2 size={16} />
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

          {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, idx, arr) => (
              <React.Fragment key={page}>
                {idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-[#848995] px-1">...</span>}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`w-[32px] h-[32px] text-[13px] flex items-center justify-center rounded-[2px] transition-colors ${
                    currentPage === page
                      ? 'bg-[#f09000] text-black font-bold'
                      : 'bg-white border border-[#e5e5e6] text-[#42454d] hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
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

      {/* View Vendor Modal */}
      {selectedVendorForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl overflow-hidden border border-[#e5e5e6]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#e5e5e6] bg-[#f9fafb]">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full overflow-hidden bg-white border border-[#e5e5e6] relative flex items-center justify-center">
                  {selectedVendorForView.avatarUrl ? (
                    <Image
                      src={profileAssetUrl(selectedVendorForView.avatarUrl)}
                      alt={selectedVendorForView.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Store size={22} className="text-[#848995]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[18px] text-black">
                    {selectedVendorForView.storeName || selectedVendorForView.name}
                  </h4>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedVendorForView.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : selectedVendorForView.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {selectedVendorForView.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVendorForView(null)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded border border-gray-100 text-[13px]">
                <div>
                  <span className="text-gray-500 block text-[11px]">Vendor Name</span>
                  <span className="font-semibold text-black">{selectedVendorForView.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Email</span>
                  <span className="font-semibold text-black truncate block">{selectedVendorForView.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Contact Phone</span>
                  <span className="font-semibold text-black">{selectedVendorForView.contactNumber || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Member Since</span>
                  <span className="font-semibold text-black">
                    {new Date(selectedVendorForView.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded text-center">
                  <Package size={16} className="text-blue-600 mx-auto mb-1" />
                  <span className="text-[11px] text-blue-700 block">Products</span>
                  <span className="text-[16px] font-bold text-blue-950">{selectedVendorForView.productsCount}</span>
                </div>
                <div className="p-3 bg-green-50 border border-green-100 rounded text-center">
                  <DollarSign size={16} className="text-green-600 mx-auto mb-1" />
                  <span className="text-[11px] text-green-700 block">Total Sales</span>
                  <span className="text-[16px] font-bold text-green-950">${selectedVendorForView.totalSales.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded text-center">
                  <Store size={16} className="text-amber-600 mx-auto mb-1" />
                  <span className="text-[11px] text-amber-700 block">Wallet Available</span>
                  <span className="text-[16px] font-bold text-amber-950">
                    ${Number(selectedVendorForView.wallet?.availableBalance ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-[12px] block mb-1">Store Address</span>
                <p className="text-[13px] text-black bg-gray-50 p-2 rounded border border-gray-100">
                  {selectedVendorForView.address || 'No physical address configured.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#e5e5e6] bg-[#f9fafb] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedVendorForView(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black text-[13px] font-medium rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {vendorToSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl border border-[#e5e5e6]">
            <h4 className="text-[16px] font-bold text-red-600 mb-2">Suspend Vendor?</h4>
            <p className="text-[13px] text-gray-600 mb-4">
              Are you sure you want to suspend <strong>{vendorToSuspend.name}</strong>? Their store and listings will become inactive.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setVendorToSuspend(null)}
                className="px-3 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteVendorMutation.mutate(vendorToSuspend.id);
                  setVendorToSuspend(null);
                }}
                className="px-3 py-1.5 text-[13px] bg-red-600 hover:bg-red-700 text-white rounded font-medium"
              >
                Confirm Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
