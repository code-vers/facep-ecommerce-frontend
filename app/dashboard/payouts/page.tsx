"use client";

import AdminPayoutsTable from "@/components/dashboard/payouts/AdminPayoutsTable";

export default function PayoutsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payout Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Review and fulfill vendor withdrawal requests.</p>
      </div>

      <AdminPayoutsTable />
    </div>
  );
}
