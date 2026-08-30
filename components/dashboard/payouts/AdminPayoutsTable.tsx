"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle, XCircle, Clock, X } from "lucide-react";

export default function AdminPayoutsTable() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionStatus, setActionStatus] = useState<"COMPLETED" | "REJECTED" | "PROCESSING">("PROCESSING");

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["admin-payouts", currentPage, session?.user?.role],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/payouts/all-payouts?page=${currentPage}&limit=15`, {
        headers: { Authorization: `Bearer ${session?.token}` },
      });
      const json = await res.json();
      return json;
    },
    enabled: !!session?.token && session?.user?.role === "ADMIN",
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (payload: { id: string; status: string; adminNotes: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/payouts/${payload.id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}` 
        },
        body: JSON.stringify({ status: payload.status, adminNotes: payload.adminNotes }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      setSelectedPayout(null);
      setAdminNotes("");
    },
  });

  const payouts = apiData?.data || [];
  const totalPages = apiData?.meta?.totalPages || 1;

  const openActionModal = (payout: any, status: "COMPLETED" | "REJECTED" | "PROCESSING") => {
    setSelectedPayout(payout);
    setActionStatus(status);
    setAdminNotes(payout.adminNotes || "");
  };

  const submitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;
    updateStatusMutation.mutate({
      id: selectedPayout.id,
      status: actionStatus,
      adminNotes
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED": return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">COMPLETED</span>;
      case "REJECTED": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">REJECTED</span>;
      case "PROCESSING": return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">PROCESSING</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">PENDING</span>;
    }
  };

  if (session?.user?.role !== "ADMIN") return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="w-full overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Vendor</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Method & Details</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No payout requests found.</td>
              </tr>
            ) : (
              payouts.map((payout: any) => (
                <tr key={payout.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap">{new Date(payout.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{payout.vendor?.name}</p>
                    <p className="text-xs text-gray-500">{payout.vendor?.email}</p>
                  </td>
                  <td className="p-4 font-bold text-gray-900">${Number(payout.amount).toFixed(2)}</td>
                  <td className="p-4 max-w-xs">
                    <p className="font-semibold text-[13px]">{payout.paymentMethod}</p>
                    <p className="text-xs text-gray-500 truncate" title={payout.accountDetails}>{payout.accountDetails}</p>
                  </td>
                  <td className="p-4">{getStatusBadge(payout.status)}</td>
                  <td className="p-4">
                    {payout.status === "PENDING" || payout.status === "PROCESSING" ? (
                      <div className="flex items-center justify-center gap-2">
                         <button 
                           onClick={() => openActionModal(payout, "COMPLETED")}
                           className="text-green-600 hover:text-green-800 p-1 bg-green-50 rounded"
                           title="Mark as Paid"
                         >
                           <CheckCircle size={16} />
                         </button>
                         <button 
                           onClick={() => openActionModal(payout, "PROCESSING")}
                           className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded"
                           title="Mark as Processing"
                         >
                           <Clock size={16} />
                         </button>
                         <button 
                           onClick={() => openActionModal(payout, "REJECTED")}
                           className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded"
                           title="Reject Request"
                         >
                           <XCircle size={16} />
                         </button>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-400">Processed</div>
                    )}
                  </td>
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

      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {actionStatus === "COMPLETED" && "Mark as Paid"}
                {actionStatus === "REJECTED" && "Reject Request"}
                {actionStatus === "PROCESSING" && "Mark as Processing"}
              </h3>
              <button onClick={() => setSelectedPayout(null)} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={submitAction} className="p-5 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 text-sm">
                 <p><span className="text-gray-500">Vendor:</span> <span className="font-medium">{selectedPayout.vendor?.name}</span></p>
                 <p><span className="text-gray-500">Amount:</span> <span className="font-bold text-gray-900">${Number(selectedPayout.amount).toFixed(2)}</span></p>
                 <p><span className="text-gray-500">Method:</span> {selectedPayout.paymentMethod}</p>
                 <p><span className="text-gray-500">Details:</span> {selectedPayout.accountDetails}</p>
              </div>

              {actionStatus === "REJECTED" && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-2">
                  Rejecting this request will refund the ${Number(selectedPayout.amount).toFixed(2)} back to the vendor's available balance.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Optional)</label>
                <textarea 
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-black resize-none"
                  placeholder={actionStatus === "REJECTED" ? "Reason for rejection..." : "Transaction ID or confirmation note..."}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="flex-1 border border-gray-300 bg-white text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updateStatusMutation.isPending}
                  className={`flex-1 font-semibold py-2.5 rounded-lg text-white flex justify-center items-center ${
                    actionStatus === 'COMPLETED' ? 'bg-green-600 hover:bg-green-700' : 
                    actionStatus === 'REJECTED' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {updateStatusMutation.isPending ? "Processing..." : "Confirm Action"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
