'use client';

import { CirclePlus, Eye, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Courier {
  id: number;
  name: string;
  rate: string;
  delivery: string;
  shipments: string;
}

const mockCouriers: Courier[] = [
  {
    id: 1,
    name: 'FedEx Express',
    rate: '$8.50',
    delivery: '2-3 days',
    shipments: '3,245',
  },
  {
    id: 2,
    name: 'DHL Express',
    rate: '$9.00',
    delivery: '2-4 days',
    shipments: '1,500',
  },
  {
    id: 3,
    name: 'UPS Standard',
    rate: '$7.50',
    delivery: '3-5 days',
    shipments: '2,100',
  },
];

export default function CourierPartners() {
  const [couriers, setCouriers] = useState<Courier[]>(mockCouriers);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courierToDelete, setCourierToDelete] = useState<number | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courierToEdit, setCourierToEdit] = useState<Courier | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [courierToView, setCourierToView] = useState<Courier | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const confirmDelete = () => {
    if (courierToDelete !== null) {
      setCouriers(couriers.filter(c => c.id !== courierToDelete));
      setIsDeleteModalOpen(false);
      setCourierToDelete(null);
      showToast('Courier partner deleted successfully');
    }
  };

  const handleEditSave = () => {
    if (courierToEdit) {
      if (couriers.find(c => c.id === courierToEdit.id)) {
        setCouriers(couriers.map(c => c.id === courierToEdit.id ? courierToEdit : c));
        showToast('Courier partner updated successfully');
      } else {
        setCouriers([{ ...courierToEdit, id: Date.now() }, ...couriers]);
        showToast('Courier partner added successfully');
      }
      setIsEditModalOpen(false);
      setCourierToEdit(null);
    }
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px]'>
      {/* Header */}
      <div className='flex w-full flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <p className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Courier Partners
        </p>
        <button 
          onClick={() => {
            setCourierToEdit({ id: 0, name: '', rate: '', delivery: '', shipments: '0' });
            setIsEditModalOpen(true);
          }}
          className='flex h-[36px] items-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'>
          <span className='text-[14px] font-normal text-black'>Add New Courier Partner</span>
          <CirclePlus size={16} className='text-black' />
        </button>
      </div>

      {/* Cards Grid */}
      <div className='grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {couriers.map((courier) => (
          <div
            key={courier.id}
            className='flex flex-col gap-[16px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px] hover:shadow-sm transition-shadow'
          >
            {/* Mock Logo */}
            <div className='flex items-baseline'>
              <span className='text-[18px] font-bold text-[#4D148C] leading-none'>
                {courier.name.slice(0, 3)}
              </span>
              <span className='text-[18px] font-bold text-[#FF6600] leading-none'>
                {courier.name.slice(3, 5) || 'EX'}
              </span>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-[6px]'>
              <p className='text-[16px] font-normal text-black'>{courier.name}</p>
              <p className='text-[13px] font-normal text-[#42454D]'>
                Rate: {courier.rate} per shipment
              </p>
              <p className='text-[13px] font-normal text-[#42454D]'>
                Delivery: {courier.delivery}
              </p>
              <p className='text-[13px] font-normal text-[#42454D]'>
                Shipments: {courier.shipments}
              </p>
            </div>

            {/* Actions */}
            <div className='mt-auto flex items-center gap-[8px] pt-[8px]'>
              <button
                onClick={() => {
                  setCourierToView(courier);
                  setIsViewModalOpen(true);
                }}
                className='flex h-[32px] w-[32px] items-center justify-center rounded-[2px] border border-[#E5E5E6] text-[#42454D] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300'
                aria-label='View courier partner'
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => {
                  setCourierToEdit(courier);
                  setIsEditModalOpen(true);
                }}
                className='flex h-[32px] w-[32px] items-center justify-center rounded-[2px] border border-[#E5E5E6] text-[#42454D] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300'
                aria-label='Edit courier partner'
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => {
                  setCourierToDelete(courier.id);
                  setIsDeleteModalOpen(true);
                }}
                className='flex h-[32px] w-[32px] items-center justify-center rounded-[2px] border border-[#FCA5A5] text-[#CB1B1B] transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-300'
                aria-label='Delete courier partner'
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[400px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[16px]'>
              <h3 className='text-[18px] font-semibold text-black'>Delete Courier</h3>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCourierToDelete(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-[14px] text-[#42454D] mb-[24px] leading-[1.5]'>
              Are you sure you want to delete this courier partner? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCourierToDelete(null);
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
      {isViewModalOpen && courierToView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>Courier Details</h3>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setCourierToView(null);
                }} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Name</span>
                <p className='text-[15px] font-normal text-black'>{courierToView.name}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Rate</span>
                <p className='text-[15px] font-normal text-black'>{courierToView.rate}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Delivery</span>
                <p className='text-[15px] font-normal text-black'>{courierToView.delivery}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Shipments</span>
                <p className='text-[15px] font-normal text-black'>{courierToView.shipments}</p>
              </div>
            </div>

            <div className='flex justify-end'>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setCourierToView(null);
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
      {isEditModalOpen && courierToEdit && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>
                {courierToEdit.id ? 'Edit Courier Partner' : 'Add New Courier Partner'}
              </h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setCourierToEdit(null);
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
                  value={courierToEdit.name}
                  onChange={(e) => setCourierToEdit({ ...courierToEdit, name: e.target.value })}
                  placeholder='Enter courier name'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Rate</label>
                <input
                  type='text'
                  value={courierToEdit.rate}
                  onChange={(e) => setCourierToEdit({ ...courierToEdit, rate: e.target.value })}
                  placeholder='Enter rate (e.g., $8.50)'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Delivery</label>
                <input
                  type='text'
                  value={courierToEdit.delivery}
                  onChange={(e) => setCourierToEdit({ ...courierToEdit, delivery: e.target.value })}
                  placeholder='Enter delivery time (e.g., 2-3 days)'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
            </div>

            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setCourierToEdit(null);
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
