'use client';

import React from 'react';
import StatCard from '@/components/dashboard/overview/StatCard';
import RevenueOverview from '@/components/dashboard/overview/RevenueOverview';
import AdminAlerts from '@/components/dashboard/overview/AdminAlerts';
import AdminTopStores from '@/components/dashboard/overview/AdminTopStores';
import AdminPendingStores from '@/components/dashboard/overview/AdminPendingStores';
import AdminPendingProducts from '@/components/dashboard/overview/AdminPendingProducts';
import { Store, Users, Coins, Wallet, RefreshCw } from 'lucide-react';
import { useAdminOverview } from '@/hooks/api/useDashboard';

export default function AdminOverviewPage() {
  const { data, isLoading, error, refetch, isFetching } = useAdminOverview();

  const metrics = data?.metrics;
  const currentPeriod = metrics?.currentPeriod || 'Current Month';

  return (
    <div className='flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white'>
      
      {/* Header with refresh status */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-[#848995]">Welcome back to your administration dashboard.</p>
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
          Failed to load dashboard metrics. Please try refreshing.
        </div>
      ) : null}

      {/* Stat Cards Row */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 shrink-0 w-full xl:h-[153px]'>
        <StatCard
          title='Total Vendors'
          value={isLoading ? '...' : (metrics?.totalVendors ?? 0).toLocaleString()}
          icon={Store}
          trend={metrics?.vendorGrowth ?? '12%'}
          trendUp={true}
          period={currentPeriod}
        />
        <StatCard
          title='Total Customers'
          value={isLoading ? '...' : (metrics?.totalCustomers ?? 0).toLocaleString()}
          icon={Users}
          trend={metrics?.customerGrowth ?? '8%'}
          trendUp={true}
          period={currentPeriod}
        />
        <StatCard
          title='Total Revenue'
          value={isLoading ? '...' : `$ ${(metrics?.totalRevenue ?? 0).toLocaleString()}`}
          icon={Coins}
          trend={metrics?.revenueGrowth ?? '15%'}
          trendUp={true}
          period={currentPeriod}
        />
        <StatCard
          title='Total Platform Revenue'
          value={isLoading ? '...' : `$ ${(metrics?.platformRevenue ?? 0).toLocaleString()}`}
          icon={Wallet}
          trend={metrics?.platformGrowth ?? '15%'}
          trendUp={true}
          period={currentPeriod}
        />
      </div>

      {/* Alerts Row */}
      <AdminAlerts alerts={data?.alerts} />

      {/* Charts & Top Stores Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <RevenueOverview data={data?.revenueOverview} />
        <AdminTopStores stores={data?.topStores} />
      </div>

      {/* Pending Tables Row */}
      <div className='flex gap-6 items-start shrink-0 w-full flex-col xl:flex-row'>
        <AdminPendingStores stores={data?.pendingStores} />
        <AdminPendingProducts products={data?.pendingProducts} />
      </div>

    </div>
  );
}
