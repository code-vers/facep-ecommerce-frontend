/**
 * @fileoverview BrandProductGrid sub-component for Brand Store Front.
 * Renders the products grid layout, search empty states, and catalog pagination.
 *
 * @module components/brand/BrandProductGrid
 */

import ProductCard from '@/components/shared/ProductCard';
import { BrandProduct } from '@/lib/brand-data';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

interface BrandProductGridProps {
  products: BrandProduct[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  onClearFilters: () => void;
}

export default function BrandProductGrid({
  products,
  totalResults,
  currentPage,
  totalPages,
  setCurrentPage,
  onClearFilters,
}: BrandProductGridProps) {
  return (
    <div className='flex-1 flex flex-col gap-6'>
      {/* Grid Header */}
      <div className='border-b border-[#E5E5E6] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2'>
        <div>
          <h3 className='text-[20px] font-bold text-black'>Explore Plant House&apos;s Products</h3>
          <p className='text-[12px] text-gray-500 mt-1'>
            Price and other details may vary based on product size and colour
          </p>
        </div>
        <span className='text-[14px] text-gray-500 shrink-0 font-medium'>
          {totalResults} results found
        </span>
      </div>

      {/* Grid Content */}
      {products.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <div key={product.id} className='w-full'>
              <ProductCard
                imageSrc={product.imageSrc}
                imageAlt={product.title}
                title={product.title}
                rating={product.rating}
                reviewCount={product.reviewCount.toString()}
                price={`$${product.price}`}
                originalPrice={product.originalPrice ? `$${product.originalPrice}` : undefined}
                badgeText={product.badgeText}
                badgeLabel={product.badgeLabel}
                shippingText={product.shippingText}
                buttonVariant={product.isTodayDeal ? 'add-to-cart' : 'see-options'}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 bg-white border border-[#E5E5E6] rounded-lg shadow-2xs'>
          <ShoppingBag size={48} className='text-gray-300 mb-4' />
          <p className='text-[16px] font-semibold text-gray-600'>No products match your filters.</p>
          <button
            type='button'
            onClick={onClearFilters}
            className='mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xs text-[14px] font-bold hover:bg-emerald-950 transition-colors cursor-pointer'
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2 mt-8 border-t border-[#E5E5E6] pt-6'>
          <button
            type='button'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className='flex items-center gap-1 px-3 py-1.5 rounded-xs border border-[#E5E5E6] bg-white hover:bg-gray-50 text-[14px] text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className='flex items-center gap-1'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type='button'
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'size-10 flex items-center justify-center rounded-xs border text-[14px] cursor-pointer transition-all',
                  currentPage === page
                    ? 'bg-emerald-800 border-emerald-800 text-white font-bold'
                    : 'bg-white hover:bg-gray-50',
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type='button'
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className='flex items-center gap-1 px-3 py-1.5 rounded-xs border border-[#E5E5E6] bg-white hover:bg-gray-50 text-[14px] text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
