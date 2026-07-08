'use client';

import { Check, Eye, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Zone {
  id: number;
  zone: string;
  countries: string;
  baseRate: string;
  perKg: string;
  freeShipping: boolean;
}

const mockZones: Zone[] = [
  {
    id: 1,
    zone: 'Domestic',
    countries: 'USA, Canada',
    baseRate: '$5.00',
    perKg: '$2.00',
    freeShipping: true,
  },
  {
    id: 2,
    zone: 'International - Asia',
    countries: 'Bangladesh, India, Pakistan',
    baseRate: '$10.00',
    perKg: '$4.00',
    freeShipping: false,
  },
  {
    id: 3,
    zone: 'International - Europe',
    countries: 'UK, Germany, France',
    baseRate: '$20.00',
    perKg: '$8.00',
    freeShipping: false,
  },
  {
    id: 4,
    zone: 'International - Others',
    countries: 'Australia, New Zealand',
    baseRate: '$30.00',
    perKg: '$10.00',
    freeShipping: true,
  },
];

export default function ShippingZones() {
  const [zones, setZones] = useState<Zone[]>(mockZones);
  
  // States for new row inputs
  const [newZone, setNewZone] = useState('');
  const [newCountries, setNewCountries] = useState('');
  const [newBaseRate, setNewBaseRate] = useState('');
  const [newPerKg, setNewPerKg] = useState('');
  const [newFreeShipping, setNewFreeShipping] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<number | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [zoneToEdit, setZoneToEdit] = useState<Zone | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [zoneToView, setZoneToView] = useState<Zone | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdd = () => {
    // Add either the input values or placeholders if empty
    const zoneToAdd = {
      id: Date.now(),
      zone: newZone || 'New Zone',
      countries: newCountries || 'Country',
      baseRate: newBaseRate || '$0.00',
      perKg: newPerKg || '$0.00',
      freeShipping: newFreeShipping,
    };
    setZones([...zones, zoneToAdd]);
    
    // Reset inputs
    setNewZone('');
    setNewCountries('');
    setNewBaseRate('');
    setNewPerKg('');
    setNewFreeShipping(false);
    showToast('Shipping zone added successfully');
  };

  const confirmDelete = () => {
    if (zoneToDelete !== null) {
      setZones(zones.filter((z) => z.id !== zoneToDelete));
      setIsDeleteModalOpen(false);
      setZoneToDelete(null);
      showToast('Shipping zone deleted successfully');
    }
  };

  const handleEditSave = () => {
    if (zoneToEdit) {
      setZones(zones.map(z => z.id === zoneToEdit.id ? zoneToEdit : z));
      setIsEditModalOpen(false);
      setZoneToEdit(null);
      showToast('Shipping zone updated successfully');
    }
  };

  const handleToggleFreeShipping = (id: number) => {
    setZones(
      zones.map((z) =>
        z.id === id ? { ...z, freeShipping: !z.freeShipping } : z
      )
    );
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[24px] rounded-[4px] border border-[#E5E5E6] bg-white p-[16px]'>
      {/* Header */}
      <div className='flex w-full shrink-0 items-center justify-between'>
        <p className='whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-black'>
          Shipping Zones & Rates
        </p>
        <button 
          onClick={handleAdd}
          className='text-[14px] font-normal text-[#165DD0] transition-colors hover:underline focus-visible:outline-none'>
          Add Row +
        </button>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-[1000px] flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-[34px] w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-[8px]'>
            <div className='w-[200px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Zone
              </p>
            </div>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Countries
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Base Rate
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Per KG
              </p>
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Free Shipping
              </p>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {zones.map((zone) => (
            <div
              key={zone.id}
              className='flex h-[48px] w-full shrink-0 items-center border-b border-[#E5E5E6] px-[8px] transition-colors hover:bg-gray-50'
            >
              <div className='w-[200px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {zone.zone}
                </p>
              </div>
              <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {zone.countries}
                </p>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {zone.baseRate}
                </p>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {zone.perKg}
                </p>
              </div>
              <div className='w-[150px] shrink-0 px-[8px]'>
                <button
                  onClick={() => handleToggleFreeShipping(zone.id)}
                  className={cn(
                    'flex size-[16px] items-center justify-center rounded-[2px] border transition-colors',
                    zone.freeShipping
                      ? 'border-[#F09000] bg-[#F09000]'
                      : 'border-[#E5E5E6] bg-white'
                  )}
                >
                  {zone.freeShipping && <Check size={12} className='text-white' strokeWidth={3} />}
                </button>
              </div>
              <div className='w-[120px] shrink-0 px-[8px]'>
                <div className='flex items-center gap-[12px]'>
                  <button onClick={() => {
                    setZoneToView(zone);
                    setIsViewModalOpen(true);
                  }} className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'>
                    <Eye size={14} />
                  </button>
                  <button onClick={() => {
                    setZoneToEdit(zone);
                    setIsEditModalOpen(true);
                  }} className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none'>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => {
                    setZoneToDelete(zone.id);
                    setIsDeleteModalOpen(true);
                  }} className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none'>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Input Row */}
          <div className='flex h-[60px] w-full shrink-0 items-center px-[8px] transition-colors'>
            <div className='w-[200px] shrink-0 px-[8px]'>
              <input
                type='text'
                placeholder='Zone'
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
                className='h-[34px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[13px] text-[#42454D] placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none'
              />
            </div>
            <div className='min-w-[200px] flex-[1_0_0] px-[8px]'>
              <input
                type='text'
                placeholder='Countries'
                value={newCountries}
                onChange={(e) => setNewCountries(e.target.value)}
                className='h-[34px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[13px] text-[#42454D] placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none'
              />
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <input
                type='text'
                placeholder='Base rate'
                value={newBaseRate}
                onChange={(e) => setNewBaseRate(e.target.value)}
                className='h-[34px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[13px] text-[#42454D] placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none'
              />
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <input
                type='text'
                placeholder='per kg rate'
                value={newPerKg}
                onChange={(e) => setNewPerKg(e.target.value)}
                className='h-[34px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[13px] text-[#42454D] placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none'
              />
            </div>
            <div className='w-[150px] shrink-0 px-[8px]'>
              <button 
                onClick={() => setNewFreeShipping(!newFreeShipping)}
                className={cn(
                  'flex size-[16px] cursor-pointer items-center justify-center rounded-[2px] border transition-colors hover:border-[#848995]',
                  newFreeShipping ? 'border-[#F09000] bg-[#F09000]' : 'border-[#E5E5E6] bg-white'
                )}
              >
                {newFreeShipping && <Check size={12} className='text-white' strokeWidth={3} />}
              </button>
            </div>
            <div className='w-[120px] shrink-0 px-[8px]'>
              <div className='flex items-center gap-[12px]'>
                <button onClick={handleAdd} className='text-[#42454D] transition-colors hover:text-black font-semibold text-[13px]'>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[400px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[16px]'>
              <h3 className='text-[18px] font-semibold text-black'>Delete Zone</h3>
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
            <p className='text-[14px] text-[#42454D] mb-[24px] leading-[1.5]'>
              Are you sure you want to delete this shipping zone? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setZoneToDelete(null);
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
      {isViewModalOpen && zoneToView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>Zone Details</h3>
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
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Zone</span>
                <p className='text-[15px] font-normal text-black'>{zoneToView.zone}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Countries</span>
                <p className='text-[15px] font-normal text-black'>{zoneToView.countries}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Base Rate</span>
                <p className='text-[15px] font-normal text-black'>{zoneToView.baseRate}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Per KG Rate</span>
                <p className='text-[15px] font-normal text-black'>{zoneToView.perKg}</p>
              </div>
              <div className='flex flex-col gap-[8px]'>
                <span className='text-[13px] font-medium text-[#848995]'>Free Shipping</span>
                <p className='text-[15px] font-normal text-black'>{zoneToView.freeShipping ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className='flex justify-end'>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setZoneToView(null);
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
      {isEditModalOpen && zoneToEdit && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[500px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[24px]'>
              <h3 className='text-[18px] font-semibold text-black'>Edit Zone</h3>
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
            
            <div className='flex flex-col gap-[16px] mb-[24px]'>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Zone</label>
                <input
                  type='text'
                  value={zoneToEdit.zone}
                  onChange={(e) => setZoneToEdit({ ...zoneToEdit, zone: e.target.value })}
                  placeholder='Enter zone name'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Countries</label>
                <input
                  type='text'
                  value={zoneToEdit.countries}
                  onChange={(e) => setZoneToEdit({ ...zoneToEdit, countries: e.target.value })}
                  placeholder='Enter countries (e.g., USA, Canada)'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Base Rate</label>
                <input
                  type='text'
                  value={zoneToEdit.baseRate}
                  onChange={(e) => setZoneToEdit({ ...zoneToEdit, baseRate: e.target.value })}
                  placeholder='Enter base rate (e.g., $5.00)'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Per KG Rate</label>
                <input
                  type='text'
                  value={zoneToEdit.perKg}
                  onChange={(e) => setZoneToEdit({ ...zoneToEdit, perKg: e.target.value })}
                  placeholder='Enter per KG rate (e.g., $2.00)'
                  className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                />
              </div>
              <div className='flex flex-col gap-[8px]'>
                <label className='text-[14px] font-normal text-black'>Free Shipping</label>
                <div className='flex items-center gap-[8px]'>
                  <button 
                    onClick={() => setZoneToEdit({ ...zoneToEdit, freeShipping: !zoneToEdit.freeShipping })}
                    className={cn(
                      'flex size-[20px] cursor-pointer items-center justify-center rounded-[2px] border transition-colors hover:border-[#848995]',
                      zoneToEdit.freeShipping ? 'border-[#F09000] bg-[#F09000]' : 'border-[#E5E5E6] bg-white'
                    )}
                  >
                    {zoneToEdit.freeShipping && <Check size={14} className='text-white' strokeWidth={3} />}
                  </button>
                  <span className='text-[14px] text-[#42454D]'>Enable free shipping for this zone</span>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setZoneToEdit(null);
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
