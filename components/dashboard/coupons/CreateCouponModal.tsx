'use client';

import React, { useState } from 'react';
import {
  X,
  Ticket,
  Shuffle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCreateCoupon } from '@/hooks/api/useCoupon';
import { useCategories } from '@/hooks/api/useCategory';
import { CouponDiscountType, CouponScope, CreateCouponPayload } from '@/lib/api/coupon';

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCouponModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCouponModalProps) {
  const createMutation = useCreateCoupon();
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

  // Set default dates: start today, end in 30 days
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(thirtyDaysLater);
  const [isPublic, setIsPublic] = useState(true);
  const [badgeText, setBadgeText] = useState('Featured');

  const generateRandomCode = () => {
    const prefixes = ['SAVE', 'FACEP', 'SPECIAL', 'DEAL', 'SUPER', 'FLASH'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setCode(`${prefix}${num}`);
  };

  const handleToggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (discountType === 'PERCENTAGE' && Number(discountValue) > 100) {
      toast.error('Percentage discount cannot exceed 100%');
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

    if (scope === 'CATEGORY' && selectedCategoryIds.length === 0) {
      toast.error('Please select at least one category for category-scoped coupons');
      return;
    }

    const payload: CreateCouponPayload = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || undefined,
      discountType,
      discountValue: Number(discountValue),
      maxDiscountAmount: maxDiscountAmount !== '' ? Number(maxDiscountAmount) : null,
      minOrderAmount: minOrderAmount !== '' ? Number(minOrderAmount) : 0,
      scope,
      categoryIds: scope === 'CATEGORY' ? selectedCategoryIds : [],
      productIds: [],
      usageLimit: usageLimit !== '' ? Number(usageLimit) : null,
      userUsageLimit: userUsageLimit !== '' ? Number(userUsageLimit) : 1,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate + 'T23:59:59.999Z').toISOString(),
      isActive: true,
      isPublic,
      badgeText: badgeText.trim() || null,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success(`Coupon ${payload.code} created successfully!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create coupon';
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

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
              <h2 className="text-base font-bold">Create New Coupon</h2>
              <p className="text-xs text-gray-300">
                Define promotional rules, discount rates, spend limits, and validity dates.
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

        {/* Modal Body: Form + Live Preview Card */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form (7 Cols) */}
          <form id="create-coupon-form" onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-4">
            
            {/* 1. Code & Generator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    placeholder="e.g. SAVE20"
                    className="flex-1 px-3 py-2 text-sm font-mono font-bold tracking-wider border border-gray-300 rounded-md uppercase focus:border-black focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    title="Generate Random Code"
                    className="px-2.5 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 flex items-center gap-1 transition-colors"
                  >
                    <Shuffle size={13} />
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Headline Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 20% Off All Orders"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-black focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-800">
                Description & Terms (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Applicable on verified consumer items. Maximum 1 redemption per account."
                className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-black focus:outline-none"
              />
            </div>

            {/* 2. Discount Type & Value */}
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
                <label className="text-xs font-bold text-gray-800">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    disabled={discountType === 'FREE_SHIPPING'}
                    value={discountType === 'FREE_SHIPPING' ? 0 : discountValue}
                    onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold border border-gray-300 rounded-md focus:outline-none focus:border-black disabled:bg-gray-100"
                    required
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                    {discountType === 'PERCENTAGE' ? '%' : '$'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Max Cap ($)
                  <span className="text-[10px] text-gray-500 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  disabled={discountType !== 'PERCENTAGE'}
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 50.00"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* 3. Minimum Spend & Usage Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Min Spend ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.00"
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Total Quota
                  <span className="text-[10px] text-gray-500 font-normal ml-1">(Blank = ∞)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 100"
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Limit Per User
                </label>
                <input
                  type="number"
                  min="1"
                  value={userUsageLimit}
                  onChange={(e) => setUserUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* 4. Scope & Category Picker */}
            <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800">
                  Applicable Products Scope
                </label>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="ALL"
                      checked={scope === 'ALL'}
                      onChange={() => setScope('ALL')}
                    />
                    <span>Sitewide (All)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="CATEGORY"
                      checked={scope === 'CATEGORY'}
                      onChange={() => setScope('CATEGORY')}
                    />
                    <span>Specific Categories</span>
                  </label>
                </div>
              </div>

              {scope === 'CATEGORY' && (
                <div className="pt-2 border-t border-gray-200 flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-gray-600">
                    Select qualifying categories ({selectedCategoryIds.length} selected):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-1.5 text-xs p-1.5 rounded border cursor-pointer transition-colors ${
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

            {/* 5. Date Range & Badge */}
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
                <label className="text-xs font-bold text-gray-800">
                  End Date <span className="text-red-500">*</span>
                </label>
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
                  placeholder="e.g. Exclusive"
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Public Gallery Switch */}
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="size-4 text-black rounded"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">
                  Feature in Customer Coupons Gallery (`/coupons`)
                </span>
                <span className="text-[11px] text-gray-500">
                  When enabled, all shoppers can browse, 1-click copy, and apply this coupon.
                </span>
              </div>
            </label>

          </form>

          {/* Right Live Preview Column (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Eye size={14} className="text-[#DEC33A]" />
              <span>Live Card Preview</span>
            </div>

            {/* Perforated Voucher Preview */}
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
                <h4 className="text-sm font-bold text-[#0F1111] leading-tight">
                  {title || 'Your Promo Title Here'}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-2">
                  {description || 'Coupon description and applicability will display here.'}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200/80 flex flex-col gap-1 text-[11px] text-gray-600">
                <div className="flex justify-between">
                  <span>Min. Spend:</span>
                  <strong className="text-black">
                    {Number(minOrderAmount) > 0 ? `$${Number(minOrderAmount).toFixed(2)}` : 'No minimum'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Scope:</span>
                  <strong className="text-black">
                    {scope === 'ALL' ? 'Sitewide' : `${selectedCategoryIds.length} Categories`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <strong className="text-black">{endDate || 'Select date'}</strong>
                </div>
              </div>

              {/* Code Box */}
              <div className="mt-1 flex items-center justify-between bg-black text-white p-2 rounded font-mono text-xs font-bold tracking-wider">
                <span>{code || 'COUPONCODE'}</span>
                <span className="text-[10px] text-[#DEC33A] font-sans">1-Click Copy</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800 flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                Coupons created here take effect immediately upon their start date and are validated automatically at Cart & Checkout.
              </span>
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
            form="create-coupon-form"
            disabled={createMutation.isPending}
            className="px-5 py-2 text-xs font-bold rounded-md bg-[#DEC33A] hover:bg-[#C9B034] text-black shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <span>Creating...</span>
            ) : (
              <>
                <Ticket size={14} />
                <span>Publish Coupon</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
