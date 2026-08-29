'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shared/ProductCard';
import { useRemoveFromWishlist, useWishlist } from '@/hooks/api/useWishlist';
import { ChevronLeft, ChevronRight, Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  ''
);
const imageUrl = (value: string) =>
  value?.startsWith('http') ? value : `${apiOrigin}${value?.startsWith('/') ? '' : '/'}${value || ''}`;
const money = (value: number | string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));

export default function ProfileFavouritesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useWishlist({ page, limit: 10 });
  const removeWishlistMutation = useRemoveFromWishlist();

  const handleRemove = (productId: string, productName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlistItems.length === 1 && page > 1) {
      setPage((p) => Math.max(1, p - 1));
    }

    toast.info('Removed from Wishlist', {
      description: `${productName} has been removed from your wishlist.`
    });

    removeWishlistMutation.mutate(productId, {
      onError: () => {
        toast.error('Failed to remove item', {
          description: 'Unable to remove product from wishlist. Please try again.'
        });
      }
    });
  };

  const wishlistItems = data?.data || [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 w-full text-center">
        <Heart size={36} className="text-gray-300 animate-pulse mb-3" />
        <p className="text-gray-500 font-medium">Loading your wishlist items...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 w-full text-center">
        <p className="text-red-500 font-medium">Unable to load wishlist. Please log in or try again later.</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 w-full text-center bg-white border border-[#E5E5E6] rounded-[4px]">
        <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Heart size={28} className="text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Your wishlist is empty</h3>
        <p className="text-gray-500 max-w-md mb-6 text-sm">
          Explore our catalog and click the heart icon on any product to save your favorite items here!
        </p>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-[#DEC33A] hover:bg-[#c9b135] text-black font-semibold rounded-[2px] text-sm transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[36px] items-center w-full relative text-left">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between border-b border-[#E5E5E6] pb-3">
        <h2 className="text-lg font-bold text-gray-800">My Favorites / Wishlist ({meta?.total || wishlistItems.length})</h2>
      </div>

      {/* Grid container: 5 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[24px] gap-y-[36px] w-full">
        {wishlistItems.map((item) => {
          const product = item.product;
          if (!product) return null;

          const isRemoving = removeWishlistMutation.isPending && removeWishlistMutation.variables === product.id;

          return (
            <div key={item.id} className="flex flex-col gap-2 group">
              <Link href={`/products/${product.slug}`} className="flex-1">
                <ProductCard
                  imageSrc={imageUrl(product.thumbnail)}
                  imageAlt={product.name}
                  title={product.name}
                  price={money(product.basePrice)}
                  originalPrice={product.oldPrice ? money(product.oldPrice) : undefined}
                  shippingText={product.shippingFeeType === 'FREE' ? 'Free Shipping' : 'Shipping available'}
                  buttonVariant="see-options"
                  showHeart={false}
                />
              </Link>
              <button
                type="button"
                disabled={isRemoving}
                onClick={(e) => handleRemove(product.id, product.name, e)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-[12px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={13} />
                <span>Remove from Wishlist</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex gap-[4px] items-center justify-center w-full mt-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex gap-[4px] items-center justify-center min-w-[80px] px-[12px] py-[8px] rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-black" />
            <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">Previous</span>
          </button>

          {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setPage(pageNum)}
              className={`flex items-center justify-center w-[40px] h-[40px] rounded-[2px] cursor-pointer transition-colors ${
                page === pageNum
                  ? 'bg-[#cacace] border border-[#cacbce] font-semibold text-black'
                  : 'hover:bg-gray-100 text-black'
              }`}
            >
              <span className="font-['Open_Sans'] font-normal text-[14px] leading-[1.2]">{pageNum}</span>
            </button>
          ))}

          <button
            type="button"
            disabled={page >= meta.totalPage}
            onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
            className="flex gap-[4px] items-center justify-center min-w-[80px] px-[12px] py-[8px] rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            <span className="font-['Open_Sans'] font-normal text-[14px] text-black leading-[1.2]">Next</span>
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>
      )}
    </div>
  );
}
