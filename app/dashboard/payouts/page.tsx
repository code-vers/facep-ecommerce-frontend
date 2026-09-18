"use client";

import AdminPayoutsTable from "@/components/dashboard/payouts/AdminPayoutsTable";

export default function PayoutsPage() {
  return (
    <div className='flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white'>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900">Payout Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Review and fulfill vendor withdrawal requests.</p>
      </div>

      <div className="w-full">
        <AdminPayoutsTable />
      </div>
    </div>
  );
}
