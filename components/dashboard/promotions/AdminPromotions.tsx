'use client';

import { ArrowLeft, Calendar, Check, ImageUp, Plus, RefreshCcw, Search, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

import { useCategories } from '@/hooks/api/useCategory';
import { useActiveDeal, useCreateDeal, useUpdateDeal } from '@/hooks/api/useDeal';
import { apiClient } from '@/lib/api/axios';
import { Deal } from '@/lib/api/deal';
import { AxiosError } from 'axios';

interface AdminPromotionsProps {
  dealToEdit?: Deal | null;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function AdminPromotions({ dealToEdit, onBack, onSuccess }: AdminPromotionsProps) {
  // Queries & Mutations
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories(1, 100);
  const { data: activeDeal } = useActiveDeal();
  const createDealMutation = useCreateDeal();
  const updateDealMutation = useUpdateDeal();

  // Form State
  const [dealTitle, setDealTitle] = useState('');
  const [bannerHeading, setBannerHeading] = useState('');
  const [bannerSubheading, setBannerSubheading] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerBgColor, setBannerBgColor] = useState('#ffffff');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [discountStartPercent, setDiscountStartPercent] = useState<number | ''>(5);
  const [discountEndPercent, setDiscountEndPercent] = useState<number | ''>(50);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Banner Modal & Upload State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form values if editing an existing deal, otherwise reset form to blank
  useEffect(() => {
    if (dealToEdit) {
      setDealTitle(dealToEdit.title || '');
      setBannerHeading(dealToEdit.bannerHeading || '');
      setBannerSubheading(dealToEdit.bannerSubheading || '');
      setBannerImage(dealToEdit.bannerImage || '');
      setBannerBgColor(dealToEdit.bannerBgColor || '#ffffff');
      setSelectedCategoryIds(dealToEdit.categoryIds || []);
      setDiscountStartPercent(
        dealToEdit.discountStartPercent !== undefined ? Number(dealToEdit.discountStartPercent) : ''
      );
      setDiscountEndPercent(
        dealToEdit.discountEndPercent !== undefined ? Number(dealToEdit.discountEndPercent) : ''
      );
      setStartDate(
        dealToEdit.startDate ? new Date(dealToEdit.startDate).toISOString().split('T')[0] : ''
      );
      setEndDate(dealToEdit.endDate ? new Date(dealToEdit.endDate).toISOString().split('T')[0] : '');
    } else {
      // Creating a new deal: reset form state to blank
      setDealTitle('');
      setBannerHeading('');
      setBannerSubheading('');
      setBannerImage('');
      setBannerBgColor('#ffffff');
      setSelectedCategoryIds([]);
      setDiscountStartPercent('');
      setDiscountEndPercent('');
      setStartDate('');
      setEndDate('');
    }
  }, [dealToEdit]);

  // Helper for full image URL
  const getFullImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  // Image Upload Handler: Uses same logic as MediaAndVariants.tsx, uploading to /uploads/deals
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const originalName = file.name || 'banner.png';
    const formData = new FormData();

    try {
      setIsUploading(true);
      
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: false };
        const compressedFile = await imageCompression(file, options);
        formData.append('files', compressedFile, originalName);
      } catch (_err) {
        formData.append('files', file, originalName);
      }

      const res = await apiClient.post('/uploads/deals', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const urls = res.data.data;
      if (urls && urls.length > 0) {
        setBannerImage(urls[0]);
        toast.success('Banner image uploaded successfully!');
      }
    } catch (error) {
      console.error('Failed to upload banner image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle category selection
  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  // Filter categories by search keyword
  const categories = categoriesData?.data || [];
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Form Submit Handler: Saves deal & image URL into database
  const handleSubmit = async () => {
    if (!dealTitle.trim()) {
      toast.error('Please enter a Deal Name before saving');
      return;
    }

    const payload = {
      title: dealTitle,
      bannerHeading: bannerHeading || dealTitle,
      bannerSubheading,
      bannerImage,
      bannerBgColor,
      categoryIds: selectedCategoryIds,
      discountStartPercent: discountStartPercent === '' ? undefined : Number(discountStartPercent),
      discountEndPercent: discountEndPercent === '' ? undefined : Number(discountEndPercent),
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : undefined,
      isActive: true,
    };

    try {
      const targetId = dealToEdit?.id;
      if (targetId) {
        await updateDealMutation.mutateAsync({ id: targetId, ...payload });
        toast.success('Deal updated successfully!');
      } else {
        await createDealMutation.mutateAsync(payload);
        toast.success('Deal created successfully!');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error('Failed to save deal:', error);
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err?.response?.data?.message || 'Failed to update deal.');
    }
  };

  const isSubmitting = createDealMutation.isPending || updateDealMutation.isPending;

  return (
    <div className='w-full bg-white border border-[#e5e5e6] rounded-lg p-6 flex flex-col gap-8'>
      {/* Hidden File Input for Banner Upload */}
      <input
        type='file'
        accept='image/*'
        ref={fileInputRef}
        className='hidden'
        onChange={handleBannerUpload}
      />

      {/* Top Header with Back Button */}
      <div className='flex items-center justify-between border-b border-[#e5e5e6] pb-4'>
        <div className='flex items-center gap-3'>
          {onBack && (
            <button
              onClick={onBack}
              className='p-1.5 hover:bg-gray-100 rounded-sm text-[#42454d] hover:text-black transition-colors cursor-pointer'
              title='Back to Deals Table'
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h3 className='font-semibold text-[20px] text-black'>
              {dealToEdit ? 'Edit Promotion Deal' : 'Create Promotion Deal'}
            </h3>
            <p className='text-[13px] text-[#848995]'>
              Configure the banner image, headings, discount percentage, and applied categories.
            </p>
          </div>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className='px-3.5 py-1.5 border border-[#e5e5e6] hover:bg-gray-50 rounded-xs text-[13px] font-medium text-[#42454d] cursor-pointer'
          >
            Cancel & Back
          </button>
        )}
      </div>

      {/* Top Section - Deal Name & Banner */}
      <div className='flex flex-col gap-6 w-full border-b border-[#e5e5e6] pb-8'>
        {/* Deal Name Field */}
        <div className='flex flex-col gap-1.5 w-full'>
          <label className='text-[13px] text-[#42454d] font-medium'>
            Deal Name <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={dealTitle}
            onChange={(e) => setDealTitle(e.target.value)}
            placeholder='e.g. Plant House Sale / Summer Collection Deal'
            className='w-full border border-[#e5e5e6] rounded-xs h-9 px-3 text-[13px] text-black bg-white outline-none focus:border-[#f09000]'
          />
        </div>

        {/* Deal Banner Upload Dropzone - Exact same design as MediaAndVariants.tsx */}
        <div className='flex flex-col gap-2 w-full mt-2'>
          <div className='flex items-center justify-between w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>Deal Banner Image</p>
            <button
              type='button'
              onClick={() => setIsBannerModalOpen(true)}
              className='text-[13px] text-[#165dd0] hover:underline font-normal cursor-pointer'
            >
              Optional Overlay Settings
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className='border border-[#e5e5e6] border-dashed rounded-sm px-6 py-6 flex flex-col items-center justify-center gap-3 w-full bg-white h-48 sm:h-64 cursor-pointer hover:bg-gray-50 transition relative overflow-hidden group'
          >
            {bannerImage ? (
              <>
                <Image
                  height={600}
                  width={1200}
                  unoptimized
                  src={getFullImageUrl(bannerImage)}
                  alt='Deal Banner'
                  className='absolute inset-0 w-full h-full object-cover'
                />

                {/* Optional Overlay Text if present */}
                {(bannerHeading || bannerSubheading) && (
                  <div className='absolute inset-0 bg-black/30 flex flex-col justify-center px-8 text-white z-10 pointer-events-none'>
                    <h2 className='text-2xl sm:text-3xl font-bold drop-shadow-md'>{bannerHeading}</h2>
                    {bannerSubheading && <p className='text-base mt-1 drop-shadow-sm opacity-90'>{bannerSubheading}</p>}
                  </div>
                )}

                {/* Hover Delete Action (Same as MediaAndVariants.tsx) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setBannerImage('');
                  }}
                  className='absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition z-20'
                >
                  <div className='bg-red-600 text-white px-3 py-2 rounded-sm hover:bg-red-700 shadow-md flex items-center gap-1.5 text-[13px] font-medium'>
                    <Trash2 className='size-4' /> Remove Banner
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='size-9 bg-[#f9fafb] flex items-center justify-center rounded-full border border-[#e5e5e6]'>
                  <ImageUp className='size-5 text-[#686f7d]' />
                </div>
                <div className='flex flex-col items-center gap-1 text-center'>
                  <p className='text-[14px] text-[#42454d] font-normal'>
                    {isUploading ? 'Uploading Banner...' : 'Click to Upload Deal Banner Image'}
                  </p>
                  <p className='text-[12px] text-[#848995] font-normal'>
                    Supports PNG, JPG, WEBP formats
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Products and Other Control Section */}
      <div className='flex flex-col gap-6 w-full'>
        <h3 className='font-semibold text-[18px] text-black'>Products and Other Control</h3>

        {/* Dynamic Category Selection */}
        <div className='flex flex-col gap-1.5 w-full'>
          <div className='flex items-center justify-between w-full'>
            <label className='text-[13px] text-[#42454d] font-normal'>
              Deal Product Categories ({selectedCategoryIds.length} selected)
            </label>
            {selectedCategoryIds.length > 0 && (
              <button
                type='button'
                onClick={() => setSelectedCategoryIds([])}
                className='text-[12px] text-[#cb1b1b] hover:underline cursor-pointer'
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className='relative w-full sm:w-87.5'>
            <input
              type='text'
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder='Search categories...'
              className='w-full border border-[#e5e5e6] rounded-xs h-9 pl-3 pr-10 text-[13px] text-black placeholder-[#848995] bg-white outline-none focus:border-[#f09000]'
            />
            <Search
              size={16}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b3b8]'
            />
          </div>

          {/* Categories Grid fetched from Backend GET API */}
          {isLoadingCategories ? (
            <div className='py-6 text-[13px] text-[#848995]'>Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className='py-6 text-[13px] text-[#848995]'>No categories found.</div>
          ) : (
            <div className='w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-4 gap-x-2 mt-4 max-h-60 overflow-y-auto p-1 border border-[#f2f2f3] rounded-xs'>
              {filteredCategories.map((category) => {
                const isSelected = selectedCategoryIds.includes(category.id);
                return (
                  <label
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className='flex items-center gap-2 cursor-pointer w-fit select-none py-1 px-1 rounded hover:bg-gray-50'
                  >
                    {isSelected ? (
                      <div className='w-3.5 h-3.5 rounded-xs bg-[#f09000] flex items-center justify-center shrink-0'>
                        <Check size={10} className='text-white' strokeWidth={3} />
                      </div>
                    ) : (
                      <div className='w-3.5 h-3.5 rounded-xs border border-[#dcdce0] bg-white shrink-0' />
                    )}
                    <span
                      className={`text-[12px] ${isSelected ? 'font-semibold text-[#f09000]' : 'text-[#42454d]'}`}
                    >
                      {category.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Discount Percentages */}
        <div className='flex flex-col sm:flex-row gap-6 w-full mt-4'>
          <div className='flex flex-col gap-1.5 w-full flex-1'>
            <label className='text-[13px] text-[#42454d] font-normal'>
              Discount Percentage (starting %)
            </label>
            <input
              type='number'
              value={discountStartPercent}
              onChange={(e) =>
                setDiscountStartPercent(e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder='e.g. 5'
              className='w-full border border-[#e5e5e6] rounded-xs h-9 px-3 text-[13px] text-black bg-white outline-none focus:border-[#f09000]'
            />
          </div>
          <div className='flex flex-col gap-1.5 w-full flex-1'>
            <label className='text-[13px] text-[#42454d] font-normal'>
              Discount Percentage (End %)
            </label>
            <input
              type='number'
              value={discountEndPercent}
              onChange={(e) =>
                setDiscountEndPercent(e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder='e.g. 50'
              className='w-full border border-[#e5e5e6] rounded-xs h-9 px-3 text-[13px] text-black bg-white outline-none focus:border-[#f09000]'
            />
          </div>
        </div>

        {/* Deal Start & End Dates */}
        <div className='flex flex-col sm:flex-row gap-6 w-full mt-2'>
          <div className='flex flex-col gap-1.5 w-full flex-1 relative'>
            <label className='text-[13px] text-[#42454d] font-normal'>Deal start Date</label>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='w-full border border-[#e5e5e6] rounded-xs h-9 px-3 text-[13px] text-black bg-white outline-none focus:border-[#f09000]'
            />
          </div>
          <div className='flex flex-col gap-1.5 w-full flex-1 relative'>
            <label className='text-[13px] text-[#42454d] font-normal'>Deal End Date</label>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='w-full border border-[#e5e5e6] rounded-xs h-9 px-3 text-[13px] text-black bg-white outline-none focus:border-[#f09000]'
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex items-center gap-3 mt-6'>
          <button
            type='button'
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='flex-1 h-10 bg-[#f09000] hover:bg-[#e08600] disabled:opacity-50 transition-colors rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm'
          >
            <span className='text-[14px] text-white font-medium'>
              {isSubmitting
                ? 'Saving Deal...'
                : dealToEdit
                  ? 'Update & Save Deal'
                  : 'Create & Save Deal'}
            </span>
            <RefreshCcw size={16} className={`text-white ${isSubmitting ? 'animate-spin' : ''}`} />
          </button>

          {onBack && (
            <button
              type='button'
              onClick={onBack}
              className='px-6 h-10 border border-[#e5e5e6] hover:bg-gray-100 text-[#42454d] text-[14px] font-medium rounded-xs cursor-pointer'
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Optional Banner Text Settings Modal */}
      {isBannerModalOpen && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-6 max-w-lg w-full flex flex-col gap-4 shadow-xl relative'>
            <div className='flex items-center justify-between border-b border-[#e5e5e6] pb-3'>
              <h4 className='font-semibold text-lg text-black flex items-center gap-2'>
                <Plus size={18} /> Optional Overlay Text
              </h4>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className='text-gray-500 hover:text-black p-1 cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-[13px] text-[#42454d] font-medium'>Overlay Heading Text</label>
              <input
                type='text'
                value={bannerHeading}
                onChange={(e) => setBannerHeading(e.target.value)}
                placeholder='e.g. Buy Your Favorite Plant'
                className='w-full border border-[#e5e5e6] rounded-xs h-9 px-3 text-[13px] text-black outline-none focus:border-[#f09000]'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-[13px] text-[#42454d] font-medium'>Overlay Subheading Text</label>
              <input
                type='text'
                value={bannerSubheading}
                onChange={(e) => setBannerSubheading(e.target.value)}
                placeholder='e.g. From Plant Home'
                className='w-full border border-[#e5e5e6] rounded-xs h-9 px-3 text-[13px] text-black outline-none focus:border-[#f09000]'
              />
            </div>

            <div className='flex items-center justify-end gap-2 border-t border-[#e5e5e6] pt-3 mt-2'>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className='px-4 h-9 bg-[#f09000] text-white text-[13px] font-medium rounded-xs hover:bg-[#e08600] cursor-pointer'
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
