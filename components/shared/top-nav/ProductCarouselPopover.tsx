'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import NavPopoverWrapper from './NavPopoverWrapper';
import { imageUrl, formatPrice, effectivePrice } from './topNavUtils';
import { useCartStore } from '@/contexts/CartContext';
import { toast } from 'sonner';
import type { Product } from '@/lib/api/product';

export interface ProductCarouselPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;

  // Header
  icon: React.ReactNode;
  iconContainerClass?: string;
  title: string;
  subtitle: string;
  headerLinkHref: string;
  headerLinkLabel: string;

  // Products Data
  products: Product[];
  isLoading: boolean;
  defaultOfferText: string;

  // Empty State
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  emptyActionHref?: string;
  emptyActionLabel?: string;

  // Footer
  footerCountText: (count: number) => string;
  footerLinkHref: string;
  footerLinkLabel: string;
  footerExtraAction?: React.ReactNode;
}

export default function ProductCarouselPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
  icon,
  iconContainerClass = 'size-8 rounded-full bg-[#dec33a]/20 text-[#2b323b] flex items-center justify-center',
  title,
  subtitle,
  headerLinkHref,
  headerLinkLabel,
  products,
  isLoading,
  defaultOfferText,
  emptyIcon,
  emptyMessage = 'No products currently featured.',
  emptyActionHref = '/products',
  emptyActionLabel = 'Browse full catalog →',
  footerCountText,
  footerLinkHref,
  footerLinkLabel,
  footerExtraAction,
}: ProductCarouselPopoverProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRow = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product: Product, price: number) => {
    addToCart({
      id: product.id,
      cartItemId: `${product.id}---`,
      name: product.name,
      slug: product.slug,
      price,
      quantity: 1,
      image: imageUrl(product.thumbnail),
      sellerName: product.vendor?.storefront?.storeName || 'Facep Store',
    });
    toast.success(`Added "${product.name}" to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  return (
    <NavPopoverWrapper isOpen={isOpen} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className={iconContainerClass}>{icon}</div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{title}</h3>
            <p className="text-[12px] text-gray-500 font-normal">{subtitle}</p>
          </div>
        </div>

        <Link
          href={headerLinkHref}
          onClick={onClose}
          className="font-semibold text-[13px] text-[#165dd0] hover:underline flex items-center gap-1"
        >
          <span>{headerLinkLabel}</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* 1 Row of 10 Products with Scroll Controls */}
      <div className="relative group/row">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollRow('left')}
          aria-label="Scroll left"
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        {/* 1 Row of 10 Items */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth pb-2 pt-1 px-1 scrollbar-thin [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`skel-${i}`}
                className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 rounded-lg border border-[#E5E5E6] p-2.5 flex flex-col gap-2 animate-pulse bg-white"
              >
                <div className="w-full h-45 bg-gray-200 rounded-t-lg" />
                <div className="w-3/4 h-3.5 bg-gray-200 rounded mt-1" />
                <div className="w-1/2 h-3 bg-gray-200 rounded" />
                <div className="w-1/3 h-4 bg-gray-200 rounded" />
                <div className="w-full h-8 bg-gray-200 rounded-xs mt-3" />
              </div>
            ))
          ) : !products || products.length === 0 ? (
            <div className="w-full py-8 text-center text-gray-500 text-[13px] flex flex-col items-center justify-center gap-2">
              {emptyIcon}
              <span>{emptyMessage}</span>
              <Link
                href={emptyActionHref}
                onClick={onClose}
                className="text-[12px] font-bold text-[#165dd0] hover:underline"
              >
                {emptyActionLabel}
              </Link>
            </div>
          ) : (
            products.map((product) => {
              const price = effectivePrice(product);
              const oldPriceNum = product.oldPrice ? Number(product.oldPrice) : null;
              const hasDiscount = Boolean(oldPriceNum && oldPriceNum > price);

              return (
                <div key={product.id} className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 flex flex-col">
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex h-full w-full"
                  >
                    <ProductCard
                      imageSrc={imageUrl(product.thumbnail)}
                      imageAlt={product.name}
                      title={product.name}
                      price={formatPrice(price)}
                      originalPrice={hasDiscount && oldPriceNum ? formatPrice(oldPriceNum) : undefined}
                      badgeText={
                        hasDiscount && oldPriceNum
                          ? `${Math.round(((oldPriceNum - price) / oldPriceNum) * 100)}% off`
                          : undefined
                      }
                      offerText={product.dealBadgeText || defaultOfferText}
                      shippingText={
                        product.shippingFeeType === 'FREE'
                          ? 'Free Shipping'
                          : product.shippingCost
                            ? `${formatPrice(product.shippingCost)} Shipping`
                            : 'Shipping available'
                      }
                      buttonVariant={product.hasVariants ? 'see-options' : 'add-to-cart'}
                      onAddToCart={() => handleAddToCart(product, price)}
                    />
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollRow('right')}
          aria-label="Scroll right"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
        >
          <ChevronRight size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Window Footer */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500">
        <span>{footerCountText(products?.length || 0)}</span>
        <div className="flex items-center gap-3">
          {footerExtraAction}
          <Link href={footerLinkHref} onClick={onClose} className="font-bold text-[#165dd0] hover:underline">
            {footerLinkLabel}
          </Link>
        </div>
      </div>
    </NavPopoverWrapper>
  );
}
