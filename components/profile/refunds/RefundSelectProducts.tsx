/**
 * @fileoverview Step 1 – Select Products for Return.
 * Displays delivered orders with selectable items matching the Figma design
 * for node 2134-2635.
 *
 * @module components/profile/refunds/RefundSelectProducts
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReturnableItem {
  id: string;
  orderId: string;
  name: string;
  seller: string;
  price: string;
  imageSrc: string;
  rating: number;
  reviewCount: string;
  orderDate: string;
}

const RETURNABLE_ITEMS: ReturnableItem[] = [
  {
    id: 'item-1',
    orderId: 'ORD-123456',
    name: 'Samsung Galaxy S25 Ultra',
    seller: 'By tech store',
    price: '$1,649.99',
    imageSrc: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: '4,470',
    orderDate: '01.05.26',
  },
  {
    id: 'item-2',
    orderId: 'ORD-789012',
    name: 'Office Chair Pro',
    seller: 'By chair co',
    price: '$199.99',
    imageSrc: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=300&auto=format&fit=crop',
    rating: 4.2,
    reviewCount: '1,230',
    orderDate: '15.04.26',
  },
];

interface RefundSelectProductsProps {
  onNext: (selectedIds: string[]) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-4 h-4',
            star <= Math.round(rating)
              ? 'fill-[#dec33a] text-[#dec33a]'
              : 'fill-[#e5e5e6] text-[#e5e5e6]'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Step 1: Select the products to return.
 */
export default function RefundSelectProducts({ onNext }: RefundSelectProductsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-9 w-full">
      <h2 className="text-[22px] font-normal text-[#232a39] leading-[1.2]">
        Select product(s) you want to return:
      </h2>

      <div className="flex flex-col gap-4 w-full">
        {RETURNABLE_ITEMS.map((item) => {
          const isSelected = selected.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={cn(
                'border rounded-[2px] p-6 flex items-center gap-4 cursor-pointer transition-all duration-200 select-none',
                isSelected
                  ? 'border-[#dec33a] bg-[#fdf9e8]'
                  : 'border-[#e5e5e6] bg-white hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'w-5 h-5 rounded-[2px] border-2 flex items-center justify-center shrink-0 transition-all',
                  isSelected
                    ? 'bg-[#dec33a] border-[#dec33a]'
                    : 'bg-white border-[#686f7d]'
                )}
              >
                {isSelected && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path
                      d="M1 4L4.5 7.5L11 1"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Product image */}
              <div className="relative w-[100px] h-[100px] rounded-[2px] shrink-0 overflow-hidden bg-gray-100">
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-6 flex-wrap">
                      <span className="text-[18px] font-normal text-black leading-[1.2]">
                        {item.name}
                      </span>
                      <span className="text-[12px] text-[#848995] leading-[1.3]">
                        Order Received - {item.orderDate}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#848995] leading-[1.3]">
                      {item.seller}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StarRating rating={item.rating} />
                    <span className="text-[12px] text-black leading-[1.3]">
                      {item.rating} ({item.reviewCount})
                    </span>
                  </div>
                </div>

                <p className="text-[22px] font-normal text-black leading-[1.2] mt-4">
                  {item.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={() => onNext(Array.from(selected))}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-[2px] text-[16px] font-normal leading-[1.2] transition-all',
            selected.size > 0
              ? 'bg-[#dec33a] border border-[#dec33a] text-black hover:bg-[#c9b034] cursor-pointer'
              : 'bg-[#e5e5e6] border border-[#e5e5e6] text-[#848995] cursor-not-allowed'
          )}
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
