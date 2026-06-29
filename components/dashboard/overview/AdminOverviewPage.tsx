'use client';

import React from 'react';
import StatCard from '@/components/dashboard/overview/StatCard';
import RevenueOverview from '@/components/dashboard/overview/RevenueOverview';
import AdminAlerts from '@/components/dashboard/overview/AdminAlerts';
import AdminTopStores from '@/components/dashboard/overview/AdminTopStores';
import AdminPendingStores from '@/components/dashboard/overview/AdminPendingStores';
import AdminPendingProducts from '@/components/dashboard/overview/AdminPendingProducts';
import { Store, Users, Coins, Wallet } from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <div className='flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white'>
      
      {/* Stat Cards Row */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 shrink-0 w-full xl:h-[153px]'>
        <StatCard
          title='Total Vendors'
          value='100'
          icon={Store}
          trend='10%'
          trendUp={true}
          period='January'
        />
        <StatCard
          title='Total Customers'
          value='10000'
          icon={Users}
          trend='10%'
          trendUp={true}
          period='January'
        />
        <StatCard
          title='Total Revenue'
          value='$ 40000'
          icon={Coins}
          trend='10%'
          trendUp={true}
          period='January'
        />
        <StatCard
          title='Total Platform Revenue'
          value='$ 20000'
          icon={Wallet}
          trend='10%'
          trendUp={true}
          period='January'
        />
      </div>

      {/* Alerts Row */}
      <AdminAlerts />

      {/* Charts & Top Stores Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <RevenueOverview />
        <AdminTopStores />
      </div>

      {/* Pending Tables Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <AdminPendingStores />
        <AdminPendingProducts />
      </div>

    </div>
  );
}
