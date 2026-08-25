'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/contexts/CartContext';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);
const imageUrl = (value: string) =>
  value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;

const colorNameMap: Record<string, string> = {
  '#F09000': 'Yellow/Orange', '#1F8394': 'Teal', '#EAB308': 'Yellow',
  '#29941F': 'Green', '#941F21': 'Red', '#86941F': 'Olive',
  '#231F94': 'Blue', '#121212': 'Black', '#FBFEFF': 'White',
  '#A45496': 'Purple', '#989A98': 'Gray', '#3DC4C4': 'Cyan',
  '#BF97CF': 'Lavender', '#8B8AA4': 'Slate'
};

export default function CartItemList() {
  const { items, selectedItems, toggleItemSelection, selectAllItems, clearSelection, removeItems, updateQuantity, updateVariant } = useCartStore();

  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectAllItems(items.map(i => i.cartItemId));
    } else {
      clearSelection();
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length > 0) {
      removeItems(selectedItems);
    }
  };

  return (
    <div className='flex w-full flex-[1_0_0] flex-col items-start'>
      {/* Header */}
      <div className='flex w-full items-center justify-between border-b border-[#E5E5E6] px-5 py-3.5'>
        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            checked={allSelected}
            onChange={handleSelectAll}
            className='size-4 appearance-none rounded-lg border border-black cursor-pointer checked:border-[#DEC33A] checked:bg-[#DEC33A] relative
            checked:before:absolute checked:before:left-1/2 checked:before:top-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2
            checked:before:w-2 checked:before:h-3 checked:before:border-b-2 checked:before:border-r-2 checked:before:border-black checked:before:rotate-45 checked:before:mb-0.5'
          />
          <span className='text-[14px] leading-[1.3] text-[#42454D]'>
            Select All ({items.length} Items)
          </span>
        </div>
        <button
          className='flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-30'
          onClick={handleDeleteSelected}
          disabled={selectedItems.length === 0}
        >
          <Trash2 size={16} className='text-[#CB1B1B]' />
          <span className='text-[14px] leading-[1.3] text-[#CB1B1B]'>
            Delete
          </span>
        </button>
      </div>

      {/* Items List */}
      <div className='flex w-full flex-col items-start'>
        {items.length === 0 ? (
          <div className="p-8 text-center w-full text-gray-500">Your cart is empty.</div>
        ) : items.map((item) => {
          const sizes = item.availableVariants ? [...new Set(item.availableVariants.map(v => v.size).filter(Boolean))] as string[] : [];
          const storages = item.availableVariants ? [...new Set(item.availableVariants.map(v => v.storage).filter(Boolean))] as string[] : [];
          const materials = item.availableVariants ? [...new Set(item.availableVariants.map(v => v.material).filter(Boolean))] as string[] : [];

          return (
          <div
            key={item.cartItemId}
            className='flex w-full items-center gap-2 sm:gap-3 border-b border-[#E5E5E6] p-4 sm:p-6'
          >
            <input
              type='checkbox'
              checked={selectedItems.includes(item.cartItemId)}
              onChange={() => toggleItemSelection(item.cartItemId)}
              className='size-4 appearance-none rounded-lg border border-black cursor-pointer checked:border-[#DEC33A] checked:bg-[#DEC33A] relative shrink-0
              checked:before:absolute checked:before:left-1/2 checked:before:top-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2
              checked:before:w-2 checked:before:h-3 checked:before:border-b-2 checked:before:border-r-2 checked:before:border-black checked:before:rotate-45 checked:before:mb-0.5'
            />

            <div className='flex w-full flex-[1_0_0] items-center gap-4'>
              <Link href={`/products/${item.slug}`} className='relative size-25 shrink-0 rounded-xs overflow-hidden block'>
                <Image
                  src={imageUrl(item.image)}
                  alt={item.name}
                  fill
                  unoptimized
                  className='object-cover'
                />
              </Link>

              <div className='flex w-full flex-col gap-4'>
                <div className='flex w-full flex-col gap-1'>
                  {/* Title & Rating */}
                  <div className='flex w-full flex-col sm:flex-row items-start justify-between sm:items-center gap-2 sm:gap-0'>
                    <Link href={`/products/${item.slug}`} className='text-[16px] sm:text-[18px] leading-[1.2] text-black hover:underline line-clamp-1'>
                      {item.name}
                    </Link>
                  </div>
                  {/* Seller & Variants */}
                  <div className='flex flex-col gap-1.5 mt-1'>
                    <p className='text-[12px] leading-[1.3] text-[#848995]'>
                      Sold by: <span className="font-medium text-[#42454D]">{item.sellerName || 'Facep'}</span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(item.availableColors && item.availableColors.length > 0) && (
                        <div className="flex items-center gap-1.5 mr-2">
                          <span className="text-[12px] text-[#42454D]">Color:</span>
                          <div className="flex gap-1">
                            {item.availableColors.map(c => (
                              <button
                                key={c}
                                type='button'
                                onClick={() => updateVariant(item.cartItemId, 'color', c)}
                                className={`h-5 w-5 rounded-full border p-px ${
                                  item.color === c ? 'border-[#686F7D]' : 'border-transparent'
                                }`}
                                title={colorNameMap[c] || c}
                              >
                                <span className='block size-full rounded-full border border-gray-200' style={{ backgroundColor: c }} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {sizes.length > 0 && (
                        <select
                          value={item.size || ''}
                          onChange={(e) => updateVariant(item.cartItemId, 'size', e.target.value)}
                          className="text-[12px] border rounded px-1.5 py-0.5 outline-none bg-white text-[#42454D]"
                        >
                          <option value="" disabled>Size</option>
                          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                      {storages.length > 0 && (
                        <select
                          value={item.storage || ''}
                          onChange={(e) => updateVariant(item.cartItemId, 'storage', e.target.value)}
                          className="text-[12px] border rounded px-1.5 py-0.5 outline-none bg-white text-[#42454D]"
                        >
                          <option value="" disabled>Storage</option>
                          {storages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                      {materials.length > 0 && (
                        <select
                          value={item.material || ''}
                          onChange={(e) => updateVariant(item.cartItemId, 'material', e.target.value)}
                          className="text-[12px] border rounded px-1.5 py-0.5 outline-none bg-white text-[#42454D]"
                        >
                          <option value="" disabled>Material</option>
                          {materials.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className='flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mt-1 sm:mt-0'>
                  <div className='flex flex-col gap-0.5'>
                    <p className='text-[18px] sm:text-[22px] leading-[1.2] text-black font-bold'>
                      ${item.price.toFixed(2)}
                    </p>

                    {(Number(item.shippingCost) > 0 || Number(item.taxAmount) > 0 || Number(item.vatGst) > 0 || Number(item.importCharges) > 0 || Number(item.handlingFee) > 0) && (
                      <p className='text-[12px] leading-[1.3] text-[#848995]'>
                        + ${(
                          (item.shippingCost || 0) +
                          (item.taxAmount || 0) +
                          (item.vatGst || 0) +
                          (item.importCharges || 0) +
                          (item.handlingFee || 0)
                        ).toFixed(2)} Shipping & Extra Charges
                      </p>
                    )}
                  </div>

                  <div className='flex w-34.75 shrink-0 items-center justify-between rounded-xs border-[0.75px] border-[#686F7D] px-3 py-1'>
                    <button
                      className='text-[#42454D] hover:text-black transition-colors disabled:opacity-30'
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className='text-[12px] leading-[1.3] text-[#42454D]'>
                      {item.quantity}
                    </span>
                    <button
                      className='text-[#42454D] hover:text-black transition-colors'
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
