'use client';

import StoreManagementStats from './StoreManagementStats';
import StoreManagementTable from './StoreManagementTable';

export default function StoreManagementPage() {
  return (
    <div className='flex w-full flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] bg-white min-h-screen'>
      {/* Stat Cards */}
      <StoreManagementStats />

      {/* Main Table */}
      <div className='w-full'>
        <StoreManagementTable />
      </div>
    </div>
  );
}
