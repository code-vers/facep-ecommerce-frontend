'use client';

import { useDeleteInquiry, useInquiries, useUpdateInquiry } from '@/hooks/api/useInquiry';
import { Inquiry } from '@/lib/api/inquiry';
import { AxiosError } from 'axios';
import { CheckCircle, ChevronDown, Eye, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type StatusFilterType = 'ALL' | 'PENDING' | 'REPLIED';

interface ApiErrorResponse {
  message?: string;
}

const getStatusStyles = (status: Inquiry['status'] | string) => {
  switch (status) {
    case 'REPLIED':
    case 'Replied':
      return 'bg-[#E0EBE4] text-[#229A4E]';
    case 'PENDING':
    case 'Pending':
      return 'bg-[#F9EBD3] text-[#F09000]';
    default:
      return 'bg-[#E5E5E6] text-[#42454D]';
  }
};

export default function InquiriesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL');

  const itemsPerPage = 10;

  const { data: inquiriesData, isLoading } = useInquiries(
    currentPage,
    itemsPerPage,
    statusFilter !== 'ALL' ? statusFilter : undefined,
  );

  const inquiries = inquiriesData?.data || [];
  const totalPages = inquiriesData?.meta?.totalPage || 1;

  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [inquiryToView, setInquiryToView] = useState<Inquiry | null>(null);

  const handleStatusChange = (id: string, newStatus: 'PENDING' | 'REPLIED') => {
    updateInquiry.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toast.success('Inquiry status updated successfully');
          if (inquiryToView && inquiryToView.id === id) {
            setInquiryToView((prev) => (prev ? { ...prev, status: newStatus } : null));
          }
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const message = axiosError?.response?.data?.message || error.message || 'Failed to update status';
          toast.error(message);
        },
      },
    );
  };

  const confirmDelete = () => {
    if (inquiryToDelete) {
      deleteInquiry.mutate(inquiryToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setInquiryToDelete(null);
          toast.success('Inquiry deleted successfully');
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const message = axiosError?.response?.data?.message || error.message || 'Failed to delete inquiry';
          toast.error(message);
        },
      });
    }
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-6 rounded-lg border border-[#E5E5E6] bg-white p-4 md:p-4'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6'>
        <div className='flex min-w-0 flex-[1_0_0] items-center justify-between'>
          <p className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
            Inquiries
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='relative flex h-9 w-full sm:w-50 shrink-0 items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2'>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilterType);
                setCurrentPage(1);
              }}
              className='w-full bg-transparent text-[14px] text-black focus:outline-none cursor-pointer appearance-none pr-6'
            >
              <option value='ALL'>Filter By Status: All</option>
              <option value='PENDING'>Pending</option>
              <option value='REPLIED'>Replied</option>
            </select>
            <ChevronDown
              size={16}
              className='pointer-events-none absolute right-3 text-[#848995]'
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className='w-full overflow-x-auto'>
        <div className='min-w-250 flex w-full flex-col'>
          {/* Table Header */}
          <div className='flex w-full shrink-0 items-center bg-[#F2F2F3] h-12'>
            <div className='w-37.5 shrink-0 px-2 pl-4'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Name
              </p>
            </div>
            <div className='w-45 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Email
              </p>
            </div>
            <div className='w-35 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Contact Number
              </p>
            </div>
            <div className='min-w-50 flex-[1_0_0] px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Inquiry
              </p>
            </div>
            <div className='w-25 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Date
              </p>
            </div>
            <div className='w-25 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Time
              </p>
            </div>
            <div className='w-30 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Status
              </p>
            </div>
            <div className='w-20 shrink-0 px-2 text-center'>
              <p className='whitespace-nowrap text-[14px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Loading / Empty / Data */}
          {isLoading ? (
            <div className='p-8 text-center text-sm text-[#848995]'>Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className='p-8 text-center text-sm text-[#848995]'>
              No support inquiries found.
            </div>
          ) : (
            inquiries.map((inquiry) => {
              const createdDate = new Date(inquiry.createdAt);
              const dateStr = createdDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              });
              const timeStr = createdDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <div
                  key={inquiry.id}
                  className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] h-13 hover:bg-gray-50 transition-colors'
                >
                  <div className='w-37.5 shrink-0 px-2 pl-4'>
                    <p className='truncate text-[12px] font-medium leading-[1.3] text-[#0A0A0A]'>
                      {inquiry.name}
                    </p>
                  </div>
                  <div className='w-45 shrink-0 px-2'>
                    <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                      {inquiry.email}
                    </p>
                  </div>
                  <div className='w-35 shrink-0 px-2'>
                    <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                      {inquiry.contactNumber || 'N/A'}
                    </p>
                  </div>
                  <div className='min-w-50 flex-[1_0_0] px-2'>
                    <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                      {inquiry.message}
                    </p>
                  </div>
                  <div className='w-25 shrink-0 px-2'>
                    <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                      {dateStr}
                    </p>
                  </div>
                  <div className='w-25 shrink-0 px-2'>
                    <p className='truncate text-[12px] font-normal leading-[1.3] text-[#42454D]'>
                      {timeStr}
                    </p>
                  </div>
                  <div className='w-30 shrink-0 px-2'>
                    <div className='relative inline-block'>
                      <select
                        value={inquiry.status}
                        onChange={(e) =>
                          handleStatusChange(inquiry.id, e.target.value as 'PENDING' | 'REPLIED')
                        }
                        className={`h-6.5 appearance-none rounded-xs px-2 pr-5.5 text-[12px] font-medium leading-[1.2] cursor-pointer focus:outline-none ${getStatusStyles(
                          inquiry.status,
                        )}`}
                      >
                        <option value='PENDING' className='bg-white text-black'>
                          Pending
                        </option>
                        <option value='REPLIED' className='bg-white text-black'>
                          Replied
                        </option>
                      </select>
                      <ChevronDown
                        size={12}
                        className='pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 opacity-75'
                      />
                    </div>
                  </div>
                  <div className='w-20 shrink-0 px-2'>
                    <div className='flex items-center justify-center gap-3'>
                      <button
                        onClick={() => {
                          setInquiryToView(inquiry);
                          setIsViewModalOpen(true);
                        }}
                        className='text-[#42454D] hover:text-black transition-colors cursor-pointer'
                        title='View Inquiry'
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setInquiryToDelete(inquiry.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className='text-[#CB1B1B] hover:text-red-700 transition-colors cursor-pointer'
                        title='Delete Inquiry'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='w-full flex items-center justify-center gap-2 mt-4'>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className='text-sm text-[#848995] hover:text-black mr-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
          >
            &lt; Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm cursor-pointer ${
                currentPage === i + 1
                  ? 'bg-[#f2f2f3] text-black font-medium border border-[#e5e5e6]'
                  : 'bg-white text-[#42454d] hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className='text-sm text-black hover:opacity-70 ml-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
          >
            Next &gt;
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full  max-w-md rounded border border-gray-400 bg-white p-6 shadow-xl'>
            <div className='flex items-start justify-between mb-4'>
              <h3 className='text-lg font-semibold text-black'>Delete Inquiry</h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setInquiryToDelete(null);
                }}
                className='text-[#848995] hover:text-black focus-visible:outline-none cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-sm text-[#42454D] mb-6 leading-normal'>
              Are you sure you want to delete this support inquiry? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setInquiryToDelete(null);
                }}
                className='rounded-sm border border-[#E5E5E6] px-4 py-2 text-sm font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none cursor-pointer'
                disabled={deleteInquiry.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='rounded-sm bg-[#CB1B1B] px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none flex items-center gap-2 cursor-pointer disabled:opacity-60'
                disabled={deleteInquiry.isPending}
              >
                {deleteInquiry.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && inquiryToView && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
          onClick={() => {
            setIsViewModalOpen(false);
            setInquiryToView(null);
          }}
        >
          <div
            className='w-full max-w-162.5 rounded-lg bg-white p-8 sm:p-10 shadow-xl relative'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top section: Name and Date/Time */}
            <div className='flex justify-between items-start mb-8'>
              <h2 className='text-[22px] sm:text-[24px] font-normal text-[#1A1A1A]'>
                {inquiryToView.name}
              </h2>
              <div className='flex flex-col items-end text-[14px] sm:text-[15px] text-[#848995] gap-1'>
                <p>
                  Date :{' '}
                  {new Date(inquiryToView.createdAt)
                    .toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                    .replace(/\//g, '.')}
                </p>
                <p>
                  Time :{' '}
                  {new Date(inquiryToView.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </div>

            {/* Info section */}
            <div className='flex flex-col gap-3 mb-8'>
              <p className='text-[16px] sm:text-[18px] text-[#42454D]'>
                Email : {inquiryToView.email}
              </p>
              <p className='text-[16px] sm:text-[18px] text-[#42454D]'>
                Contact No : {inquiryToView.contactNumber || 'N/A'}
              </p>
              <div className='flex items-center gap-2 text-[16px] sm:text-[18px] text-[#42454D]'>
                Status :
                <div className='relative inline-block'>
                  <select
                    value={inquiryToView.status}
                    onChange={(e) =>
                      handleStatusChange(inquiryToView.id, e.target.value as 'PENDING' | 'REPLIED')
                    }
                    className={`h-7 appearance-none rounded-lg px-3 pr-7 text-[13px] font-medium leading-[1.2] cursor-pointer focus:outline-none ${getStatusStyles(
                      inquiryToView.status,
                    )}`}
                  >
                    <option value='PENDING' className='bg-white text-black'>
                      Pending
                    </option>
                    <option value='REPLIED' className='bg-white text-black'>
                      Replied
                    </option>
                  </select>
                  <ChevronDown
                    size={14}
                    className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-75'
                  />
                </div>
              </div>
            </div>

            <div className='h-px w-full bg-[#E5E5E6] mb-8'></div>

            {/* Inquiry Message */}
            <div className='mb-10'>
              <h3 className='text-[18px] sm:text-[20px] font-medium text-[#1A1A1A] mb-3'>
                Inquiry
              </h3>
              <p className='text-[16px] text-[#42454D] leading-relaxed whitespace-pre-wrap'>
                {inquiryToView.message}
              </p>
            </div>

            {/* Action Button */}
            {inquiryToView.status !== 'REPLIED' ? (
              <button
                onClick={() => handleStatusChange(inquiryToView.id, 'REPLIED')}
                disabled={updateInquiry.isPending}
                className='w-full h-12 rounded-lg bg-[#F09000] hover:bg-[#D88100] transition-colors text-white font-medium text-[16px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {updateInquiry.isPending ? (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='size-5 animate-spin text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <>
                    <span>Mark as Replied</span>
                    <CheckCircle size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange(inquiryToView.id, 'PENDING')}
                disabled={updateInquiry.isPending}
                className='w-full h-12 rounded-lg border border-[#E5E5E6] bg-gray-50 hover:bg-gray-100 transition-colors text-[#42454D] font-medium text-[16px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {updateInquiry.isPending ? (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='size-5 animate-spin text-gray-700'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span>Mark as Pending</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
