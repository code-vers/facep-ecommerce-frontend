import React from 'react';
import ReviewStats from '@/components/dashboard/reviews/ReviewStats';
import RatingDistribution from '@/components/dashboard/reviews/RatingDistribution';
import TopRatedProducts from '@/components/dashboard/reviews/TopRatedProducts';
import RecentReviews from '@/components/dashboard/reviews/RecentReviews';

export default function DashboardReviewsPage() {
  return (
    <div className="flex w-full flex-col items-center gap-[24px] px-4 py-6 md:px-8 md:py-8 2xl:px-[45px] 2xl:py-[36px] bg-white min-h-full">
      
      {/* Top Summary Cards */}
      <ReviewStats />

      {/* Middle Section: Distribution & Top Products */}
      <div className="flex flex-col lg:flex-row w-full gap-[24px]">
        <RatingDistribution />
        <TopRatedProducts />
      </div>

      {/* Bottom Section: Recent Reviews */}
      <RecentReviews />

    </div>
  );
}
