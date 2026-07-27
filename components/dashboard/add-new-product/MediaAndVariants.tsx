'use client';

import { ImageUp, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { apiClient } from '../../../lib/api/axios';
import { IVariant, useProductFormStore } from '../../../store/useProductFormStore';

export default function MediaAndVariants() {
  const store = useProductFormStore();

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const previewsInputRef = useRef<HTMLInputElement>(null);
  const variantImageInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  // Variant row draft state
  const [draftVariant, setDraftVariant] = useState<Partial<IVariant>>({
    sku: '',
    color: '',
    size: '',
    price: 0,
    stock: 0,
  });

  const getFullImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      setIsUploading(true);
      const res = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const urls = res.data.data;

      if (isThumbnail && urls.length > 0) {
        store.setField('thumbnail', urls[0]);
      } else if (!isThumbnail && urls.length > 0) {
        store.setField('previewImages', [...store.previewImages, ...urls]);
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      setIsUploading(true);
      const res = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const urls = res.data.data;

      if (urls.length > 0) {
        setDraftVariant((prev) => ({ ...prev, image: urls[0] }));
      }
    } catch (error) {
      console.error('Failed to upload variant image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const addVariant = () => {
    if (!draftVariant.sku) return;
    const newVariant: IVariant = {
      id: Date.now().toString(),
      sku: draftVariant.sku || '',
      image: draftVariant.image || '',
      color: draftVariant.color || '',
      size: draftVariant.size || '',
      price: Number(draftVariant.price) || 0,
      stock: Number(draftVariant.stock) || 0,
    };
    store.setField('variants', [...store.variants, newVariant]);
    setDraftVariant({ sku: '', color: '', size: '', price: 0, stock: 0, image: '' });
  };

  const removeVariant = (id: string) => {
    store.setField(
      'variants',
      store.variants.filter((v) => v.id !== id),
    );
  };

  return (
    <div className='flex flex-col gap-6 w-full'>
      {/* Main Product Image Section */}
      <div className='border border-[#e5e5e6] border-solid flex flex-col items-start relative shrink-0 w-full'>
        <div className='flex flex-col gap-4 md:gap-6 items-start p-4 md:p-6 relative shrink-0 w-full'>
          <p className='font-semibold leading-[1.2] text-[20px] text-black'>Main Product Image</p>
          <div className='flex flex-col md:flex-row gap-6 w-full'>
            {/* Product Thumbnail */}
            <div className='flex flex-col gap-2 flex-1 w-full'>
              <p className='font-normal leading-[1.2] text-[16px] text-black'>Product Thumbnail</p>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                ref={thumbnailInputRef}
                onChange={(e) => handleFileUpload(e, true)}
              />
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className='border border-[#e5e5e6] border-dashed rounded-sm px-6 py-3 flex flex-col items-center justify-center gap-3 w-full bg-white h-35 cursor-pointer hover:bg-gray-50 transition relative overflow-hidden'
              >
                {store.thumbnail ? (
                  <Image
                    height={500}
                    width={500}
                    src={getFullImageUrl(store.thumbnail)}
                    alt='Thumbnail'
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                ) : (
                  <>
                    <div className='size-9 bg-[#f9fafb] flex items-center justify-center rounded-full'>
                      <ImageUp className='size-5 text-[#686f7d]' />
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                      <p className='text-[14px] text-[#42454d] font-normal'>
                        {isUploading ? 'Uploading...' : 'Click to Upload Thumbnail'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Product Preview Images */}
            <div className='flex flex-col gap-2 flex-1 w-full'>
              <p className='font-normal leading-[1.2] text-[16px] text-black'>
                Product Preview Images
              </p>
              <input
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                ref={previewsInputRef}
                onChange={(e) => handleFileUpload(e, false)}
              />
              <div className='flex gap-2 w-full h-35'>
                <div
                  onClick={() => previewsInputRef.current?.click()}
                  className='border border-[#e5e5e6] border-dashed rounded-sm px-4 py-3 flex flex-col items-center justify-center gap-2 flex-1 bg-white h-full cursor-pointer hover:bg-gray-50 transition'
                >
                  <div className='size-9 bg-[#f9fafb] flex items-center justify-center rounded-full'>
                    <ImageUp className='size-5 text-[#686f7d]' />
                  </div>
                  <p className='text-[14px] text-[#42454d] font-normal text-center'>
                    {isUploading ? 'Uploading...' : 'Upload Previews'}
                  </p>
                </div>
                {/* Render preview image thumbs */}
                <div className='flex-1 h-full flex flex-wrap gap-2 overflow-y-auto'>
                  {store.previewImages.map((img, i) => (
                    <div
                      key={i}
                      className='relative w-16 h-16 border border-[#e5e5e6] rounded-sm overflow-hidden group'
                    >
                      <Image
                        src={getFullImageUrl(img)}
                        alt={`preview-${i}`}
                        width={500}
                        height={500}
                        className='w-full h-full object-cover'
                      />
                      <div
                        onClick={() =>
                          store.setField(
                            'previewImages',
                            store.previewImages.filter((p) => p !== img),
                          )
                        }
                        className='absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer'
                      >
                        <Trash2 className='text-white size-4' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variants & Product Options Section */}
      <div className='border border-[#e5e5e6] border-solid flex flex-col items-start relative shrink-0 w-full'>
        <div className='flex flex-col gap-4 md:gap-6 items-start p-4 md:p-6 relative shrink-0 w-full'>
          <p className='font-semibold leading-[1.2] text-[20px] text-black'>
            Variants & Product Options
          </p>

          {/* Toggle Variants */}
          <div className='flex items-center justify-between w-full'>
            <p className='font-normal leading-[1.2] text-[16px] text-black'>
              This product has variants?
            </p>
            <div
              onClick={() => store.setField('hasVariants', !store.hasVariants)}
              className={`relative inline-flex items-center cursor-pointer transition-colors ${store.hasVariants ? 'bg-[#f09000]' : 'bg-gray-300'} w-9 h-5 rounded-full p-0.5`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${store.hasVariants ? 'translate-x-4' : 'translate-x-0'}`}
              />
            </div>
          </div>

          {store.hasVariants && (
            <div className='border border-[#e5e5e6] rounded-sm w-full mt-4 flex flex-col overflow-hidden'>
              <div className='flex items-center justify-between p-4 border-b border-[#e5e5e6]'>
                <p className='font-semibold text-[16px] text-black'>Variant Details</p>
              </div>
              <div className='w-full overflow-x-auto'>
                <div className='min-w-200 w-full flex flex-col'>
                  {/* Header */}
                  <div className='bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-4 py-2.25'>
                    <div className='w-15 shrink-0 text-[14px] text-black'>Image</div>
                    <div className='flex-1 text-[14px] text-black'>SKU (ID)</div>
                    <div className='flex-[1.5] text-[14px] text-black'>Color Hex</div>
                    <div className='flex-1 text-[14px] text-black'>Size</div>
                    <div className='flex-1 text-[14px] text-black'>Price</div>
                    <div className='flex-1 text-[14px] text-black'>Stock</div>
                    <div className='w-20 shrink-0 text-[14px] text-black text-center'>Action</div>
                  </div>

                  {/* Existing Variants Rows */}
                  {store.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className='border-b border-[#e5e5e6] flex items-center px-4 py-2 hover:bg-gray-50'
                    >
                      <div className='w-15 shrink-0'>
                        <div className='size-6 bg-gray-200 rounded-sm overflow-hidden border border-[#e5e5e6]'>
                          {variant.image ? (
                            <Image
                              width={500}
                              height={500}
                              src={getFullImageUrl(variant.image)}
                              alt='variant'
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full bg-gray-100' />
                          )}
                        </div>
                      </div>
                      <div className='flex-1 text-[12px] text-[#42454d]'>{variant.sku}</div>
                      <div className='flex-[1.5]'>
                        {variant.color && (
                          <div className='border border-[#e5e5e6] bg-[#f2f2f3] rounded-sm px-2 py-1 inline-flex items-center gap-2'>
                            <span className='text-[12px] text-[#42454d]'>{variant.color}</span>
                            <div
                              className='size-2 rounded-[1px]'
                              style={{ backgroundColor: variant.color }}
                            />
                          </div>
                        )}
                      </div>
                      <div className='flex-1 text-[12px] text-[#42454d]'>{variant.size || '-'}</div>
                      <div className='flex-1 text-[12px] text-[#42454d]'>${variant.price}</div>
                      <div className='flex-1 text-[12px] text-[#42454d]'>{variant.stock}</div>
                      <div className='w-20 shrink-0 flex items-center justify-center gap-3 text-center'>
                        <Trash2
                          onClick={() => removeVariant(variant.id)}
                          className='size-3.5 text-[#cb1b1b] cursor-pointer hover:text-red-700'
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Input Row */}
                  <div className='flex items-center px-4 py-3 bg-[#f9fafb]'>
                    <div className='w-15 shrink-0'>
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        ref={variantImageInputRef}
                        onChange={handleVariantImageUpload}
                      />
                      <div
                        onClick={() => variantImageInputRef.current?.click()}
                        className='size-6 bg-white border border-dashed border-[#e5e5e6] flex items-center justify-center rounded-sm cursor-pointer overflow-hidden'
                      >
                        {draftVariant.image ? (
                          <Image
                            width={500}
                            height={500}
                            alt='variant-draft'
                            src={getFullImageUrl(draftVariant.image)}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <span className='text-[16px] text-[#686f7d]'>+</span>
                        )}
                      </div>
                    </div>
                    <div className='flex-1 pr-4'>
                      <input
                        type='text'
                        placeholder='SKU'
                        value={draftVariant.sku}
                        onChange={(e) => setDraftVariant({ ...draftVariant, sku: e.target.value })}
                        className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white outline-none'
                      />
                    </div>
                    <div className='flex-[1.5] pr-4'>
                      <input
                        type='text'
                        placeholder='Color Hex (e.g. #000)'
                        value={draftVariant.color}
                        onChange={(e) =>
                          setDraftVariant({ ...draftVariant, color: e.target.value })
                        }
                        className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white outline-none'
                      />
                    </div>
                    <div className='flex-1 pr-4'>
                      <input
                        type='text'
                        placeholder='Size'
                        value={draftVariant.size}
                        onChange={(e) => setDraftVariant({ ...draftVariant, size: e.target.value })}
                        className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white outline-none'
                      />
                    </div>
                    <div className='flex-1 pr-4'>
                      <input
                        type='number'
                        placeholder='Price'
                        value={draftVariant.price || ''}
                        onChange={(e) =>
                          setDraftVariant({ ...draftVariant, price: Number(e.target.value) })
                        }
                        className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white outline-none'
                      />
                    </div>
                    <div className='flex-1 pr-4'>
                      <input
                        type='number'
                        placeholder='Stock'
                        value={draftVariant.stock || ''}
                        onChange={(e) =>
                          setDraftVariant({ ...draftVariant, stock: Number(e.target.value) })
                        }
                        className='w-full border border-[#e5e5e6] rounded-sm px-2 py-1 text-[12px] bg-white outline-none'
                      />
                    </div>
                    <div className='w-20 shrink-0 flex items-center justify-center gap-3 text-center'>
                      <button
                        onClick={addVariant}
                        disabled={!draftVariant.sku}
                        className='text-[12px] bg-[#165dd0] text-white px-3 py-1 rounded-sm disabled:opacity-50'
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
