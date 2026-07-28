'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import { useEffect } from 'react';
import { useProductFormStore } from '../../../store/useProductFormStore';

export default function PricingAndInventory() {
  const store = useProductFormStore();

  useEffect(() => {
    const base = Number(store.basePrice);
    const old = Number(store.oldPrice);

    if (base > 0 && old > 0 && old > base) {
      if (store.discountType === 'FIXED') {
        const diff = Number((old - base).toFixed(2));
        if (store.discountValue !== diff) {
          store.setField('discountValue', diff);
        }
      } else if (store.discountType === 'PERCENTAGE') {
        const percentage = Number((((old - base) / old) * 100).toFixed(2));
        if (store.discountValue !== percentage) {
          store.setField('discountValue', percentage);
        }
      }
    }
  }, [
    store.basePrice,
    store.oldPrice,
    store.discountType,
    store.discountValue,
    store.setField,
    store,
  ]);

  return (
    <div className='border border-[#e5e5e6] border-solid bg-white flex flex-col items-start w-full relative shrink-0'>
      <div className='flex flex-col gap-6 md:gap-6 items-start p-4 md:p-6 w-full relative shrink-0'>
        {/* ── SECTION 1: Pricing & Deals ── */}
        <div className='flex flex-col gap-4.5 items-start w-full'>
          <h3 className='font-semibold leading-[1.2] text-[20px] text-black font-sans'>
            Pricing & Deals
          </h3>

          <div className='flex flex-col gap-4 md:gap-4.5 w-full'>
            {/* Base Price & Old Price */}
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Base Price</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.basePrice}
                    onChange={(e) =>
                      store.setField('basePrice', e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder='0.00'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Old Price</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.oldPrice}
                    onChange={(e) =>
                      store.setField('oldPrice', e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder='0.00'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>

            {/* Discount Type & Discount Value */}
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
              <div className='flex flex-col gap-2 flex-1 w-full relative'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Discount Type</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center justify-between px-3 py-2.5 rounded-sm w-full relative'>
                  <select
                    value={store.discountType}
                    onChange={(e) => store.setField('discountType', e.target.value as any)}
                    className='w-full bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6'
                  >
                    <option value='' disabled>
                      Select discount type
                    </option>
                    <option value='PERCENTAGE'>Percentage Discount (%)</option>
                    <option value='FIXED'>Fixed Amount Discount ($)</option>
                  </select>
                  <ChevronDown className='size-4 text-black absolute right-3 pointer-events-none' />
                </div>
              </div>

              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Discount Value</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.discountValue}
                    onChange={(e) =>
                      store.setField('discountValue', e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder={store.discountType === 'PERCENTAGE' ? '0%' : '0.00'}
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>

            {/* Deal Badge Text */}
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-normal leading-[1.2] text-[16px] text-black'>Deal Badge Text</p>
              <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                <input
                  type='text'
                  value={store.dealBadgeText}
                  onChange={(e) => store.setField('dealBadgeText', e.target.value)}
                  placeholder='Enter deal badge text (e.g. Black Friday Sale)'
                  className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                />
              </div>
            </div>

            {/* Deal Start & End Date */}
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Deal start Date</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center gap-2 px-3 py-2.5 rounded-sm w-full relative'>
                  <Calendar size={16} className='text-[#848995] shrink-0' />
                  <input
                    type='date'
                    value={store.dealStartDate}
                    onChange={(e) => store.setField('dealStartDate', e.target.value)}
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Deal End Date</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center gap-2 px-3 py-2.5 rounded-sm w-full relative'>
                  <Calendar size={16} className='text-[#848995] shrink-0' />
                  <input
                    type='date'
                    value={store.dealEndDate}
                    onChange={(e) => store.setField('dealEndDate', e.target.value)}
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Tax & Additional Charges ── */}
        <div className='flex flex-col gap-4.5 items-start w-full mt-4'>
          <h3 className='font-semibold leading-[1.2] text-[20px] text-black font-sans'>
            Tax & Additional Charges
          </h3>

          <div className='flex flex-col gap-4 md:gap-4.5 w-full'>
            {/* Tax Included & VAT / GST */}
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Tax Amount ($)</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.taxAmount}
                    onChange={(e) =>
                      store.setField('taxAmount', e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder='0.00'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>VAT / GST (%)</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.vatGst}
                    onChange={(e) =>
                      store.setField('vatGst', e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder='0.00'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>

            {/* Import Charges & Handling Fee */}
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>
                  Import Charges ($)
                </p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.importCharges}
                    onChange={(e) =>
                      store.setField('importCharges', e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder='0.00'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2 flex-1 w-full'>
                <p className='font-normal leading-[1.2] text-[16px] text-black'>Handling Fee ($)</p>
                <div className='border border-[#e5e5e6] bg-white flex items-center px-3 py-2.5 rounded-sm w-full'>
                  <input
                    type='number'
                    value={store.handlingFee}
                    onChange={(e) =>
                      store.setField('handlingFee', e.target.value ? Number(e.target.value) : '')
                    }
                    placeholder='0.00'
                    className='w-full bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
