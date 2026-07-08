'use client';

import { useState } from 'react';
import { ChevronDown, Eye, Pencil, Trash2, PlusCircle, X } from 'lucide-react';
import Pagination from '@/components/dashboard/orders/Pagination';
import { cn } from '@/lib/utils';

type ReviewStatus = 'Published' | 'Draft';

interface ReviewData {
  id: string;
  name: string;
  feedback: string;
  status: ReviewStatus;
}

const mockReviews: ReviewData[] = [
  {
    id: '1',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Published',
  },
  {
    id: '2',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Published',
  },
  {
    id: '3',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Published',
  },
  {
    id: '4',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Draft',
  },
  {
    id: '5',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Draft',
  },
  {
    id: '6',
    name: 'Kathryn Murphy',
    feedback: 'Great experience overall. The online tools provided made man...',
    status: 'Published',
  },
];

const getStatusStyles = (status: ReviewStatus) => {
  if (status === 'Published') {
    return 'bg-[#E0EBE4] text-[#229A4E]';
  }
  return 'bg-[#FDF3E1] text-[#D98200]';
};

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<ReviewData[]>(mockReviews);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<ReviewData | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [reviewToView, setReviewToView] = useState<ReviewData | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      setReviews(reviews.filter(r => r.id !== reviewToDelete));
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
      showToast('Review deleted successfully');
    }
  };

  const handleEditSave = () => {
    if (reviewToEdit) {
      if (reviews.find(r => r.id === reviewToEdit.id)) {
        setReviews(reviews.map(r => r.id === reviewToEdit.id ? reviewToEdit : r));
        showToast('Review updated successfully');
      } else {
        setReviews([{ ...reviewToEdit, id: Date.now().toString() }, ...reviews]);
        showToast('Review added successfully');
      }
      setIsEditModalOpen(false);
      setReviewToEdit(null);
    }
  };

  const [filterStatus, setFilterStatus] = useState<ReviewStatus | 'All'>('All');

  const toggleStatus = (id: string) => {
    setReviews(reviews.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'Published' ? 'Draft' : 'Published' };
      }
      return r;
    }));
  };

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredReviews = reviews.filter(r => filterStatus === 'All' || r.status === filterStatus);
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Reviews
        </h2>
        <div className='flex flex-col sm:flex-row items-center gap-[12px]'>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as ReviewStatus | 'All');
              setCurrentPage(1); // reset to page 1 on filter change
            }}
            className='h-[36px] w-full sm:w-[250px] shrink-0 rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] font-normal text-[#42454D] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0] cursor-pointer'
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <button 
            onClick={() => {
              setReviewToEdit({ id: '', name: '', feedback: '', status: 'Draft' });
              setIsEditModalOpen(true);
            }}
            className='flex h-[36px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'
          >
            <span className='text-[14px] font-normal text-black'>Add New Review</span>
            <PlusCircle size={16} className='text-black' />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-[40px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Name
              </p>
            </div>
            <div className='min-w-[400px] flex-[1.5_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Feedback
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Status
              </p>
            </div>
            <div className='w-[100px] shrink-0 px-[8px] text-center'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[16px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {review.name}
                </p>
              </div>
              <div className='min-w-[400px] flex-[1.5_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#848995]'>
                  {review.feedback}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  onClick={() => toggleStatus(review.id)}
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(review.status)
                  )}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>{review.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button
                    onClick={() => {
                      setReviewToView(review);
                      setIsViewModalOpen(true);
                    }}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='View Review'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setReviewToEdit(review);
                      setIsEditModalOpen(true);
                    }}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='Edit Review'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setReviewToDelete(review.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Delete Review'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
             <div className="p-8 text-center w-full text-[#848995] text-[14px]">
               No Reviews found.
             </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[400px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[16px]'>
              <h3 className='text-[18px] font-semibold text-black'>Delete Review</h3>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setReviewToDelete(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-[14px] text-[#42454D] mb-[24px] leading-[1.5]'>
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setReviewToDelete(null);
                }}
                className='rounded-[2px] border border-[#E5E5E6] px-[16px] py-[8px] text-[14px] font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className='rounded-[2px] bg-[#CB1B1B] px-[16px] py-[8px] text-[14px] font-medium text-white hover:bg-red-700 focus-visible:outline-none'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && reviewToView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>View Review</h3>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setReviewToView(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Name</span>
                <p className='text-[15px] font-normal text-black'>{reviewToView.name}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Feedback</span>
                <p className='text-[15px] font-normal text-black whitespace-pre-wrap leading-[1.5] bg-[#F2F2F3] p-[12px] rounded-[4px]'>
                  {reviewToView.feedback}
                </p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Status</span>
                <div className='inline-block w-max'>
                  <span className={cn(
                    'inline-block rounded-[2px] px-[12px] py-[4px] text-[13px] font-medium',
                    getStatusStyles(reviewToView.status)
                  )}>
                    {reviewToView.status}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex justify-end'>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setReviewToView(null);
                }}
                className='rounded-[2px] bg-black px-[16px] py-[8px] text-[14px] font-medium text-white hover:bg-gray-800 focus-visible:outline-none'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isEditModalOpen && reviewToEdit && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>
                {reviewToEdit.id ? 'Edit Review' : 'Add New Review'}
              </h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setReviewToEdit(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Name</label>
                <input
                  type='text'
                  value={reviewToEdit.name}
                  onChange={(e) => setReviewToEdit({ ...reviewToEdit, name: e.target.value })}
                  placeholder='Enter name'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Feedback</label>
                <textarea
                  value={reviewToEdit.feedback}
                  onChange={(e) => setReviewToEdit({ ...reviewToEdit, feedback: e.target.value })}
                  placeholder='Enter feedback'
                  rows={4}
                  className='w-full rounded-[2px] border border-[#E5E5E6] bg-white p-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0] resize-none'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Status</label>
                <select
                  value={reviewToEdit.status}
                  onChange={(e) => setReviewToEdit({ ...reviewToEdit, status: e.target.value as ReviewStatus })}
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setReviewToEdit(null);
                }}
                className='rounded-[2px] border border-[#E5E5E6] px-[16px] py-[8px] text-[14px] font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSave}
                className='rounded-[2px] bg-[#F09000] px-[16px] py-[8px] text-[14px] font-medium text-black hover:bg-[#D98200] focus-visible:outline-none'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 rounded-[4px] bg-black px-[16px] py-[12px] text-[14px] font-medium text-white shadow-lg'>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
