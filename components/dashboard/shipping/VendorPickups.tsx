'use client';

import { ChevronDown, Eye, Pencil, Trash2, X } from 'lucide-react';
import Pagination from '@/components/dashboard/orders/Pagination';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type PickupStatus = 'Shipped' | 'Delivered' | 'Pending' | 'Returned';

interface PickupData {
  id: string;
  customer: string;
  contactNo: string;
  destination: string;
  pickupDate: string;
  status: PickupStatus;
}

const mockPickups: PickupData[] = [
  {
    id: 'GH201',
    customer: 'John Smith',
    contactNo: '555-901-2345',
    destination: 'Port Serenity',
    pickupDate: '2024-01-05',
    status: 'Shipped',
  },
  {
    id: 'RT234',
    customer: 'Alice Johnson',
    contactNo: '555-234-5678',
    destination: 'Emerald Heights, Sunstone City',
    pickupDate: '2024-02-12',
    status: 'Shipped',
  },
  {
    id: 'YU789',
    customer: 'Robert Williams',
    contactNo: '555-345-6789',
    destination: 'Crimson Peak, Shadow Creek',
    pickupDate: '2024-03-20',
    status: 'Delivered',
  },
  {
    id: 'IQ345',
    customer: 'Emily Brown',
    contactNo: '555-456-7890',
    destination: 'Golden Ridge, Twilight Town',
    pickupDate: '2024-04-01',
    status: 'Pending',
  },
  {
    id: 'VO678',
    customer: 'David Garcia',
    contactNo: '555-567-8901',
    destination: 'Ivory Coast, Obsidian Bay',
    pickupDate: '2024-05-15',
    status: 'Shipped',
  },
  {
    id: 'ZX901',
    customer: 'Linda Rodriguez',
    contactNo: '555-678-9012',
    destination: 'Cerulean Wharf, Sienna Village',
    pickupDate: '2024-06-22',
    status: 'Returned',
  },
];

const getStatusStyles = (status: PickupStatus) => {
  switch (status) {
    case 'Shipped':
      return 'bg-[#E0EBE4] text-[#229A4E]';
    case 'Delivered':
      return 'bg-[#E6F0FA] text-[#165DD0]';
    case 'Pending':
      return 'bg-[#FDF5D3] text-[#F09000]';
    case 'Returned':
      return 'bg-[#ECDFDF] text-[#CB1B1B]';
    default:
      return 'bg-[#E5E5E6] text-[#42454D]';
  }
};

const cycleStatus = (current: PickupStatus): PickupStatus => {
  const statuses: PickupStatus[] = ['Shipped', 'Delivered', 'Pending', 'Returned'];
  const idx = statuses.indexOf(current);
  return statuses[(idx + 1) % statuses.length];
};

