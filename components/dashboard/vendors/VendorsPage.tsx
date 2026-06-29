'use client';

import React, { useState } from 'react';
import VendorsTabs from './VendorsTabs';
import AllStoresTable from './AllStoresTable';
import PendingApprovalsTable from './PendingApprovalsTable';

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState<'all-stores' | 'pending-approvals'>('all-stores');

  return (
    <div className='flex w-full flex-col gap-[18px] items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] bg-[#f2f2f3] min-h-screen'>
      
      {/* Tabs */}
      <VendorsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Dynamic Content */}
      <div className='w-full'>
        {activeTab === 'all-stores' ? <AllStoresTable /> : <PendingApprovalsTable />}
      </div>

    </div>
  );
}
