'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import ReviewStats from '@/components/dashboard/reviews/ReviewStats';
import TopRatedProducts from '@/components/dashboard/reviews/TopRatedProducts';
import CategoryWiseReviews from '@/components/dashboard/reviews/CategoryWiseReviews';
import { useVendorReviews } from '@/hooks/api/useReview';

export default function DashboardReviewsPage() {
  const { data, isLoading, error, refetch, isFetching } = useVendorReviews();

  return (
    <div className="flex w-full flex-col items-start gap-[24px] px-4 py-6 md:px-8 md:py-8 2xl:px-[45px] 2xl:py-[36px] bg-white min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Customer Reviews</h1>
          <p className="text-sm text-[#848995]">
            Analyze category-wise feedback, track top-rated products, and reply to customer reviews.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#42454d] border border-[#e5e5e6] rounded-[2px] hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin text-[#f09000]' : ''}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="w-full p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          Failed to load review data. Please try refreshing.
        </div>
      ) : null}

      {/* Top Summary Cards */}
      <ReviewStats stats={data?.stats} />

      {/* Top Rated Products Section */}
      <TopRatedProducts products={data?.topRatedProducts} />

      {/* Category Wise Reviews Section */}
      <CategoryWiseReviews categoryReviews={data?.categoryReviews} />

    </div>
  );
}
