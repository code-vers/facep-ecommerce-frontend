'use client';

import React from 'react';
import { History } from 'lucide-react';
import { useBrowsingHistory } from '@/lib/view-history';
import { toast } from 'sonner';
import ProductCarouselPopover from './ProductCarouselPopover';

interface BrowsingHistoryPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function BrowsingHistoryPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: BrowsingHistoryPopoverProps) {
  const { products, isLoading, clearHistory } = useBrowsingHistory(10);

  const handleClearHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearHistory();
    toast.success('Browsing history cleared');
  };

  return (
    <ProductCarouselPopover
      isOpen={isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClose={onClose}
      icon={<History size={16} className="text-[#9e8316]" />}
      iconContainerClass="size-8 rounded-full bg-[#dec33a]/20 text-[#2b323b] flex items-center justify-center"
      title="Your Browsing History"
      subtitle="Recent items you viewed on Facep"
      headerLinkHref="/browsing-history"
      headerLinkLabel="View or edit your browsing history"
      products={products}
      isLoading={isLoading}
      defaultOfferText="Viewed"
      emptyIcon={<History size={26} className="text-gray-300" />}
      emptyMessage="You haven't viewed any products yet."
      footerCountText={(count) =>
        count > 0
          ? `Showing recent ${count} item${count === 1 ? '' : 's'}`
          : 'Your browsing history is currently empty'
      }
      footerLinkHref="/browsing-history"
      footerLinkLabel="Manage history →"
      footerExtraAction={
        products.length > 0 ? (
          <button
            type="button"
            onClick={handleClearHistory}
            className="font-bold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Clear all history
          </button>
        ) : undefined
      }
    />
  );
}
