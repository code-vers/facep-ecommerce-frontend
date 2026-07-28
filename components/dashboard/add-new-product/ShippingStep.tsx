'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { apiClient } from '../../../lib/api/axios';
import { useProductFormStore } from '../../../store/useProductFormStore';

export default function ShippingStep() {
  const store = useProductFormStore();

  const { data: shippingZonesData } = useQuery({
    queryKey: ['shipping-zones'],
    queryFn: async () => {
      const res = await apiClient.get('/shipping-zones');
      return res.data?.data || [];
    },
  });

  const { data: couriersData } = useQuery({
    queryKey: ['couriers'],
    queryFn: async () => {
      const res = await apiClient.get('/couriers');
      return res.data?.data || [];
    },
  });

  const toggleOption = (
    key: 'deliveryStandard' | 'deliveryCod' | 'deliveryExpress' | 'deliveryReturnPickup',
  ) => {
    store.setField(key, !store[key]);
  };

  return (
    <div className='border border-[#e5e5e6] border-solid bg-white flex flex-col items-start w-full relative shrink-0'>
      <div className='flex flex-col gap-6 md:gap-6 items-start p-4 md:p-6 w-full relative shrink-0'>
        {/* ── SECTION: Shipping & Delivery ── */}
        <div className='flex flex-col gap-4.5 items-start w-full'>
          <h3 className='font-semibold leading-[1.2] text-[20px] text-black font-sans'>
            Shipping & Delivery
          </h3>

          <div className='flex flex-col gap-4 md:gap-4.5 w-full'>
            {/* Ships From */}
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-normal leading-[1.2] text-[16px] text-black'>Ships From</p>
              <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                <input
                  type='text'
                  value={store.shipsFrom}
                  onChange={(e) => store.setField('shipsFrom', e.target.value)}
                  placeholder='Enter departure zip code or city'
                  className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                />
              </div>
            </div>

            {/* Min & Max Delivery Days */}
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>
                  Minimum Delivery Days
                </p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.minDeliveryDays}
                    onChange={(e) =>
                      store.setField(
                        'minDeliveryDays',
                        e.target.value ? Number(e.target.value) : '',
                      )
                    }
                    placeholder='Min days'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>
                  Maximum Delivery Days
                </p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.maxDeliveryDays}
                    onChange={(e) =>
                      store.setField(
                        'maxDeliveryDays',
                        e.target.value ? Number(e.target.value) : '',
                      )
                    }
                    placeholder='Max days'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>

            {/* Shipping Fee Type (Radio option group) */}
            <div className='flex flex-col gap-3 w-full'>
              <p className='font-normal leading-[1.2] text-[16px] text-[#101828]'>
                Shipping Fee Type
              </p>
              <div className='flex items-center gap-6'>
                {['FREE', 'STANDARD', 'PREDEFINED'].map((feeType) => (
                  <label
                    key={feeType}
                    className='flex items-center gap-3 cursor-pointer select-none'
                  >
                    <input
                      type='radio'
                      name='shippingFeeType'
                      checked={store.shippingFeeType === feeType}
                      onChange={() => store.setField('shippingFeeType', feeType as any)}
                      className='sr-only'
                    />
                    <div
                      className={`size-4.5 rounded-full border flex items-center justify-center transition-all ${
                        store.shippingFeeType === feeType ? 'border-[#f09000]' : 'border-black'
                      }`}
                    >
                      {store.shippingFeeType === feeType && (
                        <div className='size-2 rounded-full bg-[#f09000]' />
                      )}
                    </div>
                    <span className='text-[14px] font-normal leading-[1.3] text-[#344054] capitalize'>
                      {feeType.toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping Cost & Predefined Selects depending on type */}
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full mt-2'>
              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>
                  Shipping Cost{' '}
                  {store.shippingFeeType === 'PREDEFINED' ? '(Handled by provider)' : ''}
                </p>
                <div
                  className={`border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full ${store.shippingFeeType !== 'STANDARD' ? 'opacity-50 bg-gray-50' : ''}`}
                >
                  <input
                    type='number'
                    value={store.shippingCost}
                    onChange={(e) =>
                      store.setField('shippingCost', e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder='0.00'
                    disabled={store.shippingFeeType !== 'STANDARD'}
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] disabled:cursor-not-allowed'
                  />
                </div>
              </div>

              {store.shippingFeeType === 'PREDEFINED' && (
                <>
                  <div className='flex flex-col gap-2 flex-1 w-full relative'>
                    <p className='font-normal leading-[1.2] text-[16px] text-black'>
                      Shipping Zone
                    </p>
                    <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                      <select
                        value={store.shippingZoneId}
                        onChange={(e) => store.setField('shippingZoneId', e.target.value)}
                        className='w-full bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black'
                      >
                        <option value=''>Select Zone (Optional)</option>
                        {shippingZonesData?.map((zone: any) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.zoneName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className='size-4 text-[#848995] absolute right-3 pointer-events-none' />
                    </div>
                  </div>

                  <div className='flex flex-col gap-2 flex-1 w-full relative'>
                    <p className='font-normal leading-[1.2] text-[16px] text-black'>Courier</p>
                    <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                      <select
                        value={store.courierId}
                        onChange={(e) => store.setField('courierId', e.target.value)}
                        className='w-full bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black'
                      >
                        <option value=''>Select Courier (Optional)</option>
                        {couriersData?.map((courier: any) => (
                          <option key={courier.id} value={courier.id}>
                            {courier.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className='size-4 text-[#848995] absolute right-3 pointer-events-none' />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Delivery Options Checkbox Group */}
            <div className='flex flex-col gap-3 w-full mt-2'>
              <p className='font-normal leading-[1.2] text-[16px] text-[#101828]'>
                Delivery Options
              </p>
              <div className='flex flex-wrap items-center gap-4 md:gap-6 mt-1'>
                {(
                  [
                    { key: 'deliveryStandard', label: 'Standard Delivery' },
                    { key: 'deliveryCod', label: 'Cash On Delivery' },
                    { key: 'deliveryExpress', label: 'Express Delivery' },
                    { key: 'deliveryReturnPickup', label: 'Return Pickup Available' },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.key}
                    className='flex items-center gap-3 cursor-pointer select-none'
                  >
                    <input
                      type='checkbox'
                      checked={store[option.key] as boolean}
                      onChange={() => toggleOption(option.key)}
                      className='sr-only'
                    />
                    <div
                      className={`size-4 rounded-lg border flex items-center justify-center transition-all ${
                        store[option.key]
                          ? 'bg-[#f09000] border-[#f09000] text-white'
                          : 'border-black bg-white'
                      }`}
                    >
                      {store[option.key] && (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='3'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='size-3'
                        >
                          <polyline points='20 6 9 17 4 12'></polyline>
                        </svg>
                      )}
                    </div>
                    <span className='text-[14px] font-normal leading-[1.3] text-[#344054]'>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
