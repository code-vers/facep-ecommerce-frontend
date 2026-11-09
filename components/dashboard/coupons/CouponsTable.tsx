'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Copy,
  Check,
  Edit2,
  Trash2,
  Ticket,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminCoupons,
  useToggleCouponStatus,
  useDeleteCoupon,
} from '@/hooks/api/useCoupon';
import { Coupon, CouponDiscountType, CouponScope } from '@/lib/api/coupon';
import CreateCouponModal from './CreateCouponModal';
import EditCouponModal from './EditCouponModal';

export default function CouponsTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [scopeFilter, setScopeFilter] = useState<CouponScope | 'all'>('all');
  const [discountTypeFilter] = useState<CouponDiscountType | 'all'>('all');
  const [sortBy, setSortBy] = useState('createdAt:desc');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  // Copied code feedback tracking
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const queryParams = {
    page,
    limit: 10,
    search: searchTerm.trim() || undefined,
    isActive:
      statusFilter === 'active'
        ? true
        : statusFilter === 'inactive'
        ? false
        : undefined,
    scope: scopeFilter !== 'all' ? scopeFilter : undefined,
    discountType: discountTypeFilter !== 'all' ? discountTypeFilter : undefined,
    sortBy,
  };

  const { data, isLoading, refetch } = useAdminCoupons(queryParams);
  const toggleMutation = useToggleCouponStatus();
  const deleteMutation = useDeleteCoupon();

  const rawCoupons = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPage: 1 };

  // Filter expired client-side if status is 'expired'
  const coupons = rawCoupons.filter((c) => {
    if (statusFilter === 'expired') {
      return new Date(c.endDate) <= new Date();
    }
    return true;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      await toggleMutation.mutateAsync(coupon.id);
      toast.success(
        `Coupon ${coupon.code} is now ${coupon.isActive ? 'Inactive' : 'Active'}.`
      );
      refetch();
    } catch (err: unknown) {
      toast.error('Failed to change status.',err as never);
    }
  };

  const handleDelete = async () => {
    if (!deletingCoupon) return;
    try {
      await deleteMutation.mutateAsync(deletingCoupon.id);
      toast.success(`Coupon ${deletingCoupon.code} has been deleted.`);
      setDeletingCoupon(null);
      refetch();
    } catch (err: unknown) {
      toast.error('Failed to delete coupon.', err as never);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-[#E5E5E6] shadow-2xs overflow-hidden flex flex-col">
      {/* ── 1. Table Toolbar ── */}
      <div className="p-4 sm:p-5 border-b border-[#E5E5E6] flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-[#DEC33A]/20 text-[#B49A2E] flex items-center justify-center">
              <Ticket size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-black">Active Coupon Campaigns</h3>
              <p className="text-xs text-gray-500">
                Manage promo codes, customer usage limits, and checkout discount rules.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 bg-[#DEC33A] hover:bg-[#C9B034] text-black font-bold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Coupon</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-55 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by code or title..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as never);
                setPage(1);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-black"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="expired">Expired</option>
            </select>

            {/* Scope Filter */}
            <select
              value={scopeFilter}
              onChange={(e) => {
                setScopeFilter(e.target.value as never);
                setPage(1);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-black"
            >
              <option value="all">All Scopes</option>
              <option value="ALL">Sitewide</option>
              <option value="CATEGORY">Category Only</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-black"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="endDate:asc">Expiring Soonest</option>
              <option value="usageCount:desc">Most Used</option>
              <option value="code:asc">Code A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 2. Data Table ── */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/80 border-b border-[#E5E5E6] text-gray-500 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Coupon Code &amp; Title</th>
              <th className="py-3 px-4">Discount Rule</th>
              <th className="py-3 px-4">Conditions</th>
              <th className="py-3 px-4">Usage Quota</th>
              <th className="py-3 px-4">Validity</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="py-4 px-4">
                    <div className="h-6 bg-gray-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                    <div className="size-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                      <Ticket size={24} />
                    </div>
                    <span className="text-sm font-bold text-gray-800">No Coupons Found</span>
                    <p className="text-xs text-gray-500">
                      No coupon campaigns match your current filters. Create a new campaign to reward shoppers.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="mt-2 px-3 py-1.5 bg-[#DEC33A] text-black font-bold text-xs rounded shadow-xs"
                    >
                      + Create First Coupon
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => {
                const isExpired = new Date(coupon.endDate) <= new Date();
                const isUnlimited = coupon.usageLimit === null || coupon.usageLimit === undefined;
                const usagePercent = isUnlimited
                  ? 0
                  : Math.min(100, Math.round((coupon.usageCount / (coupon.usageLimit as number)) * 100));

                return (
                  <tr
                    key={coupon.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Code & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-black bg-gray-100 px-2 py-0.5 rounded border border-gray-200 tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code)}
                            title="1-Click Copy Code"
                            className="p-1 text-gray-400 hover:text-black hover:bg-gray-200 rounded transition-colors"
                          >
                            {copiedCode === coupon.code ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                          {coupon.badgeText && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-1.5 py-0.2 rounded">
                              {coupon.badgeText}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 leading-tight">
                          {coupon.title}
                        </span>
                        {coupon.description && (
                          <span className="text-[11px] text-gray-500 line-clamp-1">
                            {coupon.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Discount Rule */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-extrabold text-black text-sm">
                          {coupon.discountType === 'FREE_SHIPPING'
                            ? 'Free Shipping'
                            : coupon.discountType === 'PERCENTAGE'
                            ? `${Number(coupon.discountValue)}% OFF`
                            : `$${Number(coupon.discountValue).toFixed(2)} OFF`}
                        </span>
                        {coupon.maxDiscountAmount && (
                          <span className="text-[11px] text-gray-500">
                            Up to ${Number(coupon.maxDiscountAmount).toFixed(2)} max
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Conditions */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-gray-800 font-medium">
                          {Number(coupon.minOrderAmount) > 0
                            ? `Min. $${Number(coupon.minOrderAmount).toFixed(2)}`
                            : 'No minimum'}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {coupon.scope === 'ALL'
                            ? 'Sitewide'
                            : `${coupon.categoryIds?.length || 0} Categories`}
                        </span>
                      </div>
                    </td>

                    {/* Usage Quota */}
                    <td className="py-3.5 px-4 min-w-32.5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-gray-800">
                            {coupon.usageCount} used
                          </span>
                          <span className="text-gray-500">
                            {isUnlimited ? '∞' : `/ ${coupon.usageLimit}`}
                          </span>
                        </div>
                        {!isUnlimited && (
                          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                usagePercent >= 90 ? 'bg-red-500' : 'bg-[#DEC33A]'
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Validity */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-gray-700">
                          Expires: <strong className="text-black">{coupon.endDate.split('T')[0]}</strong>
                        </span>
                        {isExpired ? (
                          <span className="text-[10px] font-bold text-red-600">Expired</span>
                        ) : (
                          <span className="text-[10px] text-gray-400">
                            From {coupon.startDate.split('T')[0]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(coupon)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          coupon.isActive && !isExpired
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            coupon.isActive && !isExpired ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                        />
                        <span>{isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingCoupon(coupon)}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
                          title="Edit Coupon"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCoupon(coupon)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── 3. Pagination Controls ── */}
      {meta.totalPage > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-[#E5E5E6] bg-gray-50/50">
          <span className="text-xs text-gray-600">
            Showing page <strong className="text-black">{meta.page}</strong> of{' '}
            <strong className="text-black">{meta.totalPage}</strong> (Total {meta.total} coupons)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-gray-300 text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 text-xs font-bold text-black">{page}</span>
            <button
              type="button"
              disabled={page >= meta.totalPage}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded border border-gray-300 text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Modals ── */}
      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditCouponModal
        coupon={editingCoupon}
        isOpen={Boolean(editingCoupon)}
        onClose={() => setEditingCoupon(null)}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Modal */}
      {deletingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 flex flex-col gap-4 border border-gray-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="size-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-black">Delete Coupon</h4>
                <span className="text-xs text-gray-500">This action cannot be undone.</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete coupon{' '}
              <strong className="text-black font-mono">{deletingCoupon.code}</strong>? Customers
              will no longer be able to redeem this code.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCoupon(null)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-1.5 text-xs font-bold rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
