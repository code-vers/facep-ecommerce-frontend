'use client';

import React, { useState } from 'react';
import VendorsTabs from './VendorsTabs';
import AllStoresTable from './AllStoresTable';
import PendingApprovalsTable from './PendingApprovalsTable';
import { useVendors } from '@/hooks/api/useVendor';

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState<'all-stores' | 'pending-approvals'>('all-stores');
  const { data: summaryData } = useVendors({ limit: 1 });

  const allCount = summaryData?.meta?.counts?.all ?? 0;
  const pendingCount = summaryData?.meta?.counts?.pending ?? 0;

  return (
    <div className='flex flex-col gap-[18px] items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white'>
      {/* Tabs */}
      <VendorsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={allCount}
        pendingCount={pendingCount}
      />

      {/* Dynamic Content */}
      <div className='w-full'>
        {activeTab === 'all-stores' ? <AllStoresTable /> : <PendingApprovalsTable />}
      </div>
    </div>
  );
}
