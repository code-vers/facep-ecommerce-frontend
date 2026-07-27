'use client';

import { useDeals, useDeleteDeal, useUpdateDeal } from '@/hooks/api/useDeal';
import { Deal } from '@/lib/api/deal';
import { AxiosError } from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

type StatusFilterType = 'ALL' | 'Active' | 'Disabled';

interface ApiErrorResponse {
  message?: string;
}

interface PromotionsTableProps {
  onAddNewDeal: () => void;
  onEditDeal: (deal: Deal) => void;
}

export default function PromotionsTable({ onAddNewDeal, onEditDeal }: PromotionsTableProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL');
  const [viewModalDeal, setViewModalDeal] = useState<Deal | null>(null);

  // Custom Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  const limit = 10;

  const { data: dealsData, isLoading } = useDeals(page, limit);
  const deleteDealMutation = useDeleteDeal();
  const updateDealMutation = useUpdateDeal();

  const rawDeals = dealsData?.data || [];
  const meta = dealsData?.meta;

  const deals = rawDeals.filter((deal) => {
    if (statusFilter === 'Active') return deal.isActive;
    if (statusFilter === 'Disabled') return !deal.isActive;
    return true;
  });

  const getFullImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  const handleOpenDeleteModal = (deal: Deal) => {
    setDealToDelete(deal);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (deal: Deal) => {
    const nextStatus = !deal.isActive;
    try {
      await updateDealMutation.mutateAsync({
        id: deal.id,
        isActive: nextStatus,
      });
      toast.success(`Deal status changed to ${nextStatus ? 'Active' : 'Disabled'}`);
    } catch (error: unknown) {
      console.error('Failed to toggle deal status:', error);
      const err = error as AxiosError<ApiErrorResponse>;
      const message = err?.response?.data?.message || 'Failed to update deal status';
      toast.error(message);
    }
  };

  const confirmDelete = async () => {
    if (!dealToDelete) return;

    try {
      await deleteDealMutation.mutateAsync(dealToDelete.id);
      toast.success('Deal deleted successfully!');
      setIsDeleteModalOpen(false);
      setDealToDelete(null);
    } catch (error: unknown) {
      console.error('Failed to delete deal:', error);
      const err = error as AxiosError<ApiErrorResponse>;
      toast.error(err?.response?.data?.message || 'Failed to delete deal');
    }
  };

  return (
    <div className='flex flex-col items-center relative size-full bg-white gap-6'>
      <div className='border border-[#e5e5e6] border-solid flex flex-col gap-0 items-start relative rounded-sm w-full bg-white pb-0'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between relative w-full p-4 md:px-6 md:py-4'>
          <div>
            <p className='font-semibold leading-[1.2] text-[20px] text-black'>
              Promotions & Deals Management
            </p>
            <p className='text-[13px] text-[#848995] mt-1'>
              View, edit, or create homepage deal banners and category promotions.
            </p>
          </div>

          <div className='flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto justify-between md:justify-end'>
            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
              className='bg-white border border-[#e5e5e6] h-9 px-3 rounded-xs text-[13px] text-black outline-none focus:border-[#f09000] cursor-pointer'
            >
              <option value='ALL'>All Status</option>
              <option value='Active'>Active Only</option>
              <option value='Disabled'>Disabled Only</option>
            </select>

            {/* Add New Deal Button */}
            <button
              onClick={onAddNewDeal}
              className='bg-[#f09000] hover:bg-[#e08600] text-white font-medium text-[13px] h-9 px-4 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm'
            >
              <Plus size={16} /> Add New Deal
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className='w-full flex flex-col overflow-hidden border-t border-[#e5e5e6]'>
          <div className='w-full overflow-x-auto'>
            <div className='min-w-275 w-full flex flex-col'>
              {/* Table Header */}
              <div className='bg-[#f2f2f3] border-b border-[#e5e5e6] flex items-center px-6 py-3'>
                <div className='w-20 shrink-0 text-[14px] text-[#42454d] font-semibold'>Banner</div>
                <div className='w-30 shrink-0 text-[14px] text-[#42454d] font-semibold'>
                  Deal ID
                </div>
                <div className='flex-[1.5] text-[14px] text-[#42454d] font-semibold'>Deal Name</div>
                <div className='flex-1 text-[14px] text-[#42454d] font-semibold'>
                  Banner Heading
                </div>
                <div className='w-35 shrink-0 text-[14px] text-[#42454d] font-semibold'>
                  % Discount Range
                </div>
                <div className='w-32.5 shrink-0 text-[14px] text-[#42454d] font-semibold'>
                  Applied Categories
                </div>
                <div className='w-25 shrink-0 text-[14px] text-[#42454d] font-semibold text-center'>
                  Status
                </div>
                <div className='w-30 shrink-0 text-[14px] text-[#42454d] font-semibold text-center'>
                  Actions
                </div>
              </div>

              {/* Table Rows */}
              {isLoading ? (
                <div className='p-8 text-center text-[14px] text-[#848995]'>Loading deals...</div>
              ) : deals.length === 0 ? (
                <div className='p-12 text-center flex flex-col items-center gap-3'>
                  <p className='text-[15px] font-medium text-[#42454d]'>
                    No deals or promotions found.
                  </p>
                  <p className='text-[13px] text-[#848995]'>
                    Click the button below to add your first deal banner!
                  </p>
                  <button
                    onClick={onAddNewDeal}
                    className='bg-[#f09000] hover:bg-[#e08600] text-white font-medium text-[13px] px-4 py-2 rounded-xs flex items-center gap-1.5 mt-1 cursor-pointer'
                  >
                    <Plus size={16} /> Create First Deal
                  </button>
                </div>
              ) : (
                deals.map((deal) => (
                  <div
                    key={deal.id}
                    className='border-b border-[#e5e5e6] flex items-center px-6 py-3.5 hover:bg-gray-50 transition-colors'
                  >
                    {/* Banner Image */}
                    <div className='w-20 shrink-0'>
                      <div
                        className='size-10.5 overflow-hidden rounded-sm border border-[#e5e5e6] flex items-center justify-center relative shadow-xs'
                        style={{ backgroundColor: deal.bannerBgColor || '#ffffff' }}
                      >
                        {deal.bannerImage ? (
                          <Image
                            height={200}
                            width={200}
                            src={getFullImageUrl(deal.bannerImage)}
                            alt={deal.title}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <ImageIcon className='size-4 text-[#848995]' />
                        )}
                      </div>
                    </div>

                    {/* ID */}
                    <div className='w-30 shrink-0 text-[12px] text-[#848995] font-mono truncate pr-2'>
                      {deal.id.substring(0, 8)}...
                    </div>

                    {/* Deal Name */}
                    <div className='flex-[1.5] text-[13px] text-black font-semibold'>
                      {deal.title}
                    </div>

                    {/* Heading */}
                    <div className='flex-1 text-[13px] text-[#42454d] truncate pr-2'>
                      {deal.bannerHeading || '--'}
                    </div>

                    {/* Discount Range */}
                    <div className='w-35 shrink-0 text-[13px] text-[#f09000] font-semibold'>
                      {deal.discountStartPercent ?? 0}% - {deal.discountEndPercent ?? 0}%
                    </div>

                    {/* Categories count */}
                    <div className='w-32.5 shrink-0 text-[12px] text-[#42454d]'>
                      {deal.categoryIds?.length ? (
                        <span className='bg-[#f2f2f3] border border-[#e5e5e6] px-2 py-0.5 rounded text-[#42454d]'>
                          {deal.categoryIds.length} Categories
                        </span>
                      ) : (
                        <span className='text-[#848995]'>All Categories</span>
                      )}
                    </div>

                    {/* Interactive Status Toggle Badge */}
                    <div className='w-27.5 shrink-0 flex items-center justify-center'>
                      <button
                        onClick={() => handleToggleStatus(deal)}
                        disabled={updateDealMutation.isPending}
                        title='Click to toggle status (Active / Disabled)'
                        className={`inline-flex items-center gap-1.5 text-[12px] font-medium border rounded-xs px-2.5 py-1 transition-all cursor-pointer hover:shadow-xs active:scale-95 disabled:opacity-50 ${
                          deal.isActive
                            ? 'border-[#c6e5d0] bg-[#eef8f0] text-[#229a4e] hover:bg-[#e2f3e5]'
                            : 'border-[#d0e1ff] bg-[#f0f5ff] text-[#165dd0] hover:bg-[#e4edff]'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${deal.isActive ? 'bg-[#229a4e]' : 'bg-[#165dd0]'}`}
                        />
                        {deal.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className='w-30 shrink-0 flex items-center justify-center gap-3'>
                      <button
                        onClick={() => setViewModalDeal(deal)}
                        title='View Details'
                        className='p-1 hover:bg-gray-100 rounded text-[#686f7d] hover:text-black cursor-pointer'
                      >
                        <Eye className='size-4' />
                      </button>

                      <button
                        onClick={() => onEditDeal(deal)}
                        title='Edit Deal'
                        className='p-1 hover:bg-orange-50 rounded text-[#f09000] hover:text-[#e08600] cursor-pointer'
                      >
                        <Edit2 className='size-3.75' />
                      </button>

                      <button
                        onClick={() => handleOpenDeleteModal(deal)}
                        title='Delete Deal'
                        className='p-1 hover:bg-red-50 rounded text-[#cb1b1b] hover:text-red-700 cursor-pointer'
                      >
                        <Trash2 className='size-3.75' />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className='flex items-center justify-between w-full px-2 mt-2'>
          <p className='text-[13px] text-[#848995]'>Showing total {meta.total} deals</p>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className='flex items-center gap-1 px-3 py-1 text-[13px] text-[#848995] hover:text-black disabled:opacity-50 cursor-pointer border border-[#e5e5e6] rounded-xs'
            >
              <ChevronLeft className='size-4' />
              Previous
            </button>
            <span className='text-[13px] text-[#42454d] px-3 font-medium'>
              Page {page} of {meta.totalPage}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPage))}
              disabled={page === meta.totalPage}
              className='flex items-center gap-1 px-3 py-1 text-[13px] text-black hover:bg-gray-50 border border-[#e5e5e6] rounded-xs disabled:opacity-50 cursor-pointer'
            >
              Next
              <ChevronRight className='size-4' />
            </button>
          </div>
        </div>
      )}

      {/* View Deal Modal */}
      {viewModalDeal && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-6 max-w-xl w-full flex flex-col gap-4 shadow-xl relative'>
            <div className='flex items-center justify-between border-b border-[#e5e5e6] pb-3'>
              <div>
                <h4 className='font-semibold text-lg text-black'>{viewModalDeal.title}</h4>
                <p className='text-[12px] text-[#848995]'>Deal ID: {viewModalDeal.id}</p>
              </div>
              <button
                onClick={() => setViewModalDeal(null)}
                className='text-gray-500 hover:text-black p-1 cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>

            {/* Banner Preview */}
            <div
              className='w-full h-44 rounded-xs overflow-hidden relative flex flex-col justify-center px-6'
              style={{ backgroundColor: viewModalDeal.bannerBgColor || '#ffffff' }}
            >
              <h2 className='text-black text-2xl font-bold'>
                {viewModalDeal.bannerHeading || viewModalDeal.title}
              </h2>
              <p className='text-[#42454d] text-lg mt-1'>{viewModalDeal.bannerSubheading}</p>
              {viewModalDeal.bannerImage && (
                <Image
                  width={200}
                  height={200}
                  src={getFullImageUrl(viewModalDeal.bannerImage)}
                  alt='Banner Graphic'
                  className='absolute right-4 top-1/2 -translate-y-1/2 h-32 object-contain'
                />
              )}
            </div>

            <div className='grid grid-cols-2 gap-4 text-[13px] border-t border-[#e5e5e6] pt-3'>
              <div>
                <span className='text-[#848995]'>Discount Range:</span>
                <p className='font-semibold text-black'>
                  {viewModalDeal.discountStartPercent ?? 0}% -{' '}
                  {viewModalDeal.discountEndPercent ?? 0}%
                </p>
              </div>
              <div>
                <span className='text-[#848995]'>Status:</span>
                <p className='font-semibold text-black'>
                  {viewModalDeal.isActive ? 'Active' : 'Disabled'}
                </p>
              </div>
              <div>
                <span className='text-[#848995]'>Start Date:</span>
                <p className='font-medium text-black'>
                  {viewModalDeal.startDate
                    ? new Date(viewModalDeal.startDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <span className='text-[#848995]'>End Date:</span>
                <p className='font-medium text-black'>
                  {viewModalDeal.endDate
                    ? new Date(viewModalDeal.endDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className='flex justify-end gap-2 border-t border-[#e5e5e6] pt-3 mt-2'>
              <button
                onClick={() => {
                  const deal = viewModalDeal;
                  setViewModalDeal(null);
                  onEditDeal(deal);
                }}
                className='px-4 h-9 bg-[#f09000] text-white text-[13px] font-medium rounded-xs hover:bg-[#e08600] flex items-center gap-1.5 cursor-pointer shadow-xs'
              >
                <Edit2 size={14} /> Edit This Deal
              </button>
              <button
                onClick={() => setViewModalDeal(null)}
                className='px-4 h-9 bg-[#f2f2f3] text-black text-[13px] font-medium rounded-xs hover:bg-gray-200 cursor-pointer'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal (Matching Dashboard Design System) */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded border border-[#E5E5E6] bg-white p-6 shadow-xl relative flex flex-col gap-4'>
            <div className='flex items-start justify-between border-b border-[#E5E5E6] pb-3'>
              <div>
                <h3 className='text-lg font-semibold text-black'>Delete Promotion Deal</h3>
                {dealToDelete && (
                  <p className='text-[12px] text-[#848995] font-medium mt-0.5'>
                    Deal: {dealToDelete.title}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDealToDelete(null);
                }}
                className='text-[#848995] hover:text-black focus-visible:outline-none cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>

            <p className='text-sm text-[#42454D] leading-relaxed'>
              Are you sure you want to delete this deal? This action cannot be undone and will
              permanently remove the deal banner and promotion configuration.
            </p>

            <div className='flex justify-end gap-3 border-t border-[#E5E5E6] pt-4 mt-1'>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDealToDelete(null);
                }}
                className='rounded-sm border border-[#E5E5E6] px-4 py-2 text-sm font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none cursor-pointer'
                disabled={deleteDealMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='rounded-sm bg-[#CB1B1B] hover:bg-red-700 px-4 py-2 text-sm font-medium text-white focus-visible:outline-none flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50'
                disabled={deleteDealMutation.isPending}
              >
                {deleteDealMutation.isPending ? 'Deleting...' : 'Delete Deal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
