"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function PayoutHistoryTable() {
  const { session } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["vendor-payouts", currentPage, session?.user?.role],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/payouts/vendor-payouts?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${session?.token}` },
      });
      const json = await res.json();
      return json;
    },
    enabled: !!session?.token,
  });

  const payouts = apiData?.data || [];
  const totalPages = apiData?.meta?.totalPages || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED": return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">COMPLETED</span>;
      case "REJECTED": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">REJECTED</span>;
      case "PROCESSING": return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">PROCESSING</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">PENDING</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Withdrawal History</h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Method</th>
              <th className="p-4 font-semibold">Details</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Admin Notes</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No withdrawal requests found.</td>
              </tr>
            ) : (
              payouts.map((payout: any) => (
                <tr key={payout.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap">{new Date(payout.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-gray-900">${Number(payout.amount).toFixed(2)}</td>
                  <td className="p-4">{payout.paymentMethod}</td>
                  <td className="p-4 max-w-xs truncate" title={payout.accountDetails}>{payout.accountDetails}</td>
                  <td className="p-4">{getStatusBadge(payout.status)}</td>
                  <td className="p-4 text-xs text-gray-500">{payout.adminNotes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
