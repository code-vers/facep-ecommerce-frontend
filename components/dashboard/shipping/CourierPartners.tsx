'use client';

import {
  useCouriers,
  useCreateCourier,
  useDeleteCourier,
  useUpdateCourier,
} from '@/hooks/api/useShipping';
import { Courier } from '@/lib/api/shipping';
import { CirclePlus, Eye, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CourierPartners() {
  const { data: couriers = [], isLoading } = useCouriers();
  const createCourier = useCreateCourier();
  const updateCourier = useUpdateCourier();
  const deleteCourier = useDeleteCourier();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courierToDelete, setCourierToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courierToEdit, setCourierToEdit] = useState<Partial<Courier> | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [courierToView, setCourierToView] = useState<Courier | null>(null);

  const confirmDelete = () => {
    if (courierToDelete) {
      deleteCourier.mutate(courierToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setCourierToDelete(null);
          toast.success('Courier partner deleted successfully');
        },
        onError: (error) => {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err?.response?.data?.message || 'Failed to delete courier');
        },
      });
    }
  };

  const handleEditSave = () => {
    if (
      courierToEdit &&
      courierToEdit.name &&
      courierToEdit.rate !== undefined &&
      courierToEdit.deliveryTime
    ) {
      const payload = {
        name: courierToEdit.name,
        rate: Number(courierToEdit.rate),
        deliveryTime: courierToEdit.deliveryTime,
      };

      if (courierToEdit.id) {
        // Update existing
        updateCourier.mutate(
          { id: courierToEdit.id, ...payload },
          {
            onSuccess: () => {
              setIsEditModalOpen(false);
              setCourierToEdit(null);
              toast.success('Courier partner updated successfully');
            },
            onError: (error) => {
              const err = error as { response?: { data?: { message?: string } } };
              toast.error(err?.response?.data?.message || 'Failed to update courier');
            },
          },
        );
      } else {
        // Create new
        createCourier.mutate(payload, {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setCourierToEdit(null);
            toast.success('Courier partner added successfully');
          },
          onError: (error) => {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to add courier');
          },
        });
      }
    } else {
      toast.error('Please fill all required fields');
    }
  };

  if (isLoading) {
    return <div className='p-4 text-sm text-gray-500'>Loading couriers...</div>;
  }

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-6 rounded border border-[#E5E5E6] bg-white p-4'>
      {/* Header */}
      <div className='flex w-full flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <p className='whitespace-nowrap text-xl font-semibold leading-[1.2] text-black'>
          Courier Partners
        </p>
        <button
          onClick={() => {
            setCourierToEdit({ name: '', rate: 0, deliveryTime: '' });
            setIsEditModalOpen(true);
          }}
          className='flex h-9 items-center gap-2 rounded-sm bg-[#F09000] px-4 transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'
        >
          <span className='text-sm font-normal text-black'>Add New Courier Partner</span>
          <CirclePlus size={16} className='text-black' />
        </button>
      </div>

      {/* Cards Grid */}
      <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {couriers.length === 0 ? (
          <p className='text-sm text-gray-500 py-4 col-span-full'>
            No courier partners found. Add one to get started.
          </p>
        ) : (
          couriers.map((courier) => (
            <div
              key={courier.id}
              className='flex flex-col gap-4 rounded border border-[#E5E5E6] bg-white p-4 hover:shadow-sm transition-shadow'
            >
              {/* Mock Logo */}
              <div className='flex items-baseline'>
                <span className='text-lg font-bold text-[#4D148C] leading-none uppercase'>
                  {courier.name.slice(0, 3)}
                </span>
                <span className='text-lg font-bold text-[#FF6600] leading-none uppercase'>
                  {courier.name.slice(3, 5) || 'EX'}
                </span>
              </div>

              {/* Content */}
              <div className='flex flex-col gap-1.5'>
                <p className='text-base font-normal text-black'>{courier.name}</p>
                <p className='text-sm font-normal text-[#42454D]'>
                  Rate: ${courier.rate} per shipment
                </p>
                <p className='text-sm font-normal text-[#42454D]'>
                  Delivery: {courier.deliveryTime}
                </p>
                <p className='text-sm font-normal text-[#42454D]'>Shipments: {courier.shipments}</p>
              </div>

              {/* Actions */}
              <div className='mt-auto flex items-center gap-2 pt-2'>
                <button
                  onClick={() => {
                    setCourierToView(courier);
                    setIsViewModalOpen(true);
                  }}
                  className='flex h-8 w-8 items-center justify-center rounded-sm border border-[#E5E5E6] text-[#42454D] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300'
                  aria-label='View courier partner'
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => {
                    setCourierToEdit(courier);
                    setIsEditModalOpen(true);
                  }}
                  className='flex h-8 w-8 items-center justify-center rounded-sm border border-[#E5E5E6] text-[#42454D] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300'
                  aria-label='Edit courier partner'
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    setCourierToDelete(courier.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className='flex h-8 w-8 items-center justify-center rounded-sm border border-[#FCA5A5] text-[#CB1B1B] transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-300'
                  aria-label='Delete courier partner'
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded border border-[#E5E5E6] bg-white p-6 shadow-xl'>
            <div className='flex items-start justify-between mb-4'>
              <h3 className='text-lg font-semibold text-black'>Delete Courier</h3>
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
            <p className='text-sm text-[#42454D] mb-6 leading-normal'>
              Are you sure you want to delete this courier partner? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCourierToDelete(null);
                }}
                className='rounded-sm border border-[#E5E5E6] px-4 py-2 text-sm font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
                disabled={deleteCourier.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='rounded-sm bg-[#CB1B1B] px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none flex items-center gap-2'
                disabled={deleteCourier.isPending}
              >
                {deleteCourier.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && courierToView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-lg rounded border border-[#E5E5E6] bg-white p-6 shadow-xl'>
            <div className='flex items-start justify-between mb-6'>
              <h3 className='text-lg font-semibold text-black'>Courier Details</h3>
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

            <div className='flex flex-col gap-4 mb-6'>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Name</span>
                <p className='text-base font-normal text-black'>{courierToView.name}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Rate</span>
                <p className='text-base font-normal text-black'>${courierToView.rate}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Delivery</span>
                <p className='text-base font-normal text-black'>{courierToView.deliveryTime}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Shipments</span>
                <p className='text-base font-normal text-black'>{courierToView.shipments}</p>
              </div>
            </div>

            <div className='flex justify-end'>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setCourierToView(null);
                }}
                className='rounded-sm bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-none'
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
          <div className='w-full max-w-lg rounded border border-[#E5E5E6] bg-white p-6 shadow-xl'>
            <div className='flex items-start justify-between mb-6'>
              <h3 className='text-lg font-semibold text-black'>
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

            <div className='flex flex-col gap-4 mb-6'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-normal text-black'>Name</label>
                <input
                  type='text'
                  value={courierToEdit.name || ''}
                  onChange={(e) => setCourierToEdit({ ...courierToEdit, name: e.target.value })}
                  placeholder='Enter courier name'
                  className='h-10 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-normal text-black'>Rate</label>
                <input
                  type='number'
                  step='0.01'
                  value={courierToEdit.rate || ''}
                  onChange={(e) =>
                    setCourierToEdit({ ...courierToEdit, rate: parseFloat(e.target.value) || 0 })
                  }
                  placeholder='Enter rate (e.g., 8.50)'
                  className='h-10 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-normal text-black'>Delivery</label>
                <input
                  type='text'
                  value={courierToEdit.deliveryTime || ''}
                  onChange={(e) =>
                    setCourierToEdit({ ...courierToEdit, deliveryTime: e.target.value })
                  }
                  placeholder='Enter delivery time (e.g., 2-3 days)'
                  className='h-10 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
            </div>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setCourierToEdit(null);
                }}
                className='rounded-sm border border-[#E5E5E6] px-4 py-2 text-sm font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
                disabled={createCourier.isPending || updateCourier.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className='rounded-sm bg-[#F09000] px-4 py-2 text-sm font-medium text-black hover:bg-[#D98200] focus-visible:outline-none'
                disabled={createCourier.isPending || updateCourier.isPending}
              >
                {createCourier.isPending || updateCourier.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
