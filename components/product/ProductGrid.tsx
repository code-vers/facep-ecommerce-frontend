'use client';

import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/lib/api/product';
import type { UseQueryResult } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);
const imageUrl = (value: string) =>
  value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;

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

interface ProductGridProps {
  query: UseQueryResult<{
    data: Product[];
    meta?: { page: number; limit: number; total: number; totalPage: number };
  }>;
}

export default function ProductGrid({ query }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const products = query.data?.data ?? [];
  const meta = query.data?.meta;

  const changePage = (page: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (page <= 1) next.delete('page');
    else next.set('page', String(page));
    router.push(`/products?${next}`);
  };

  return (
    <div className='flex-1 space-y-6'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-[21px] font-bold leading-none text-black'>Results</h2>
        <p className='text-[14px] leading-[1.3] text-[#42454D]'>
          Check each product page for other buying options. Price and other details may vary based on product size and color
        </p>
      </div>

      {query.isLoading ? (
        <div className='flex min-h-[360px] items-center justify-center text-[#848995]'>
          <Loader2 className='mr-2 animate-spin' size={22} /> Loading products...
        </div>
      ) : query.isError ? (
        <div className='flex min-h-[360px] flex-col items-center justify-center gap-3 text-[#CB1B1B]'>
          <p>Failed to load products.</p>
          <button className='text-[#165DD0] underline' onClick={() => query.refetch()}>
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className='flex min-h-[360px] items-center justify-center text-[#848995]'>
          No products match the selected filters.
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7'>
          {products.map((product) => {
            const price = effectivePrice(product);
            const hasDiscount = price < Number(product.basePrice);
            return (
              <Link key={product.id} href={`/products/${product.slug}`} className='flex h-full'>
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
        <div className='flex items-center justify-center pt-10'>
          <button
            disabled={meta.page <= 1}
            onClick={() => changePage(meta.page - 1)}
            className='mr-1 flex h-[33px] w-[109px] items-center justify-center gap-1 rounded-[2px] border border-[#E5E5E6] bg-white text-[14px] transition-colors hover:bg-gray-50 disabled:opacity-40'
            aria-label='Previous page'
          >
            <ChevronLeft size={16} className='text-[#42454D]' /> Previous
          </button>
          {Array.from({ length: Math.min(4, meta.totalPage) }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type='button'
              onClick={() => changePage(page)}
              className={`h-10 w-11 text-[14px] ${page === meta.page ? 'bg-[#F2F2F3] font-semibold' : 'bg-white'}`}
              aria-current={page === meta.page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          {meta.totalPage > 4 && <span className='flex h-10 w-11 items-center justify-center'>…</span>}
          <button
            disabled={meta.page >= meta.totalPage}
            onClick={() => changePage(meta.page + 1)}
            className='ml-1 flex h-[33px] w-[83px] items-center justify-center gap-1 rounded-[2px] border border-[#E5E5E6] bg-white text-[14px] transition-colors hover:bg-gray-50 disabled:opacity-40'
            aria-label='Next page'
          >
            Next <ChevronRight size={16} className='text-[#42454D]' />
          </button>
        </div>
      )}
    </div>
  );
}
