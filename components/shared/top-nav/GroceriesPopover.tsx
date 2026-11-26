'use client';

import React from 'react';
import { Apple } from 'lucide-react';
import { useGroceries } from '@/hooks/api/useProduct';
import ProductCarouselPopover from './ProductCarouselPopover';

interface GroceriesPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function GroceriesPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: GroceriesPopoverProps) {
  const { data, isLoading } = useGroceries({ limit: 10 });
  const products = data?.data || [];

  return (
    <ProductCarouselPopover
      isOpen={isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClose={onClose}
      icon={<Apple size={16} className="text-emerald-600" />}
      iconContainerClass="size-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"
      title="Featured Groceries & Fresh Market"
      subtitle="Top 10 daily pantry staples, snacks & fresh essentials"
      headerLinkHref="/groceries"
      headerLinkLabel="See all groceries"
      products={products}
      isLoading={isLoading}
      defaultOfferText="Groceries"
      emptyIcon={<Apple size={26} className="text-gray-300" />}
      emptyMessage="No products currently featured in Groceries."
      footerCountText={(count) =>
        count > 0
          ? `Showing top ${count} featured grocery item${count === 1 ? '' : 's'}`
          : 'Pantry staples & kitchen essentials'
      }
      footerLinkHref="/groceries"
      footerLinkLabel="Explore Groceries catalog →"
    />
  );
}
