'use client';

import React from 'react';
import { Gift } from 'lucide-react';
import { useHolidayDeals } from '@/hooks/api/useProduct';
import ProductCarouselPopover from './ProductCarouselPopover';

interface HolidayDealsPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function HolidayDealsPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: HolidayDealsPopoverProps) {
  const { data, isLoading } = useHolidayDeals({ limit: 10 });
  const products = data?.data || [];

  return (
    <ProductCarouselPopover
      isOpen={isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClose={onClose}
      icon={<Gift size={16} className="text-rose-600" />}
      iconContainerClass="size-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center"
      title="Holiday Deals & Festive Specials"
      subtitle="Top 10 holiday gifts, seasonal bundles & celebrations"
      headerLinkHref="/holiday-deals"
      headerLinkLabel="See all holiday deals"
      products={products}
      isLoading={isLoading}
      defaultOfferText="Holiday Deal"
      emptyIcon={<Gift size={26} className="text-gray-300" />}
      emptyMessage="No products currently featured in Holiday Deals."
      footerCountText={(count) =>
        count > 0
          ? `Showing top ${count} holiday deal${count === 1 ? '' : 's'}`
          : 'Festive season discounts & gifts'
      }
      footerLinkHref="/holiday-deals"
      footerLinkLabel="Explore Holiday Deals catalog →"
    />
  );
}
