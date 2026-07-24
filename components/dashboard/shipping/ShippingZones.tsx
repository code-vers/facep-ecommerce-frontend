'use client';

import { Check, Eye, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { ShippingZone } from '@/lib/api/shipping';
import {
  useShippingZones,
  useCreateShippingZone,
  useDeleteShippingZone,
  useUpdateShippingZone,
} from '@/hooks/api/useShipping';

export default function ShippingZones() {
  const { data: zones = [], isLoading } = useShippingZones();
  const createZone = useCreateShippingZone();
  const updateZone = useUpdateShippingZone();
  const deleteZone = useDeleteShippingZone();

  // States for new row inputs
  const [newZoneName, setNewZoneName] = useState('');
  const [newCountries, setNewCountries] = useState('');
  const [newBaseRate, setNewBaseRate] = useState('');
  const [newPerKgRate, setNewPerKgRate] = useState('');
  const [newIsFreeShipping, setNewIsFreeShipping] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [zoneToEdit, setZoneToEdit] = useState<Partial<ShippingZone> | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [zoneToView, setZoneToView] = useState<ShippingZone | null>(null);

  const handleAdd = () => {
    if (!newZoneName || !newCountries || !newBaseRate || !newPerKgRate) {
      toast.error('Please fill all required fields');
      return;
    }

    createZone.mutate(
      {
        zoneName: newZoneName,
        countries: newCountries,
        baseRate: Number(newBaseRate),
        perKgRate: Number(newPerKgRate),
        isFreeShipping: newIsFreeShipping,
      },
      {
        onSuccess: () => {
          setNewZoneName('');
          setNewCountries('');
          setNewBaseRate('');
          setNewPerKgRate('');
          setNewIsFreeShipping(false);
          toast.success('Shipping zone added successfully');
        },
        onError: (error) => {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err?.response?.data?.message || 'Failed to add shipping zone');
        },
      },
    );
  };

  const confirmDelete = () => {
    if (zoneToDelete) {
      deleteZone.mutate(zoneToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setZoneToDelete(null);
          toast.success('Shipping zone deleted successfully');
        },
        onError: (error) => {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err?.response?.data?.message || 'Failed to delete shipping zone');
        },
      });
    }
  };

  const handleEditSave = () => {
    if (
      zoneToEdit &&
      zoneToEdit.id &&
      zoneToEdit.zoneName &&
      zoneToEdit.countries &&
      zoneToEdit.baseRate !== undefined &&
      zoneToEdit.perKgRate !== undefined
    ) {
      updateZone.mutate(
        {
          id: zoneToEdit.id,
          zoneName: zoneToEdit.zoneName,
          countries: zoneToEdit.countries,
          baseRate: Number(zoneToEdit.baseRate),
          perKgRate: Number(zoneToEdit.perKgRate),
          isFreeShipping: zoneToEdit.isFreeShipping,
        },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setZoneToEdit(null);
            toast.success('Shipping zone updated successfully');
          },
          onError: (error) => {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'Failed to update shipping zone');
          },
        },
      );
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const handleToggleFreeShipping = (zone: ShippingZone) => {
    updateZone.mutate(
      {
        id: zone.id,
        isFreeShipping: !zone.isFreeShipping,
      },
      {
        onSuccess: () => {
          toast.success(
            `Free shipping ${!zone.isFreeShipping ? 'enabled' : 'disabled'} for ${zone.zoneName}`,
          );
        },
        onError: (error) => {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err?.response?.data?.message || 'Failed to update free shipping status');
        },
      },
    );
  };

  if (isLoading) {
    return <div className='p-4 text-sm text-gray-500'>Loading shipping zones...</div>;
  }

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-6 rounded border border-[#E5E5E6] bg-white p-4'>
      {/* Header */}
      <div className='flex w-full shrink-0 items-center justify-between'>
        <p className='whitespace-nowrap text-xl font-semibold leading-[1.2] text-black'>
          Shipping Zones & Rates
        </p>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-5xl flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-8 w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-2'>
            <div className='w-48 shrink-0 px-2'>
              <p className='whitespace-nowrap text-sm font-normal leading-[1.3] text-black'>Zone</p>
            </div>
            <div className='min-w-48 flex-[1_0_0] px-2'>
              <p className='whitespace-nowrap text-sm font-normal leading-[1.3] text-black'>
                Countries
              </p>
            </div>
            <div className='w-36 shrink-0 px-2'>
              <p className='whitespace-nowrap text-sm font-normal leading-[1.3] text-black'>
                Base Rate
              </p>
            </div>
            <div className='w-36 shrink-0 px-2'>
              <p className='whitespace-nowrap text-sm font-normal leading-[1.3] text-black'>
                Per KG
              </p>
            </div>
            <div className='w-36 shrink-0 px-2'>
              <p className='whitespace-nowrap text-sm font-normal leading-[1.3] text-black'>
                Free Shipping
              </p>
            </div>
            <div className='w-28 shrink-0 px-2'>
              <p className='whitespace-nowrap text-sm font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {zones.length === 0 ? (
            <div className='flex h-12 w-full items-center justify-center border-b border-[#E5E5E6]'>
              <p className='text-sm text-gray-500'>No shipping zones found.</p>
            </div>
          ) : (
            zones.map((zone) => (
              <div
                key={zone.id}
                className='flex h-12 w-full shrink-0 items-center border-b border-[#E5E5E6] px-2 transition-colors hover:bg-gray-50'
              >
                <div className='w-48 shrink-0 px-2'>
                  <p className='truncate text-sm font-normal leading-[1.3] text-[#42454D]'>
                    {zone.zoneName}
                  </p>
                </div>
                <div className='min-w-48 flex-[1_0_0] px-2'>
                  <p className='truncate text-sm font-normal leading-[1.3] text-[#42454D]'>
                    {zone.countries}
                  </p>
                </div>
                <div className='w-36 shrink-0 px-2'>
                  <p className='truncate text-sm font-normal leading-[1.3] text-[#42454D]'>
                    ${zone.baseRate}
                  </p>
                </div>
                <div className='w-36 shrink-0 px-2'>
                  <p className='truncate text-sm font-normal leading-[1.3] text-[#42454D]'>
                    ${zone.perKgRate}
                  </p>
                </div>
                <div className='w-36 shrink-0 px-2'>
                  <button
                    onClick={() => handleToggleFreeShipping(zone)}
                    disabled={updateZone.isPending}
                    className={cn(
                      'flex size-4 items-center justify-center rounded-sm border transition-colors',
                      zone.isFreeShipping
                        ? 'border-[#F09000] bg-[#F09000]'
                        : 'border-[#E5E5E6] bg-white',
                    )}
                  >
                    {zone.isFreeShipping && (
                      <Check size={12} className='text-white' strokeWidth={3} />
                    )}
                  </button>
                </div>
                <div className='w-28 shrink-0 px-2'>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => {
                        setZoneToView(zone);
                        setIsViewModalOpen(true);
                      }}
                      className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setZoneToEdit(zone);
                        setIsEditModalOpen(true);
                      }}
                      className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setZoneToDelete(zone.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Input Row */}
          <div className='flex h-14 w-full shrink-0 items-center px-2 transition-colors bg-gray-50/50 mt-4 border border-[#E5E5E6] rounded-sm'>
            <div className='w-48 shrink-0 px-2'>
              <input
                type='text'
                placeholder='Zone Name'
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className='h-8 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-[#42454D] placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none'
              />
            </div>
            <div className='min-w-48 flex-[1_0_0] px-2'>
              <input
                type='text'
                placeholder='Countries'
                value={newCountries}
                onChange={(e) => setNewCountries(e.target.value)}
                className='h-8 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-[#42454D] placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none'
              />
            </div>
            <div className='w-36 shrink-0 px-2'>
              <input
                type='number'
                step='0.01'
                placeholder='Base rate'
                value={newBaseRate}
                onChange={(e) => setNewBaseRate(e.target.value)}
                className='h-8 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-[#42454D] placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none'
              />
            </div>
            <div className='w-36 shrink-0 px-2'>
              <input
                type='number'
                step='0.01'
                placeholder='per kg rate'
                value={newPerKgRate}
                onChange={(e) => setNewPerKgRate(e.target.value)}
                className='h-8 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-[#42454D] placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none'
              />
            </div>
            <div className='w-36 shrink-0 px-2'>
              <button
                onClick={() => setNewIsFreeShipping(!newIsFreeShipping)}
                className={cn(
                  'flex size-4 cursor-pointer items-center justify-center rounded-sm border transition-colors hover:border-[#848995]',
                  newIsFreeShipping ? 'border-[#F09000] bg-[#F09000]' : 'border-[#E5E5E6] bg-white',
                )}
              >
                {newIsFreeShipping && <Check size={12} className='text-white' strokeWidth={3} />}
              </button>
            </div>
            <div className='w-28 shrink-0 px-2'>
              <div className='flex items-center gap-3'>
                <button
                  onClick={handleAdd}
                  disabled={createZone.isPending}
                  className='text-[#165DD0] transition-colors hover:text-[#0b3d8c] font-semibold text-sm'
                >
                  {createZone.isPending ? 'Saving...' : 'Add Row +'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded border border-[#E5E5E6] bg-white p-6 shadow-xl'>
            <div className='flex items-start justify-between mb-4'>
              <h3 className='text-lg font-semibold text-black'>Delete Zone</h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setZoneToDelete(null);
                }}
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-sm text-[#42454D] mb-6 leading-normal'>
              Are you sure you want to delete this shipping zone? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setZoneToDelete(null);
                }}
                disabled={deleteZone.isPending}
                className='rounded-sm border border-[#E5E5E6] px-4 py-2 text-sm font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteZone.isPending}
                className='rounded-sm bg-[#CB1B1B] px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none'
              >
                {deleteZone.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && zoneToView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-lg rounded border border-[#E5E5E6] bg-white p-6 shadow-xl'>
            <div className='flex items-start justify-between mb-6'>
              <h3 className='text-lg font-semibold text-black'>Zone Details</h3>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setZoneToView(null);
                }}
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>

            <div className='flex flex-col gap-4 mb-6'>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Zone Name</span>
                <p className='text-base font-normal text-black'>{zoneToView.zoneName}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Countries</span>
                <p className='text-base font-normal text-black'>{zoneToView.countries}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Base Rate</span>
                <p className='text-base font-normal text-black'>${zoneToView.baseRate}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Per KG Rate</span>
                <p className='text-base font-normal text-black'>${zoneToView.perKgRate}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-[#848995]'>Free Shipping</span>
                <p className='text-base font-normal text-black'>
                  {zoneToView.isFreeShipping ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            <div className='flex justify-end'>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setZoneToView(null);
                }}
                className='rounded-sm bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-none'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && zoneToEdit && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-lg rounded border border-[#E5E5E6] bg-white p-6 shadow-xl'>
            <div className='flex items-start justify-between mb-6'>
              <h3 className='text-lg font-semibold text-black'>Edit Zone</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setZoneToEdit(null);
                }}
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>

            <div className='flex flex-col gap-4 mb-6'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-normal text-black'>Zone Name</label>
                <input
                  type='text'
                  value={zoneToEdit.zoneName || ''}
                  onChange={(e) => setZoneToEdit({ ...zoneToEdit, zoneName: e.target.value })}
                  placeholder='Enter zone name'
                  className='h-10 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-normal text-black'>Countries</label>
                <input
                  type='text'
                  value={zoneToEdit.countries || ''}
                  onChange={(e) => setZoneToEdit({ ...zoneToEdit, countries: e.target.value })}
                  placeholder='Enter countries (e.g., USA, Canada)'
                  className='h-10 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-normal text-black'>Base Rate</label>
                <input
                  type='number'
                  step='0.01'
                  value={zoneToEdit.baseRate || ''}
                  onChange={(e) =>
                    setZoneToEdit({ ...zoneToEdit, baseRate: parseFloat(e.target.value) || 0 })
                  }
                  placeholder='Enter base rate (e.g., 5.00)'
                  className='h-10 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-normal text-black'>Per KG Rate</label>
                <input
                  type='number'
                  step='0.01'
                  value={zoneToEdit.perKgRate || ''}
                  onChange={(e) =>
                    setZoneToEdit({ ...zoneToEdit, perKgRate: parseFloat(e.target.value) || 0 })
                  }
                  placeholder='Enter per KG rate (e.g., 2.00)'
                  className='h-10 w-full rounded-sm border border-[#E5E5E6] bg-white px-3 text-sm text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-normal text-black'>Free Shipping</label>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() =>
                      setZoneToEdit({ ...zoneToEdit, isFreeShipping: !zoneToEdit.isFreeShipping })
                    }
                    className={cn(
                      'flex size-5 cursor-pointer items-center justify-center rounded-sm border transition-colors hover:border-[#848995]',
                      zoneToEdit.isFreeShipping
                        ? 'border-[#F09000] bg-[#F09000]'
                        : 'border-[#E5E5E6] bg-white',
                    )}
                  >
                    {zoneToEdit.isFreeShipping && (
                      <Check size={14} className='text-white' strokeWidth={3} />
                    )}
                  </button>
                  <span className='text-sm text-[#42454D]'>Enable free shipping for this zone</span>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setZoneToEdit(null);
                }}
                disabled={updateZone.isPending}
                className='rounded-sm border border-[#E5E5E6] px-4 py-2 text-sm font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={updateZone.isPending}
                className='rounded-sm bg-[#F09000] px-4 py-2 text-sm font-medium text-black hover:bg-[#D98200] focus-visible:outline-none'
              >
                {updateZone.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
