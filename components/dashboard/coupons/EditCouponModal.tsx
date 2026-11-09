'use client';

import React, { useState, useEffect } from 'react';
import { X, Ticket, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateCoupon } from '@/hooks/api/useCoupon';
import { useCategories } from '@/hooks/api/useCategory';
import { Coupon, CouponDiscountType, CouponScope, UpdateCouponPayload } from '@/lib/api/coupon';

interface EditCouponModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCouponModal({
  coupon,
  isOpen,
  onClose,
  onSuccess,
}: EditCouponModalProps) {
  const updateMutation = useUpdateCoupon();
  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.data || [];

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<CouponDiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number | ''>(20);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>('');
  const [minOrderAmount, setMinOrderAmount] = useState<number | ''>(0);
  const [scope, setScope] = useState<CouponScope>('ALL');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [userUsageLimit, setUserUsageLimit] = useState<number | ''>(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [badgeText, setBadgeText] = useState('');

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code);
      setTitle(coupon.title);
      setDescription(coupon.description || '');
      setDiscountType(coupon.discountType);
      setDiscountValue(Number(coupon.discountValue));
      setMaxDiscountAmount(coupon.maxDiscountAmount ? Number(coupon.maxDiscountAmount) : '');
      setMinOrderAmount(Number(coupon.minOrderAmount) || 0);
      setScope(coupon.scope);
      setSelectedCategoryIds(coupon.categoryIds || []);
      setUsageLimit(coupon.usageLimit !== null && coupon.usageLimit !== undefined ? coupon.usageLimit : '');
      setUserUsageLimit(coupon.userUsageLimit || 1);
      setStartDate(new Date(coupon.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(coupon.endDate).toISOString().split('T')[0]);
      setIsActive(coupon.isActive);
      setIsPublic(coupon.isPublic);
      setBadgeText(coupon.badgeText || '');
    }
  }, [coupon]);

  const handleToggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon) return;

    if (!code.trim()) {
      toast.error('Coupon code is required');
      return;
    }

    if (!title.trim()) {
      toast.error('Coupon title is required');
      return;
    }

    if (discountValue === '' || Number(discountValue) <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    if (!endDate) {
      toast.error('Expiration date is required');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('Expiration date must be later than start date');
      return;
    }

    const payload: UpdateCouponPayload = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || null,
      discountType,
      discountValue: Number(discountValue),
      maxDiscountAmount: maxDiscountAmount !== '' ? Number(maxDiscountAmount) : null,
      minOrderAmount: minOrderAmount !== '' ? Number(minOrderAmount) : 0,
      scope,
      categoryIds: scope === 'CATEGORY' ? selectedCategoryIds : [],
      usageLimit: usageLimit !== '' ? Number(usageLimit) : null,
      userUsageLimit: userUsageLimit !== '' ? Number(userUsageLimit) : 1,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate + 'T23:59:59.999Z').toISOString(),
      isActive,
      isPublic,
      badgeText: badgeText.trim() || null,
    };

    try {
      await updateMutation.mutateAsync({ id: coupon.id, payload });
      toast.success(`Coupon ${payload.code} updated successfully!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update coupon';
      toast.error(msg);
    }
  };

  if (!isOpen || !coupon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181F26] text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#DEC33A] text-black flex items-center justify-center">
              <Ticket size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Edit Coupon: {coupon.code}</h2>
              <p className="text-xs text-gray-300">
                Update limits, validity dates, or promotional discount parameters.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form id="edit-coupon-form" onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Code & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Coupon Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  className="px-3 py-2 text-sm font-mono font-bold tracking-wider border border-gray-300 rounded-md uppercase focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Headline Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-black focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-800">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-black focus:outline-none"
              />
            </div>

            {/* Discount Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as CouponDiscountType)}
                  className="px-2.5 py-2 text-xs font-semibold border border-gray-300 rounded-md bg-white focus:outline-none focus:border-black"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Discount Value</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    required
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                    {discountType === 'PERCENTAGE' ? '%' : '$'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Max Cap ($)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={maxDiscountAmount}
                  disabled={discountType !== 'PERCENTAGE'}
                  onChange={(e) => setMaxDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Optional"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Min Spend & Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Min Spend ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Total Quota</label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Unlimited"
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Per User Limit</label>
                <input
                  type="number"
                  min="1"
                  value={userUsageLimit}
                  onChange={(e) => setUserUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Scope */}
            <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800">Products Scope</label>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-scope"
                      value="ALL"
                      checked={scope === 'ALL'}
                      onChange={() => setScope('ALL')}
                    />
                    <span>Sitewide</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-scope"
                      value="CATEGORY"
                      checked={scope === 'CATEGORY'}
                      onChange={() => setScope('CATEGORY')}
                    />
                    <span>Category Specific</span>
                  </label>
                </div>
              </div>

              {scope === 'CATEGORY' && (
                <div className="pt-2 border-t border-gray-200 flex flex-col gap-1.5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-1.5 text-xs p-1.5 rounded border cursor-pointer ${
                          selectedCategoryIds.includes(cat.id)
                            ? 'bg-[#DEC33A]/20 border-[#DEC33A] font-bold text-black'
                            : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(cat.id)}
                          onChange={() => handleToggleCategory(cat.id)}
                          className="size-3.5"
                        />
                        <span className="truncate">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dates & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Badge Text</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Public Gallery Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="size-4 text-black rounded"
                />
                <span className="text-xs font-bold text-gray-800">Show on Public `/coupons`</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="size-4 text-black rounded"
                />
                <span className="text-xs font-bold text-emerald-700">Coupon Active</span>
              </label>
            </div>

          </form>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Eye size={14} className="text-[#DEC33A]" />
              <span>Preview Card</span>
            </div>

            <div className="bg-white border-2 border-dashed border-[#DEC33A] rounded-xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden bg-linear-to-br from-amber-50/50 to-white">
              {badgeText && (
                <span className="self-start text-[10px] font-extrabold uppercase tracking-wider bg-[#CC0C39] text-white px-2 py-0.5 rounded-xs">
                  {badgeText}
                </span>
              )}

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-black">
                  {discountType === 'FREE_SHIPPING'
                    ? 'FREE'
                    : discountType === 'PERCENTAGE'
                    ? `${discountValue || 0}%`
                    : `$${discountValue || 0}`}
                </span>
                <span className="text-xs font-bold text-gray-600 uppercase">
                  {discountType === 'FREE_SHIPPING' ? 'Shipping' : 'OFF'}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-bold text-[#0F1111] leading-tight">{title}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2">{description}</p>
              </div>

              <div className="pt-2 border-t border-gray-200/80 flex flex-col gap-1 text-[11px] text-gray-600">
                <div className="flex justify-between">
                  <span>Usage Count:</span>
                  <strong className="text-black">{coupon.usageCount} times redeemed</strong>
                </div>
                <div className="flex justify-between">
                  <span>Min. Spend:</span>
                  <strong className="text-black">
                    {Number(minOrderAmount) > 0 ? `$${Number(minOrderAmount).toFixed(2)}` : 'No min.'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <strong className="text-black">{endDate}</strong>
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between bg-black text-white p-2 rounded font-mono text-xs font-bold tracking-wider">
                <span>{code}</span>
                <span className="text-[10px] text-[#DEC33A] font-sans">Active Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-coupon-form"
            disabled={updateMutation.isPending}
            className="px-5 py-2 text-xs font-bold rounded-md bg-[#DEC33A] hover:bg-[#C9B034] text-black shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
