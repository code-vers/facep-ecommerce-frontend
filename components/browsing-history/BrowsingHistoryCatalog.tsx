'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  History,
  Trash2,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/shared/ProductCard';
import { useBrowsingHistory } from '@/lib/view-history';
import { useCartStore } from '@/contexts/CartContext';
import type { Product } from '@/lib/api/product';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);
const imageUrl = (value?: string | null) =>
  !value
    ? '/placeholder.png'
    : value.startsWith('http')
      ? value
      : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;

const formatPrice = (value: number | string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

const effectivePrice = (product: Product) => {
  const base = Number(product.basePrice);
  const value = Number(product.discountValue ?? 0);
  if (!product.discountType || !value) return base;
  const now = Date.now();
  if (product.dealStartDate && now < new Date(product.dealStartDate).getTime()) return base;
  if (product.dealEndDate && now > new Date(product.dealEndDate).getTime()) return base;
  return product.discountType === 'PERCENTAGE'
    ? Math.max(0, base - (base * value) / 100)
    : Math.max(0, base - value);
};

export default function BrowsingHistoryCatalog() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { products, isLoading, clearHistory, removeItem } = useBrowsingHistory(30);
  const [searchTerm] = useState('');

  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      if (!searchTerm.trim()) return true;
      return p.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
    });
  }, [products, searchTerm]);

  const handleRemoveItem = (idOrSlug: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(idOrSlug);
    toast.success(`Removed "${title}" from browsing history`);
  };

  const handleClearAll = () => {
    clearHistory();
    toast.success('Your browsing history has been cleared');
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
    <div className="w-full min-h-screen bg-white text-[#0f1111]">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 flex flex-col gap-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#0a0a0a] font-sans text-[26px] sm:text-[30px] md:text-[32px] font-bold tracking-tight flex items-center gap-2.5">
              <History className="text-[#dec33a] shrink-0" size={30} />
              <span>Your Browsing History</span>
            </h1>
            <p className="text-[14px] text-[#42454D]">
              Items you have viewed on Facep. Revisit recent discoveries or manage your history.
            </p>
          </div>

          {displayedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 text-[13px] font-semibold text-gray-700 hover:text-red-600 border border-gray-300 hover:border-red-200 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Clear all history</span>
              </button>
            </div>
          )}
        </div>

        {/* Toolbar count */}
        {displayedProducts.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-[#42454D]">
              Showing <strong>{displayedProducts.length}</strong> recently viewed items
            </span>
          </div>
        )}

        {/* Products Grid — identical styling and layout to /products */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={`skel-bh-${i}`}
                className="bg-white border border-[#e5e5e6] rounded-lg p-2.5 flex flex-col gap-2 animate-pulse"
              >
                <div className="w-full h-45 bg-gray-200 rounded-t-lg" />
                <div className="h-3.5 bg-gray-200 rounded w-3/4 mt-1" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-8 bg-gray-200 rounded-xs mt-auto" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          /* Empty State */
          <div className="w-full py-16 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center px-4 gap-3">
            <div className="size-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-1">
              <Package size={28} />
            </div>
            <span className="text-gray-900 text-[18px] font-semibold">
              Your browsing history is empty
            </span>
            <p className="text-gray-500 text-[14px] max-w-md">
              As you browse products on Facep, items you view will automatically appear here.
            </p>
            <Link
              href="/products"
              className="mt-2 px-6 py-2.5 bg-[#dec33a] hover:bg-[#c9b034] text-black font-semibold rounded-xs transition-colors shadow-2xs"
            >
              Start Exploring Products
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7">
            {displayedProducts.map((product) => {
              const price = effectivePrice(product);
              const hasDiscount = price < Number(product.basePrice);

              return (
                <div key={product.id} className="relative group/history-card flex h-full w-full">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex h-full w-full"
                  >
                    <ProductCard
                      imageSrc={imageUrl(product.thumbnail)}
                      imageAlt={product.name}
                      title={product.name}
                      price={formatPrice(price)}
                      originalPrice={hasDiscount ? formatPrice(product.basePrice) : undefined}
                      badgeText={
                        hasDiscount
                          ? `${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : ''} off`
                          : undefined
                      }
                      offerText={product.dealBadgeText || undefined}
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

                  {/* Remove from history button on hover */}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveItem(product.id, product.name, e)}
                    title="Remove from browsing history"
                    aria-label="Remove from browsing history"
                    className="absolute top-2 right-2 z-10 size-7 rounded-full bg-white/95 hover:bg-white text-gray-500 hover:text-red-600 flex items-center justify-center shadow-md opacity-0 group-hover/history-card:opacity-100 transition-opacity cursor-pointer border border-gray-200"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
