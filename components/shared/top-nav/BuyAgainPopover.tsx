'use client';

import React, { useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import NavPopoverWrapper from './NavPopoverWrapper';
import { imageUrl, formatPrice } from './topNavUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useMyOrders } from '@/hooks/api/useOrder';
import { useCartStore } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface BuyAgainPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function BuyAgainPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: BuyAgainPopoverProps) {
  const router = useRouter();
  const { session } = useAuth();
  const addToCart = useCartStore((state) => state.addToCart);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: ordersData, isLoading: isOrdersLoading } = useMyOrders({ limit: 20 });

  const buyAgainItems = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        productId: string;
        name: string;
        slug: string;
        price: number;
        image: string;
        vendorName: string;
        timesPurchased: number;
      }
    >();

    (ordersData?.orders || []).forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.productId || item.slug || item.id;
        if (map.has(key)) {
          const ex = map.get(key)!;
          ex.timesPurchased += 1;
        } else if (map.size < 10) {
          map.set(key, {
            id: key,
            productId: item.productId,
            name: item.productName,
            slug: item.slug,
            price: Number(item.price),
            image: item.image || '',
            vendorName: item.vendorName || 'Facep Store',
            timesPurchased: 1,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [ordersData]);

  const scrollRow = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleBuyAgainAddToCart = (item: {
    productId: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    vendorName: string;
  }) => {
    addToCart({
      id: item.productId,
      cartItemId: `${item.productId}---`,
      name: item.name,
      slug: item.slug,
      price: item.price,
      quantity: 1,
      image: imageUrl(item.image),
      sellerName: item.vendorName || 'Facep Store',
    });
    toast.success(`Added "${item.name}" to cart!`, {
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
          <div className="size-8 rounded-full bg-[#dec33a]/20 text-[#2b323b] flex items-center justify-center">
            <RotateCcw size={16} className="text-[#9e8316]" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-tight">Buy Again</h3>
            <p className="text-[12px] text-gray-500 font-normal">
              Reorder your favorite items with 1 click
            </p>
          </div>
        </div>

        <Link
          href="/buy-again"
          onClick={onClose}
          className="font-semibold text-[13px] text-[#165dd0] hover:underline flex items-center gap-1"
        >
          <span>View all past purchases</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {!session?.user?.id ? (
        /* Guest State */
        <div className="w-full py-9 flex flex-col items-center justify-center text-center gap-2">
          <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
            <RotateCcw size={24} />
          </div>
          <h4 className="text-[15px] font-bold text-gray-900">Sign in to buy again</h4>
          <p className="text-[12px] text-gray-500 max-w-sm">
            Quickly reorder everyday staples and past purchases with 1 click.
          </p>
          <Link
            href="/login"
            onClick={onClose}
            className="mt-2 px-5 py-2 bg-[#dec33a] hover:bg-[#c9b034] text-black font-bold text-[13px] rounded-xs shadow-xs transition-colors"
          >
            Sign In to Facep
          </Link>
        </div>
      ) : (
        /* 1 Row of 10 Products with Scroll Controls */
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
            {isOrdersLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`skel-buyagain-${i}`}
                  className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 rounded-lg border border-[#E5E5E6] p-2.5 flex flex-col gap-2 animate-pulse bg-white"
                >
                  <div className="w-full h-45 bg-gray-200 rounded-t-lg" />
                  <div className="w-3/4 h-3.5 bg-gray-200 rounded mt-1" />
                  <div className="w-1/2 h-3 bg-gray-200 rounded" />
                  <div className="w-1/3 h-4 bg-gray-200 rounded" />
                  <div className="w-full h-8 bg-gray-200 rounded-xs mt-3" />
                </div>
              ))
            ) : !buyAgainItems || buyAgainItems.length === 0 ? (
              <div className="w-full py-8 text-center text-gray-500 text-[13px] flex flex-col items-center justify-center gap-2">
                <RotateCcw size={26} className="text-gray-300" />
                <span>No previous purchases to reorder yet.</span>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="text-[12px] font-bold text-[#165dd0] hover:underline"
                >
                  Browse all products →
                </Link>
              </div>
            ) : (
              buyAgainItems.map((item) => (
                <div key={item.id} className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 flex flex-col">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={onClose}
                    className="flex h-full w-full"
                  >
                    <ProductCard
                      imageSrc={imageUrl(item.image)}
                      imageAlt={item.name}
                      title={item.name}
                      price={formatPrice(item.price)}
                      badgeText={item.timesPurchased > 1 ? `Ordered ${item.timesPurchased}x` : 'Purchased'}
                      offerText="Buy Again"
                      buttonVariant="add-to-cart"
                      onAddToCart={() => handleBuyAgainAddToCart(item)}
                    />
                  </Link>
                </div>
              ))
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
      )}

      {/* Window Footer */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500">
        <span>
          {buyAgainItems.length > 0
            ? `Showing ${buyAgainItems.length} item${buyAgainItems.length === 1 ? '' : 's'} available to reorder`
            : 'Fast 1-click reordering'}
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/buy-again"
            onClick={onClose}
            className="font-bold text-[#165dd0] hover:underline"
          >
            Visit Buy Again page →
          </Link>
        </div>
      </div>
    </NavPopoverWrapper>
  );
}
