'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, X } from 'lucide-react';
import React, { useState } from 'react';
import { apiClient } from '../../../lib/api/axios';
import { useProductFormStore } from '../../../store/useProductFormStore';

interface ProductBasicsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ProductBasics({}: ProductBasicsProps) {
  const store = useProductFormStore();

  // Local state for temporary inputs
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data?.data || [];
    },
  });

  // Handle Tags
  const handleAddTag = () => {
    if (tagInput.trim() && !store.tags.includes(tagInput.trim())) {
      store.setField('tags', [...store.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    store.setField(
      'tags',
      store.tags.filter((t) => t !== tagToRemove),
    );
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle Colors
  const handleAddColor = () => {
    // simple hex code validation
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const color = colorInput.trim();
    if (color && hexRegex.test(color) && !store.availableColors.includes(color)) {
      store.setField('availableColors', [...store.availableColors, color]);
      setColorInput('');
      setIsColorPickerOpen(false);
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    store.setField(
      'availableColors',
      store.availableColors.filter((c) => c !== colorToRemove),
    );
  };

  const activeCategory = categoriesData?.find((c: any) => c.id === store.categoryId);
  const subcategories = activeCategory?.subcategories || [];

  return (
    <div className='border border-[#e5e5e6] border-solid flex flex-col items-start w-full relative shrink-0'>
      <div className='flex flex-col gap-4 md:gap-6 items-start p-4 md:p-6 w-full relative shrink-0'>
        {/* Basic Product Information */}
        <div className='flex flex-col gap-4.5 items-start w-full'>
          <p className='font-semibold leading-[1.2] text-[20px] text-black'>
            Basic Product Information
          </p>

          <div className='flex flex-col gap-4 md:gap-4.5 w-full'>
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
              {/* Store / Brand */}
              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Store / Brand</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative'>
                  <input
                    type='text'
                    value={store.brand}
                    onChange={(e) => store.setField('brand', e.target.value)}
                    placeholder='e.g. Plant House'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] pr-6'
                  />
                </div>
              </div>

              {/* Product Type */}
              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Product Type</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='text'
                    value={store.productType}
                    onChange={(e) => store.setField('productType', e.target.value)}
                    placeholder='e.g. Plant'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>

            {/* Short Product Summary */}
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-normal leading-[1.2] text-[16px] text-black'>
                Short Product Summary
              </p>
              <div className='border border-[#e5e5e6] bg-white flex items-start h-21 px-3 py-2.5 rounded-sm w-full'>
                <textarea
                  value={store.shortDescription}
                  onChange={(e) => store.setField('shortDescription', e.target.value)}
                  placeholder='Brief product description'
                  className='w-full h-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] resize-none'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category & Filter Information */}
        <div className='flex flex-col gap-4.5 items-start w-full mt-2'>
          <p className='font-semibold leading-[1.2] text-[20px] text-black'>
            Category & Filter Information
          </p>

          <div className='flex flex-col gap-4 md:gap-4.5 w-full'>
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
              {/* Main Category */}
              <div className='flex flex-col gap-2 flex-1 w-full relative'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Main Category</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <select
                    value={store.categoryId}
                    onChange={(e) => {
                      store.setField('categoryId', e.target.value);
                      store.setField('subcategoryId', ''); // reset subcategory
                    }}
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black appearance-none'
                  >
                    <option value='' disabled>
                      Select Category
                    </option>
                    {categoriesData?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className='size-4 text-[#848995] absolute right-3 pointer-events-none' />
                </div>
              </div>

              {/* Subcategory */}
              <div className='flex flex-col gap-2 flex-1 w-full relative'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Subcategory</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <select
                    value={store.subcategoryId}
                    onChange={(e) => store.setField('subcategoryId', e.target.value)}
                    disabled={!store.categoryId}
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black appearance-none disabled:opacity-50'
                  >
                    <option value='' disabled>
                      Select Subcategory
                    </option>
                    {subcategories.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className='size-4 text-[#848995] absolute right-3 pointer-events-none' />
                </div>
              </div>
            </div>

            {/* Product Tags */}
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-normal leading-[1.2] text-[16px] text-black'>Product Tags</p>
              <div className='flex items-center gap-2 flex-wrap w-full border border-[#e5e5e6] p-2 rounded-sm bg-white min-h-11.5'>
                {store.tags.map((tag, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-1 bg-[#f2f2f3] border border-[#e5e5e6] px-2 py-1 rounded-sm'
                  >
                    <span className='text-[12px] text-[#42454d] font-normal'>{tag}</span>
                    <X
                      onClick={() => handleRemoveTag(tag)}
                      className='size-3 text-[#686f7d] cursor-pointer hover:text-red-500'
                    />
                  </div>
                ))}
                <input
                  type='text'
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDownTag}
                  placeholder={store.tags.length === 0 ? 'Add tags and press enter' : 'Add tag...'}
                  className='bg-transparent outline-none text-[14px] min-w-30 flex-1'
                />
              </div>
            </div>

            {/* Condition */}
            <div className='flex flex-col gap-3 w-full mt-2'>
              <p className='font-normal leading-[1.2] text-[16px] text-black'>Condition</p>
              <div className='flex items-center gap-6 w-full'>
                {['NEW', 'RENEWED', 'USED'].map((status) => (
                  <label key={status} className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='condition'
                      checked={store.condition === status}
                      onChange={() => store.setField('condition', status as any)}
                      className='w-4 h-4 border-gray-300 focus:ring-[#f09000] text-[#f09000]'
                    />
                    <span className='text-[14px] text-[#42454d] capitalize'>
                      {status.toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Available Color Filters */}
            <div className='flex flex-col gap-2 w-full mt-2'>
              <p className='font-normal leading-[1.2] text-[16px] text-black'>
                Available Color Filters
              </p>
              <div className='flex items-center gap-2 flex-wrap w-full'>
                {store.availableColors.map((color, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-2 bg-[#f2f2f3] border border-[#e5e5e6] px-2 py-1 rounded-sm'
                  >
                    <span className='text-[12px] text-[#42454d] font-normal uppercase'>
                      {color}
                    </span>
                    <div
                      className='w-3 h-3 rounded-full border border-gray-300'
                      style={{ backgroundColor: color }}
                    />
                    <X
                      onClick={() => handleRemoveColor(color)}
                      className='size-3 text-[#686f7d] cursor-pointer hover:text-red-500 ml-1'
                    />
                  </div>
                ))}

                {!isColorPickerOpen ? (
                  <button
                    onClick={() => setIsColorPickerOpen(true)}
                    className='text-[14px] text-[#165dd0] font-normal hover:underline ml-1'
                  >
                    Add Color +
                  </button>
                ) : (
                  <div className='flex items-center gap-2 ml-1'>
                    <input
                      type='color'
                      value={colorInput.startsWith('#') ? colorInput : '#ffffff'}
                      onChange={(e) => setColorInput(e.target.value)}
                      className='w-8 h-8 cursor-pointer p-0 border-0'
                    />
                    <input
                      type='text'
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder='#FFFFFF'
                      className='border border-[#e5e5e6] rounded-sm px-2 py-1 text-[14px] w-25 outline-none'
                    />
                    <button
                      onClick={handleAddColor}
                      className='bg-[#165dd0] text-white text-[12px] px-2 py-1 rounded-sm'
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsColorPickerOpen(false)}
                      className='text-gray-500 text-[12px] px-1'
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
