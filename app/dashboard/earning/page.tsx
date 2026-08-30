"use client";

import EarningsStats from "@/components/dashboard/earnings/EarningsStats";
import PayoutHistoryTable from "@/components/dashboard/earnings/PayoutHistoryTable";

export default function EarningsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your wallet balance and request withdrawals.</p>
      </div>

      <EarningsStats />

      <div className="mt-8">
        <PayoutHistoryTable />
      </div>
    </div>
  );
}
