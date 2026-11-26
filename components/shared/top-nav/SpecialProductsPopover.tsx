'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useSpecialProducts } from '@/hooks/api/useProduct';
import ProductCarouselPopover from './ProductCarouselPopover';

interface SpecialProductsPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function SpecialProductsPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: SpecialProductsPopoverProps) {
  const { data, isLoading } = useSpecialProducts({ limit: 10 });
  const products = data?.data || [];

  return (
    <ProductCarouselPopover
      isOpen={isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClose={onClose}
      icon={<Sparkles size={16} className="text-[#9e8316]" />}
      iconContainerClass="size-8 rounded-full bg-[#dec33a]/20 text-[#2b323b] flex items-center justify-center"
      title="Featured Special Products"
      subtitle="Handpicked premier items & signature highlights"
      headerLinkHref="/special-products"
      headerLinkLabel="See all special products"
      products={products}
      isLoading={isLoading}
      defaultOfferText="Special Product"
      emptyIcon={<Sparkles size={26} className="text-gray-300" />}
      emptyMessage="No special products currently featured."
      footerCountText={(count) =>
        count > 0
          ? `Showing top ${count} handpicked special product${count === 1 ? '' : 's'}`
          : 'Curated selection by Facep'
      }
      footerLinkHref="/special-products"
      footerLinkLabel="Explore full Special Products catalog →"
    />
  );
}
