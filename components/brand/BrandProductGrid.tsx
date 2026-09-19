'use client';

import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/lib/api/product';
import type { UseQueryResult } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);
const imageUrl = (value?: string | null) => {
  if (!value) return '/images/placeholder.png';
  return value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;
};

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

interface BrandProductGridProps {
  query: UseQueryResult<{
    data: Product[];
    meta?: { page: number; limit: number; total: number; totalPage: number };
  }>;
  onClearFilters: () => void;
  storeName?: string;
  demoProducts?: Product[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function BrandProductGrid({
  query,
  onClearFilters,
  storeName,
  demoProducts = [],
  currentPage = 1,
  onPageChange,
}: BrandProductGridProps) {
  const apiProducts = query.data?.data;
  const products =
    apiProducts && apiProducts.length > 0
      ? apiProducts
      : demoProducts.length > 0 && (!apiProducts || apiProducts.length === 0)
      ? demoProducts
      : (apiProducts ?? []);
  const meta = query.data?.meta;

  const handlePage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[21px] font-bold leading-none text-black">
          Explore {storeName ? `${storeName}'s ` : ''}Products
        </h2>
        <p className="text-[14px] leading-[1.3] text-[#42454D]">
          Check each product page for other buying options. Price and other details may vary based on product size and color
        </p>
      </div>

      {query.isLoading ? (
        <div className="flex min-h-[360px] items-center justify-center text-[#848995]">
          <Loader2 className="mr-2 animate-spin" size={22} /> Loading products...
        </div>
      ) : query.isError ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-[#CB1B1B]">
          <p>Failed to load products for this store.</p>
          <button
            type="button"
            className="cursor-pointer text-[#165DD0] underline"
            onClick={() => query.refetch()}
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-[#848995] rounded border border-gray-100 p-8 bg-white">
          <p className="text-[16px] font-medium text-gray-700">No products match the selected filters.</p>
          <button
            type="button"
            onClick={onClearFilters}
            className="cursor-pointer rounded bg-[#DEC33A] px-4 py-2 text-[13px] font-bold text-black transition-colors hover:bg-[#d0b530]"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4">
          {products.map((product) => {
            const price = effectivePrice(product);
            const hasDiscount = price < Number(product.basePrice);
            return (
              <Link key={product.id} href={`/products/${product.slug}`} className="flex h-full">
                <ProductCard
                  imageSrc={imageUrl(product.thumbnail)}
                  imageAlt={product.name}
                  title={product.name}
                  price={formatPrice(price)}
                  originalPrice={hasDiscount ? formatPrice(product.basePrice) : undefined}
                  badgeText={hasDiscount ? `${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : ''} off` : undefined}
                  offerText={product.dealBadgeText || undefined}
                  shippingText={
                    product.shippingFeeType === 'FREE'
                      ? 'Free Shipping'
                      : product.shippingCost
                        ? `${formatPrice(product.shippingCost)} Shipping`
                        : 'Shipping available'
                  }
                  buttonVariant={product.hasVariants ? 'see-options' : 'add-to-cart'}
                />
              </Link>
            );
          })}
        </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-center pt-10">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePage(currentPage - 1)}
            className="mr-1 flex h-[33px] w-[109px] items-center justify-center gap-1 rounded-[2px] border border-[#E5E5E6] bg-white text-[14px] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} className="text-[#42454D]" /> Previous
          </button>
          {Array.from({ length: Math.min(4, meta.totalPage) }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handlePage(page)}
              className={`h-10 w-11 text-[14px] cursor-pointer ${
                page === currentPage ? 'bg-[#F2F2F3] font-semibold' : 'bg-white hover:bg-gray-50'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          {meta.totalPage > 4 && <span className="flex h-10 w-11 items-center justify-center">…</span>}
          <button
            disabled={currentPage >= meta.totalPage}
            onClick={() => handlePage(currentPage + 1)}
            className="ml-1 flex h-[33px] w-[83px] items-center justify-center gap-1 rounded-[2px] border border-[#E5E5E6] bg-white text-[14px] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            aria-label="Next page"
          >
            Next <ChevronRight size={16} className="text-[#42454D]" />
          </button>
        </div>
      )}
    </div>
  );
}
