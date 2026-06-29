'use client';

import React, { useState } from 'react';
import ProductsTabs from './ProductsTabs';
import AllProductsTable from './AllProductsTable';
import PendingProductApprovalsTable from './PendingProductApprovalsTable';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<'all-products' | 'pending-approvals'>('all-products');

  return (
    <div className='flex w-full flex-col gap-[18px] items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] bg-[#f2f2f3] min-h-screen'>
      
      {/* Tabs */}
      <ProductsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Dynamic Content */}
      <div className='w-full'>
        {activeTab === 'all-products' ? <AllProductsTable /> : <PendingProductApprovalsTable />}
      </div>

    </div>
  );
}
