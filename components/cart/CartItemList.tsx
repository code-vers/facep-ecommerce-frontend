'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/contexts/CartContext';

export default function CartItemList() {
  const { items, selectedItems, toggleItemSelection, selectAllItems, clearSelection, removeItems, updateQuantity } = useCartStore();

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
            className='size-4 appearance-none rounded-[4px] border border-black cursor-pointer checked:border-[#DEC33A] checked:bg-[#DEC33A] relative
            checked:before:absolute checked:before:left-1/2 checked:before:top-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2
            checked:before:w-2 checked:before:h-3 checked:before:border-b-2 checked:before:border-r-2 checked:before:border-black checked:before:rotate-45 checked:before:mb-[2px]'
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
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className='flex w-full items-center gap-2 sm:gap-3 border-b border-[#E5E5E6] p-4 sm:p-6'
          >
            <input
              type='checkbox'
              checked={selectedItems.includes(item.cartItemId)}
              onChange={() => toggleItemSelection(item.cartItemId)}
              className='size-4 appearance-none rounded-[4px] border border-black cursor-pointer checked:border-[#DEC33A] checked:bg-[#DEC33A] relative shrink-0
              checked:before:absolute checked:before:left-1/2 checked:before:top-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2
              checked:before:w-2 checked:before:h-3 checked:before:border-b-2 checked:before:border-r-2 checked:before:border-black checked:before:rotate-45 checked:before:mb-[2px]'
            />

            <div className='flex w-full flex-[1_0_0] items-center gap-4'>
              <div className='relative size-[100px] shrink-0 rounded-[2px] overflow-hidden'>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className='object-cover pointer-events-none'
                />
              </div>

              <div className='flex w-full flex-col gap-4'>
                <div className='flex w-full flex-col gap-1'>
                  {/* Title & Rating */}
                  <div className='flex w-full flex-col sm:flex-row items-start justify-between sm:items-center gap-2 sm:gap-0'>
                    <h3 className='text-[16px] sm:text-[18px] leading-[1.2] text-black'>
                      {item.name}
                    </h3>
                  </div>
                  {/* Seller & Color */}
                  <div className='flex flex-col gap-1'>
                    <p className='text-[12px] leading-[1.3] text-[#848995]'>
                      Color: {item.color}
                    </p>
                    <p className='text-[12px] leading-[1.3] text-[#848995]'>
                      By tech store
                    </p>
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className='flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mt-2 sm:mt-0'>
                  <p className='text-[18px] sm:text-[22px] leading-[1.2] text-black'>
                    ${item.price.toFixed(2)}
                  </p>
                  
                  <div className='flex w-[139px] shrink-0 items-center justify-between rounded-[2px] border-[0.75px] border-[#686F7D] px-3 py-1'>
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
        ))}
      </div>
    </div>
  );
}
