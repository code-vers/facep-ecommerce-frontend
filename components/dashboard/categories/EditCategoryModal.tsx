'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, ChevronDown, X, UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn, getImageUrl } from '@/lib/utils';
import { apiClient } from '@/lib/api/axios';
import { ApiResponse, Category } from '@/lib/api/category';
import { CategoryStatus } from './AddCategoryModal';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onEditCategory: (
    categoryId: string,
    data: {
      name: string;
      imageUrl?: string | null;
      subcategories: number;
      status: CategoryStatus;
      subcategoryNames?: string[];
    },
  ) => void;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  onEditCategory,
}: EditCategoryModalProps) {
  const [name, setName] = useState(category?.name || '');
  const [imageUrl, setImageUrl] = useState<string>(category?.imageUrl || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [status, setStatus] = useState<CategoryStatus>(
    (category?.status as CategoryStatus) || 'Active',
  );
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const initialSubcategories = () => {
    if (!category || !category.subcategories) return [];
    return category.subcategories.map((subcat: any) => subcat.name);
  };
  const [subcategories, setSubcategories] = useState<string[]>(initialSubcategories);

  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setImageUrl(category.imageUrl || '');
      setStatus((category.status as CategoryStatus) || 'Active');
      setSubcategories(category.subcategories ? category.subcategories.map((s: any) => s.name) : []);
    }
  }, [category]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen || !category) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('files', file);

      const res = await apiClient.post<ApiResponse<string[]>>('/uploads/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.data?.[0]) {
        setImageUrl(res.data.data[0]);
        toast.success('Category image uploaded');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim()) {
      setSubcategories([...subcategories, newSubcategoryName.trim()]);
      setNewSubcategoryName('');
      setIsAddingSubcategory(false);
    }
  };

  const handleRemoveSubcategory = (subcatToRemove: string) => {
    setSubcategories(subcategories.filter((subcat) => subcat !== subcatToRemove));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    onEditCategory(category.id, {
      name: name.trim(),
      imageUrl: imageUrl || null,
      subcategories: subcategories.length,
      status,
      subcategoryNames: subcategories,
    });

    setIsAddingSubcategory(false);
    setNewSubcategoryName('');
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='bg-white border border-[#e5e5e6] w-full max-w-200 rounded-md flex flex-col p-10 relative max-h-[90vh] overflow-y-auto shadow-xl'>
        {/* Close Button Overlay */}
        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-gray-500 hover:text-black cursor-pointer transition-colors'
        >
          <X className='w-6 h-6' />
        </button>

        <div className='border border-[#e5e5e6] flex flex-col gap-6 p-6'>
          {/* Header */}
          <div className='border-b border-[#e5e5e6] flex items-center justify-between pb-2 w-full'>
            <h2 className="font-['Open_Sans'] font-normal text-lg text-black leading-[1.2]">
              Edit Category
            </h2>

            {/* Status Dropdown */}
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={cn(
                  'border flex gap-2 items-center justify-center px-2.5 py-1 rounded-sm transition-colors',
                  status === 'Active'
                    ? 'bg-[#f0f4f2] border-[#e0ebe4] text-[#229a4e]'
                    : 'bg-[#FDE2E2] text-[#CB1B1B]',
                )}
              >
                <span className="font-['Open_Sans'] font-normal text-xs leading-[1.3]">
                  {status}
                </span>
                <ChevronDown className='w-4 h-4 opacity-70' />
              </button>

              {isStatusDropdownOpen && (
                <div className='absolute right-0 top-[110%] bg-white border border-[#e5e5e6] shadow-md rounded-sm w-25 overflow-hidden z-10'>
                  <button
                    onClick={() => {
                      setStatus('Active');
                      setIsStatusDropdownOpen(false);
                    }}
                    className='w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-[#229a4e]'
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setStatus('Disable');
                      setIsStatusDropdownOpen(false);
                    }}
                    className='w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-[#CB1B1B]'
                  >
                    Disable
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-5 w-full'>
            {/* Category Name Input */}
            <div className='flex flex-col gap-2 w-full'>
              <label className="font-['Open_Sans'] font-normal text-base text-black leading-[1.2]">
                Category name
              </label>
              <div className='bg-white border border-[#e5e5e6] rounded-sm px-3 py-2.5 w-full focus-within:border-[#F09000] transition-colors'>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter category name'
                  className="w-full font-['Open_Sans'] font-normal text-sm text-black placeholder:text-[#848995] focus:outline-none"
                />
              </div>
            </div>

            {/* Category Image Upload */}
            <div className='flex flex-col gap-2 w-full'>
              <label className="font-['Open_Sans'] font-normal text-base text-black leading-[1.2]">
                Category Image
              </label>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageFileChange}
                className='hidden'
              />

              {imageUrl ? (
                <div className='flex items-center gap-4 rounded-sm border border-[#e5e5e6] p-3'>
                  <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-gray-100 border border-gray-200'>
                    <Image
                      src={getImageUrl(imageUrl)}
                      alt='Category preview'
                      fill
                      className='object-cover'
                      unoptimized
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <p className='text-xs text-[#5A6573] truncate max-w-xs'>{imageUrl}</p>
                    <div className='flex items-center gap-3'>
                      <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        className='text-xs text-[#165dd0] hover:underline font-medium cursor-pointer'
                      >
                        Change image
                      </button>
                      <button
                        type='button'
                        onClick={() => setImageUrl('')}
                        className='text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer'
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-[#e5e5e6] bg-[#fafafa] py-6 px-4 hover:border-[#F09000] hover:bg-orange-50/20 transition-colors'
                >
                  {isUploadingImage ? (
                    <div className='flex items-center gap-2 text-sm text-[#848995]'>
                      <Loader2 className='h-5 w-5 animate-spin text-[#F09000]' />
                      <span>Uploading image...</span>
                    </div>
                  ) : (
                    <>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-[#848995]'>
                        <UploadCloud size={20} />
                      </div>
                      <div className='text-center'>
                        <p className='text-sm text-black font-medium'>
                          <span className='text-[#165dd0] underline'>Click to upload</span> category image
                        </p>
                        <p className='text-xs text-[#848995] mt-0.5'>PNG, JPG, or WEBP up to 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Subcategories Display */}
            {subcategories.length > 0 && (
              <div className='flex flex-wrap gap-3 items-center w-full'>
                {subcategories.map((subcat) => (
                  <div
                    key={subcat}
                    className='flex gap-3 items-center cursor-pointer group'
                    onClick={() => handleRemoveSubcategory(subcat)}
                  >
                    <div className='relative shrink-0 size-4'>
                      <div className='absolute inset-0 bg-[#f09000] border border-[#f09000] rounded flex items-center justify-center transition-colors group-hover:bg-[#d98200]'>
                        <Check className='w-3 h-3 text-white' strokeWidth={3} />
                      </div>
                    </div>
                    <span className="font-['Open_Sans'] font-normal text-sm text-[#344054] leading-[1.3]">
                      {subcat}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subcategory Trigger */}
            <button
              onClick={() => setIsAddingSubcategory(true)}
              className="text-[#165dd0] font-['Open_Sans'] font-normal text-base leading-[1.2] w-max hover:underline text-left cursor-pointer"
            >
              Add subcategory +
            </button>

            {/* Add Subcategory Input */}
            {isAddingSubcategory && (
              <div className='flex flex-col gap-2 w-full mt-2'>
                <label className="font-['Open_Sans'] font-normal text-base text-black leading-[1.2]">
                  Subcategory name
                </label>
                <div className='bg-white border border-[#e5e5e6] rounded-sm pl-3 pr-3 py-2.5 w-full flex items-center focus-within:border-[#F09000] transition-colors'>
                  <input
                    type='text'
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder='Enter subcategory name'
                    className="flex-1 font-['Open_Sans'] font-normal text-sm text-black placeholder:text-[#848995] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubcategory();
                    }}
                  />
                  <button
                    onClick={handleAddSubcategory}
                    className='text-[#165dd0] hover:text-[#0f46a3] transition-colors cursor-pointer'
                  >
                    <Check className='w-4 h-4' />
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className='flex justify-end w-full mt-4'>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || isUploadingImage}
                className="bg-[#f09000] hover:bg-[#d98200] disabled:opacity-50 disabled:cursor-not-allowed border border-[#f09000] text-black font-['Open_Sans'] font-normal text-sm leading-[1.2] px-3 py-2 rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                Save Changes
                <Check className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
