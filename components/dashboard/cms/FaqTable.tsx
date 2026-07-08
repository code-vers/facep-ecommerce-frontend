'use client';

import { useState } from 'react';
import { ChevronDown, Eye, Pencil, Trash2, PlusCircle, X } from 'lucide-react';
import Pagination from '@/components/dashboard/orders/Pagination';
import { cn } from '@/lib/utils';

type FaqStatus = 'Published' | 'Draft';

interface FaqData {
  id: string;
  question: string;
  answer: string;
  status: FaqStatus;
}

const mockFaqs: FaqData[] = [
  {
    id: '1',
    question: 'What are the rules about selling restricted products?',
    answer: 'Explore our diverse portfolio of residential, commercial, and industrial spaces.',
    status: 'Published',
  },
  {
    id: '2',
    question: 'How do I optimize my product listings?',
    answer: 'Explore our diverse portfolio of residential, commercial, and industrial spaces.',
    status: 'Published',
  },
  {
    id: '3',
    question: 'What are the shipping options for sellers?',
    answer: 'Explore our diverse portfolio of residential, commercial, and industrial spaces.',
    status: 'Published',
  },
  {
    id: '4',
    question: 'How do I handle customer returns?',
    answer: 'Explore our diverse portfolio of residential, commercial, and industrial spaces.',
    status: 'Draft',
  },
  {
    id: '5',
    question: 'What are the payment options for sellers?',
    answer: 'Explore our diverse portfolio of residential, commercial, and industrial spaces.',
    status: 'Draft',
  },
  {
    id: '6',
    question: 'How do I track my sales performance?',
    answer: 'Explore our diverse portfolio of residential, commercial, and industrial spaces.',
    status: 'Published',
  },
];

const getStatusStyles = (status: FaqStatus) => {
  if (status === 'Published') {
    return 'bg-[#E0EBE4] text-[#229A4E]';
  }
  return 'bg-[#FDF3E1] text-[#D98200]';
};

export default function FaqTable() {
  const [faqs, setFaqs] = useState<FaqData[]>(mockFaqs);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<FaqData | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [faqToView, setFaqToView] = useState<FaqData | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const confirmDelete = () => {
    if (faqToDelete) {
      setFaqs(faqs.filter(f => f.id !== faqToDelete));
      setIsDeleteModalOpen(false);
      setFaqToDelete(null);
      showToast('FAQ deleted successfully');
    }
  };

  const handleEditSave = () => {
    if (faqToEdit) {
      if (faqs.find(f => f.id === faqToEdit.id)) {
        setFaqs(faqs.map(f => f.id === faqToEdit.id ? faqToEdit : f));
        showToast('FAQ updated successfully');
      } else {
        setFaqs([{ ...faqToEdit, id: Date.now().toString() }, ...faqs]);
        showToast('FAQ added successfully');
      }
      setIsEditModalOpen(false);
      setFaqToEdit(null);
    }
  };

  const [filterStatus, setFilterStatus] = useState<FaqStatus | 'All'>('All');

  const toggleStatus = (id: string) => {
    setFaqs(faqs.map(f => {
      if (f.id === id) {
        return { ...f, status: f.status === 'Published' ? 'Draft' : 'Published' };
      }
      return f;
    }));
  };

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredFaqs = faqs.filter(f => filterStatus === 'All' || f.status === filterStatus);
  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);

  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          FAQs
        </h2>
        <div className='flex flex-col sm:flex-row items-center gap-[12px]'>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as FaqStatus | 'All');
              setCurrentPage(1);
            }}
            className='h-[36px] w-full sm:w-[250px] shrink-0 rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] font-normal text-[#42454D] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0] cursor-pointer'
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <button 
            onClick={() => {
              setFaqToEdit({ id: '', question: '', answer: '', status: 'Draft' });
              setIsEditModalOpen(true);
            }}
            className='flex h-[36px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'
          >
            <span className='text-[14px] font-normal text-black'>Add New Question</span>
            <PlusCircle size={16} className='text-black' />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-[40px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='min-w-[300px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Question
              </p>
            </div>
            <div className='min-w-[400px] flex-[1.5_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Answer
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
          {paginatedFaqs.map((faq) => (
            <div
              key={faq.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[16px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='min-w-[300px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {faq.question}
                </p>
              </div>
              <div className='min-w-[400px] flex-[1.5_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#848995]'>
                  {faq.answer}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  onClick={() => toggleStatus(faq.id)}
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(faq.status)
                  )}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>{faq.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button
                    onClick={() => {
                      setFaqToView(faq);
                      setIsViewModalOpen(true);
                    }}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='View FAQ'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setFaqToEdit(faq);
                      setIsEditModalOpen(true);
                    }}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='Edit FAQ'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setFaqToDelete(faq.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Delete FAQ'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
             <div className="p-8 text-center w-full text-[#848995] text-[14px]">
               No FAQs found.
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
              <h3 className='text-[18px] font-semibold text-black'>Delete FAQ</h3>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setFaqToDelete(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-[14px] text-[#42454D] mb-[24px] leading-[1.5]'>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setFaqToDelete(null);
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
      {isViewModalOpen && faqToView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>View FAQ</h3>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setFaqToView(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Question</span>
                <p className='text-[15px] font-normal text-black'>{faqToView.question}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Answer</span>
                <p className='text-[15px] font-normal text-black whitespace-pre-wrap leading-[1.5] bg-[#F2F2F3] p-[12px] rounded-[4px]'>
                  {faqToView.answer}
                </p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Status</span>
                <div className='inline-block w-max'>
                  <span className={cn(
                    'inline-block rounded-[2px] px-[12px] py-[4px] text-[13px] font-medium',
                    getStatusStyles(faqToView.status)
                  )}>
                    {faqToView.status}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex justify-end'>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setFaqToView(null);
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
      {isEditModalOpen && faqToEdit && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>
                {faqToEdit.id ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setFaqToEdit(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Question</label>
                <input
                  type='text'
                  value={faqToEdit.question}
                  onChange={(e) => setFaqToEdit({ ...faqToEdit, question: e.target.value })}
                  placeholder='Enter question'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Answer</label>
                <textarea
                  value={faqToEdit.answer}
                  onChange={(e) => setFaqToEdit({ ...faqToEdit, answer: e.target.value })}
                  placeholder='Enter answer'
                  rows={4}
                  className='w-full rounded-[2px] border border-[#E5E5E6] bg-white p-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0] resize-none'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Status</label>
                <select
                  value={faqToEdit.status}
                  onChange={(e) => setFaqToEdit({ ...faqToEdit, status: e.target.value as FaqStatus })}
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
                  setFaqToEdit(null);
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
