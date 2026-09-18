'use client';

import React from 'react';
import LowStockAlert from '@/components/dashboard/overview/LowStockAlert';
import OrdersTrend from '@/components/dashboard/overview/OrdersTrend';
import QuickActions from '@/components/dashboard/overview/QuickActions';
import RecentOrders from '@/components/dashboard/overview/RecentOrders';
import RevenueOverview from '@/components/dashboard/overview/RevenueOverview';
import StatCard from '@/components/dashboard/overview/StatCard';
import TopSellingProducts from '@/components/dashboard/overview/TopSellingProducts';
import { Boxes, Coins, ShoppingBag, Star, RefreshCw } from 'lucide-react';
import { useVendorOverview } from '@/hooks/api/useDashboard';

export default function VendorOverviewPage() {
  const { data, isLoading, error, refetch, isFetching } = useVendorOverview();

  const metrics = data?.metrics;
  const currentPeriod = metrics?.currentPeriod || 'Current Month';

  return (
    <div className='flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white'>
      
      {/* Header with refresh status */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Store Overview</h1>
          <p className="text-sm text-[#848995]">Monitor your store performance, orders, and sales in real time.</p>
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
          Failed to load store metrics. Please try refreshing.
        </div>
      ) : null}

      {/* Stat Cards Row */}
      <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6 shrink-0 w-full 2xl:h-[153px]'>
        <StatCard
          title='Total Sales'
          value={isLoading ? '...' : `$ ${(metrics?.totalSales ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Coins}
          trend={metrics?.salesGrowth ?? '10%'}
          trendUp={true}
          period={currentPeriod}
          isPrimary={true}
        />
        <StatCard
          title='Total Orders'
          value={isLoading ? '...' : (metrics?.totalOrders ?? 0).toLocaleString()}
          icon={ShoppingBag}
          trend={metrics?.ordersGrowth ?? '10%'}
          trendUp={true}
          period={currentPeriod}
        />
        <StatCard
          title='Total Products'
          value={isLoading ? '...' : (metrics?.totalProducts ?? 0).toLocaleString()}
          icon={Boxes}
          trend={metrics?.productsGrowth ?? '10%'}
          trendUp={true}
          period={currentPeriod}
        />
        <StatCard
          title='Store Rating'
          value={isLoading ? '...' : (metrics?.storeRating ?? '4.8')}
          icon={Star}
          trend={metrics?.ratingGrowth ?? '10%'}
          trendUp={true}
          period={currentPeriod}
        />
      </div>

      {/* Charts Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <RevenueOverview data={data?.revenueOverview} />
        <OrdersTrend data={data?.ordersTrend} />
      </div>

      {/* Tables Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <RecentOrders orders={data?.recentOrders} />
        <TopSellingProducts products={data?.topSellingProducts} />
      </div>

      {/* Alerts & Actions Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <LowStockAlert count={data?.lowStockAlert?.lowStockCount} />
        <QuickActions />
      </div>
    </div>
  );
}
