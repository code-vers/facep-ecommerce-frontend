'use client';

import BrowsingHistory from '@/components/product/BrowsingHistory';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductGrid from '@/components/product/ProductGrid';
import SignUpBanner from '@/components/shared/SignUpBanner';
import { useProducts } from '@/hooks/api/useProduct';
import type { ProductQueryParams } from '@/lib/api/product';
import { ListFilter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const numberParam = (value: string | null) => {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

export default function PublicProductsCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params: ProductQueryParams = {
    page: numberParam(searchParams.get('page')) ?? 1,
    limit: 49,
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    condition: searchParams.get('condition') || undefined,
    color: searchParams.get('color') || undefined,
    minPrice: numberParam(searchParams.get('minPrice')),
    maxPrice: numberParam(searchParams.get('maxPrice')),
    hasDiscount: searchParams.get('hasDiscount') === 'true',
    inStock: searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') || 'newest',
  };
  const query = useProducts(params);
  const meta = query.data?.meta;
  const start = meta?.total ? (meta.page - 1) * meta.limit + 1 : 0;
  const end = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <section className='flex-1 pb-20'>
        <div className='mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10'>
          <div className='flex h-auto w-full flex-col items-start justify-between gap-4 border-b border-[#E5E5E6] bg-white py-4 sm:h-[57px] sm:flex-row sm:items-center sm:gap-0 sm:py-0'>
            <h1 className='text-[16px] text-black'>
              Showing {start}-{end} of {meta?.total ?? 0} results
              {params.search ? (
                <> for <span className='font-bold'>&ldquo;{params.search}&rdquo;</span></>
              ) : null}
            </h1>
            <label className='flex h-[33px] shrink-0 items-center gap-2 rounded-[2px] border border-[#E5E5E6] bg-white px-3 transition-colors hover:bg-gray-50'>
              <span className='text-[14px] font-bold text-black'>Sort By</span>
              <select
                value={params.sort}
                onChange={(event) => {
                  const next = new URLSearchParams(searchParams.toString());
                  next.set('sort', event.target.value);
                  next.delete('page');
                  router.push(`/products?${next}`);
                }}
                className='max-w-5 appearance-none bg-transparent text-transparent outline-none'
                aria-label='Sort products'
              >
                <option value='newest'>Newest</option>
                <option value='price-asc'>Price: Low to High</option>
                <option value='price-desc'>Price: High to Low</option>
                <option value='name-asc'>Name: A to Z</option>
                <option value='name-desc'>Name: Z to A</option>
                <option value='discount-desc'>Biggest Discount</option>
              </select>
              <ListFilter size={16} className='text-black' />
            </label>
          </div>
          <div className='mt-[36px] flex flex-col gap-6 lg:flex-row'>
            <FilterSidebar />
            <div className='min-w-0 flex-1'>
              <ProductGrid query={query} />
            </div>
          </div>
        </div>
      </section>
      <BrowsingHistory />
      <SignUpBanner />
    </div>
  );
}
