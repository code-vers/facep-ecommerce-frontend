'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, Loader2, Package } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUpdateProductStatus } from '@/hooks/api/useProduct';
import { DASHBOARD_QUERY_KEYS } from '@/hooks/api/useDashboard';
import { profileAssetUrl } from '@/lib/api/profile';
import type { IPendingProductItem } from '@/lib/api/dashboard';

interface AdminPendingProductsProps {
  products?: IPendingProductItem[];
}

export default function AdminPendingProducts({ products }: AdminPendingProductsProps) {
  const queryClient = useQueryClient();
  const updateStatusMutation = useUpdateProductStatus();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const productList = products || [];

  const handleAction = (id: string, isActive: boolean) => {
    setProcessingId(id);
    updateStatusMutation.mutate(
      { id, isActive },
      {
        onSuccess: () => {
          toast.success(isActive ? 'Product approved successfully' : 'Product rejected');
          queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.adminOverview });
        },
        onError: () => {
          toast.error('Failed to update product status');
        },
        onSettled: () => {
          setProcessingId(null);
        },
      }
    );
  };

  return (
    <div className="flex-[1.2] w-full min-w-0 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col gap-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h3 className="font-semibold text-[20px] text-[#f09000]">Pending Products</h3>
        <Link
          href="/dashboard/products"
          className="text-[14px] text-[#165dd0] hover:underline font-normal"
        >
          View All
        </Link>
      </div>

      {/* Table Container */}
      <div className="w-full flex flex-col overflow-hidden border border-[#e5e5e6] rounded-[2px]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[550px] w-full flex flex-col">
            
            {/* Table Header */}
            <div className="bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-2 py-[9px]">
              <div className="w-[80px] shrink-0 text-[14px] text-black font-normal px-2">Image</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Product</div>
              <div className="flex-[2] text-[14px] text-black font-normal px-2">Store</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2">Category</div>
              <div className="flex-1 text-[14px] text-black font-normal px-2">Price</div>
              <div className="w-[80px] shrink-0 text-[14px] text-black font-normal px-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            {productList.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#848995]">
                No pending products to review.
              </div>
            ) : (
              productList.map((row) => {
                const isProcessing = processingId === row.id;
                const imgSrc = profileAssetUrl(row.image);

                return (
                  <div key={row.id} className="border-b border-[#e5e5e6] last:border-b-0 flex items-center px-2 py-1 hover:bg-gray-50 transition-colors">
                    
                    {/* Image */}
                    <div className="w-[80px] shrink-0 px-2 flex items-center">
                      <div className="size-10 bg-[#f7f7f8] overflow-hidden rounded-[2px] border border-[#e5e5e6] flex items-center justify-center">
                        {imgSrc ? (
                          <img src={imgSrc} alt={row.product} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="size-5 text-[#848995]" />
                        )}
                      </div>
                    </div>
                    
                    {/* Product */}
                    <div className="flex-[2] text-[12px] text-[#42454d] font-medium px-2 truncate">{row.product}</div>
                    
                    {/* Store */}
                    <div className="flex-[2] text-[12px] text-[#42454d] px-2 truncate">{row.store}</div>
                    
                    {/* Category */}
                    <div className="flex-1 text-[12px] text-[#42454d] px-2 truncate">{row.category}</div>

                    {/* Price */}
                    <div className="flex-1 text-[12px] text-[#42454d] font-medium px-2">
                      ${row.price.toLocaleString()}
                    </div>
                    
                    {/* Action */}
                    <div className="w-[80px] shrink-0 px-2 flex items-center justify-center gap-2">
                      {isProcessing ? (
                        <Loader2 className="size-4 animate-spin text-[#848995]" />
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAction(row.id, true)}
                            disabled={Boolean(processingId)}
                            title="Approve Product"
                            className="size-7 rounded hover:bg-[#e0ebe4] flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <Check className="size-[16px] text-[#229a4e]" strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(row.id, false)}
                            disabled={Boolean(processingId)}
                            title="Reject Product"
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
