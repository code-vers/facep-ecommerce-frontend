'use client';

import LowStockAlert from '@/components/dashboard/overview/LowStockAlert';
import OrdersTrend from '@/components/dashboard/overview/OrdersTrend';
import QuickActions from '@/components/dashboard/overview/QuickActions';
import RecentOrders from '@/components/dashboard/overview/RecentOrders';
import RevenueOverview from '@/components/dashboard/overview/RevenueOverview';
import StatCard from '@/components/dashboard/overview/StatCard';
import TopSellingProducts from '@/components/dashboard/overview/TopSellingProducts';
import { Boxes, Coins, ShoppingBag, Star } from 'lucide-react';

export default function VendorOverviewPage() {
  return (
    <div className='flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white'>
      {/* Stat Cards Row */}
      <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6 shrink-0 w-full 2xl:h-[153px]'>
        <StatCard
          title='Total Sales'
          value='$ 5000'
          icon={Coins}
          trend='10%'
          trendUp={true}
          period='January'
          isPrimary={true}
        />
        <StatCard
          title='Total Orders'
          value='1000'
          icon={ShoppingBag}
          trend='10%'
          trendUp={true}
          period='January'
        />
        <StatCard
          title='Total Products'
          value='100'
          icon={Boxes}
          trend='10%'
          trendUp={true}
          period='January'
        />
        <StatCard
          title='Store Rating'
          value='4.5'
          icon={Star}
          trend='10%'
          trendUp={true}
          period='January'
        />
      </div>

      {/* Charts Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <RevenueOverview />
        <OrdersTrend />
      </div>

      {/* Tables Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <RecentOrders />
        <TopSellingProducts />
      </div>

      {/* Alerts & Actions Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <LowStockAlert />
        <QuickActions />
      </div>
    </div>
  );
}