export default function VendorPickups() {
  const [pickups, setPickups] = useState<PickupData[]>(mockPickups);
  const [filterStatus, setFilterStatus] = useState<PickupStatus | 'All'>('All');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pickupToDelete, setPickupToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pickupToEdit, setPickupToEdit] = useState<PickupData | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [pickupToView, setPickupToView] = useState<PickupData | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const confirmDelete = () => {
    if (pickupToDelete) {
      setPickups(pickups.filter(p => p.id !== pickupToDelete));
      setIsDeleteModalOpen(false);
      setPickupToDelete(null);
      showToast('Pickup deleted successfully');
    }
  };

  const handleEditSave = () => {
    if (pickupToEdit) {
      setPickups(pickups.map(p => p.id === pickupToEdit.id ? pickupToEdit : p));
      setIsEditModalOpen(false);
      setPickupToEdit(null);
      showToast('Pickup updated successfully');
    }
  };

  const handleStatusChange = (id: string) => {
    setPickups(
      pickups.map((p) => (p.id === id ? { ...p, status: cycleStatus(p.status) } : p))
    );
  };

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredPickups = pickups.filter(p => filterStatus === 'All' || p.status === filterStatus);
  const totalPages = Math.ceil(filteredPickups.length / ITEMS_PER_PAGE);

  const paginatedPickups = filteredPickups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] md:p-[24px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Pickups
        </h2>
        <div className='flex flex-col sm:flex-row items-center gap-[12px]'>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as PickupStatus | 'All');
              setCurrentPage(1);
            }}
            className='h-[36px] w-full sm:w-[250px] shrink-0 rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] font-normal text-[#42454D] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0] cursor-pointer'
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-[40px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='w-[100px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Order ID
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Customer
              </p>
            </div>
            <div className='w-[180px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Customer Contact No
              </p>
            </div>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Destination
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Pickup Date
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
          {paginatedPickups.map((pickup) => (
            <div
              key={pickup.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-[16px] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='w-[100px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.id}
                </p>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.customer}
                </p>
              </div>
              <div className='w-[180px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.contactNo}
                </p>
              </div>
              <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.destination}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {pickup.pickupDate}
                </p>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <button
                  type='button'
                  onClick={() => handleStatusChange(pickup.id)}
                  className={cn(
                    'inline-flex items-center gap-[4px] rounded-[2px] px-[8px] py-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(pickup.status)
                  )}
                >
                  <span className='text-[12px] font-normal leading-[1.3]'>{pickup.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-[100px] shrink-0 px-[8px]'>
                <div className='flex items-center justify-center gap-[12px]'>
                  <button
                    onClick={() => {
                      setPickupToView(pickup);
                      setIsViewModalOpen(true);
                    }}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='View Pickup'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setPickupToEdit(pickup);
                      setIsEditModalOpen(true);
                    }}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    aria-label='Edit Pickup'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setPickupToDelete(pickup.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    aria-label='Delete Pickup'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredPickups.length === 0 && (
             <div className="p-8 text-center w-full text-[#848995] text-[14px]">
               No pickups found.
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
              <h3 className='text-[18px] font-semibold text-black'>Delete Pickup</h3>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPickupToDelete(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-[14px] text-[#42454D] mb-[24px] leading-[1.5]'>
              Are you sure you want to delete this pickup? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPickupToDelete(null);
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
      {isViewModalOpen && pickupToView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>Pickup Details</h3>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setPickupToView(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Order ID</span>
                <p className='text-[15px] font-normal text-black'>{pickupToView.id}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Customer</span>
                <p className='text-[15px] font-normal text-black'>{pickupToView.customer}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Contact No</span>
                <p className='text-[15px] font-normal text-black'>{pickupToView.contactNo}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Destination</span>
                <p className='text-[15px] font-normal text-black'>{pickupToView.destination}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Pickup Date</span>
                <p className='text-[15px] font-normal text-black'>{pickupToView.pickupDate}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Status</span>
                <div className='inline-block w-max'>
                  <span className={cn(
                    'inline-block rounded-[2px] px-[12px] py-[4px] text-[13px] font-medium',
                    getStatusStyles(pickupToView.status)
                  )}>
                    {pickupToView.status}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex justify-end'>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setPickupToView(null);
                }}
                className='rounded-[2px] bg-black px-[16px] py-[8px] text-[14px] font-medium text-white hover:bg-gray-800 focus-visible:outline-none'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && pickupToEdit && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>Edit Pickup</h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setPickupToEdit(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Customer Name</label>
                <input
                  type='text'
                  value={pickupToEdit.customer}
                  onChange={(e) => setPickupToEdit({ ...pickupToEdit, customer: e.target.value })}
                  placeholder='Enter customer name'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Contact No</label>
                <input
                  type='text'
                  value={pickupToEdit.contactNo}
                  onChange={(e) => setPickupToEdit({ ...pickupToEdit, contactNo: e.target.value })}
                  placeholder='Enter contact number'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Destination</label>
                <input
                  type='text'
                  value={pickupToEdit.destination}
                  onChange={(e) => setPickupToEdit({ ...pickupToEdit, destination: e.target.value })}
                  placeholder='Enter destination'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Pickup Date</label>
                <input
                  type='date'
                  value={pickupToEdit.pickupDate}
                  onChange={(e) => setPickupToEdit({ ...pickupToEdit, pickupDate: e.target.value })}
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Status</label>
                <select
                  value={pickupToEdit.status}
                  onChange={(e) => setPickupToEdit({ ...pickupToEdit, status: e.target.value as PickupStatus })}
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
            </div>

            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setPickupToEdit(null);
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
