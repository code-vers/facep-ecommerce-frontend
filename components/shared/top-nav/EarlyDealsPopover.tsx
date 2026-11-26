'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { useEarlyDeals } from '@/hooks/api/useProduct';
import ProductCarouselPopover from './ProductCarouselPopover';

interface EarlyDealsPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function EarlyDealsPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: EarlyDealsPopoverProps) {
  const { data, isLoading } = useEarlyDeals({ limit: 10 });
  const products = data?.data || [];

  return (
    <ProductCarouselPopover
      isOpen={isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClose={onClose}
      icon={<Zap size={16} className="text-amber-600 fill-amber-500" />}
      iconContainerClass="size-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"
      title="Early Access Deals & Discounts"
      subtitle="Top 10 early deals with limited-time promotional pricing"
      headerLinkHref="/early-deals"
      headerLinkLabel="See all early deals"
      products={products}
      isLoading={isLoading}
      defaultOfferText="Early Deal"
      emptyIcon={<Zap size={26} className="text-gray-300" />}
      emptyMessage="No products currently featured in Early Deals."
      footerCountText={(count) =>
        count > 0
          ? `Showing top ${count} early deal${count === 1 ? '' : 's'}`
          : 'Exclusive early promotional pricing'
      }
      footerLinkHref="/early-deals"
      footerLinkLabel="Explore Early Deals catalog →"
    />
  );
}
