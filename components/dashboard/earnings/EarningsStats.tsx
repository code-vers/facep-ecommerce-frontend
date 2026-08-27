"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Banknote, Clock, Wallet, X } from "lucide-react";
import { useState } from "react";

export default function EarningsStats() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PAYPAL");
  const [accountDetails, setAccountDetails] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const { data: walletData, isLoading } = useQuery({
    queryKey: ["vendor-wallet", session?.user?.role],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/payouts/wallet`, {
        headers: { Authorization: `Bearer ${session?.token}` },
      });
      const json = await res.json();
      return json.data;
    },
    enabled: !!session?.token,
  });

  const requestPayoutMutation = useMutation({
    mutationFn: async (payload: { amount: number; paymentMethod: string; accountDetails: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/payouts/request`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}` 
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-payouts"] });
      setIsModalOpen(false);
      setAmount("");
      setAccountDetails("");
      setErrorMsg("");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to request payout");
    }
  });

  const available = Number(walletData?.availableBalance || 0);
  const pending = Number(walletData?.pendingBalance || 0);
  const withdrawn = Number(walletData?.totalWithdrawn || 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setErrorMsg("Invalid amount");
    if (Number(amount) > available) return setErrorMsg("Amount exceeds available balance");
    if (!accountDetails) return setErrorMsg("Please provide account details");

    requestPayoutMutation.mutate({
      amount: Number(amount),
      paymentMethod,
      accountDetails,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Clock className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Clearance</p>
            <h3 className="text-2xl font-bold text-gray-900">{isLoading ? "..." : formatCurrency(pending)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <Wallet className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Available Balance</p>
            <h3 className="text-2xl font-bold text-gray-900">{isLoading ? "..." : formatCurrency(available)}</h3>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={available <= 0}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Withdraw
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Banknote className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Withdrawn</p>
            <h3 className="text-2xl font-bold text-gray-900">{isLoading ? "..." : formatCurrency(withdrawn)}</h3>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Request Payout</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw (USD)</label>
                <input 
                  type="number" 
                  max={available}
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-black"
                  placeholder={`Max: ${available}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payout Method</label>
                <div className="relative">
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-black bg-white"
                  >
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Details</label>
                <textarea 
                  required
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-black resize-none"
                  placeholder="Enter your PayPal email, bank account number, or mobile money details..."
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={requestPayoutMutation.isPending}
                  className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center"
                >
                  {requestPayoutMutation.isPending ? "Processing..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
