'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, Loader2, Store as StoreIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { profileAssetUrl } from '@/lib/api/profile';
import { useUpdateVendorStatus } from '@/hooks/api/useVendor';
import { DASHBOARD_QUERY_KEYS } from '@/hooks/api/useDashboard';
import type { IPendingStoreItem } from '@/lib/api/dashboard';

interface AdminPendingStoresProps {
  stores?: IPendingStoreItem[];
}

export default function AdminPendingStores({ stores }: AdminPendingStoresProps) {
  const queryClient = useQueryClient();
  const updateStatusMutation = useUpdateVendorStatus();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingList = stores || [];

  const handleAction = async (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setProcessingId(id);
    updateStatusMutation.mutate(
      { id, status },
      {
        onSettled: () => {
          setProcessingId(null);
          queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.adminOverview });
        },
      }
    );
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h3 className="font-semibold text-[20px] text-[#f09000]">Pending Stores</h3>
        <Link
          href="/dashboard/vendors?status=pending"
          className="text-[14px] text-[#165dd0] hover:underline font-normal"
        >
          View All
        </Link>
      </div>

      {/* Table Container */}
      <div className="w-full flex flex-col overflow-hidden border border-[#e5e5e6] rounded-[2px]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px] w-full flex flex-col">
            
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[9px]">
              <div className="w-[80px] shrink-0 text-[14px] text-black font-normal px-2">Logo</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Store</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Vendor Name</div>
              <div className="flex-[1.5] text-[14px] text-black font-normal px-2">Application Date</div>
              <div className="w-[80px] shrink-0 text-[14px] text-black font-normal px-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            {pendingList.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#848995]">
                No pending store applications.
              </div>
            ) : (
              pendingList.map((row) => {
                const logoSrc = profileAssetUrl(row.logo);
                const isProcessing = processingId === row.id;

                return (
                  <div key={row.id} className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-1 hover:bg-gray-50 transition-colors">
                    
                    {/* Logo */}
                    <div className="w-[80px] shrink-0 px-2 flex items-center">
                      <div className="size-10 bg-[#f7f7f8] overflow-hidden rounded-[2px] border border-[#e5e5e6] flex items-center justify-center">
                        {logoSrc ? (
                          <img src={logoSrc} alt={row.store} className="w-full h-full object-cover" />
                        ) : (
                          <StoreIcon className="size-5 text-[#848995]" />
                        )}
                      </div>
                    </div>
                    
                    {/* Store */}
                    <div className="flex-[2] text-[12px] text-[#42454d] font-medium px-2 truncate">{row.store}</div>
                    
                    {/* Vendor Name */}
                    <div className="flex-[2] text-[12px] text-[#42454d] px-2 truncate">{row.vendor}</div>
                    
                    {/* Application Date */}
                    <div className="flex-[1.5] text-[12px] text-[#42454d] px-2">{row.date}</div>
                    
                    {/* Action */}
                    <div className="w-[80px] shrink-0 px-2 flex items-center justify-center gap-2">
                      {isProcessing ? (
                        <Loader2 className="size-4 animate-spin text-[#848995]" />
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAction(row.id, 'ACTIVE')}
                            disabled={Boolean(processingId)}
                            title="Accept Store Application"
                            className="size-7 rounded hover:bg-[#e0ebe4] flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <Check className="size-[16px] text-[#229a4e]" strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(row.id, 'SUSPENDED')}
                            disabled={Boolean(processingId)}
                            title="Reject / Suspend Store Application"
                            className="size-7 rounded hover:bg-[#fcece6] flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <X className="size-[16px] text-[#cb1b1b]" strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                    </div>
                    
                  </div>
                );
              })
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
