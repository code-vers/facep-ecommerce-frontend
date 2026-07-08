'use client';

import { Check, Eye, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const mockZones = [
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
  const [zones, setZones] = useState(mockZones);
  
  // States for new row inputs
  const [newZone, setNewZone] = useState('');
  const [newCountries, setNewCountries] = useState('');
  const [newBaseRate, setNewBaseRate] = useState('');
  const [newPerKg, setNewPerKg] = useState('');
  const [newFreeShipping, setNewFreeShipping] = useState(false);

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
  };

  const handleDelete = (id: number) => {
    setZones(zones.filter((z) => z.id !== id));
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
                  <button onClick={() => alert(`View ${zone.zone}`)} className='text-[#42454D] transition-colors hover:text-black'>
                    <Eye size={14} />
                  </button>
                  <button onClick={() => alert(`Edit ${zone.zone}`)} className='text-[#42454D] transition-colors hover:text-black'>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(zone.id)} className='text-[#CB1B1B] transition-colors hover:text-red-700'>
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
    </div>
  );
}
