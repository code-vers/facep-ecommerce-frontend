'use client';

import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { useToysAndGames } from '@/hooks/api/useProduct';
import ProductCarouselPopover from './ProductCarouselPopover';

interface ToysAndGamesPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function ToysAndGamesPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: ToysAndGamesPopoverProps) {
  const { data, isLoading } = useToysAndGames({ limit: 10 });
  const products = data?.data || [];

  return (
    <ProductCarouselPopover
      isOpen={isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClose={onClose}
      icon={<Gamepad2 size={16} className="text-indigo-600" />}
      iconContainerClass="size-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"
      title="Featured Toys & Games"
      subtitle="Top 10 trending toys, board games & play essentials"
      headerLinkHref="/toys-and-games"
      headerLinkLabel="See all toys & games"
      products={products}
      isLoading={isLoading}
      defaultOfferText="Toys & Games"
      emptyIcon={<Gamepad2 size={26} className="text-gray-300" />}
      emptyMessage="No products currently featured in Toys & Games."
      footerCountText={(count) =>
        count > 0
          ? `Showing top ${count} featured toy${count === 1 ? '' : 's'} & game${count === 1 ? '' : 's'}`
          : 'Curated toys & entertainment'
      }
      footerLinkHref="/toys-and-games"
      footerLinkLabel="Explore Toys & Games catalog →"
    />
  );
}
