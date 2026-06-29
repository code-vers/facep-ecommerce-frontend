'use client';

import Image from 'next/image';
import { CircleCheck } from 'lucide-react';

export default function StorefrontForm() {
  return (
    <div className='flex w-full flex-col items-start border border-[#E5E5E6] bg-white p-[24px] rounded-[4px] gap-[24px]'>
      
      {/* Basic Store Information */}
      <div className='flex w-full flex-col items-start gap-[18px]'>
        <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
          Basic Store Information
        </h2>
        
        <div className='flex w-full flex-col items-start gap-[18px]'>
          
          {/* Store Logo */}
          <div className='flex w-full flex-col items-start gap-[12px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Store Logo
            </label>
            <div className='flex items-center gap-[12px]'>
              <div className='relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[4px] bg-gray-100'>
                <Image
                  src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
                  alt='Store Logo'
                  fill
                  className='object-cover'
                />
              </div>
              <button className='text-[16px] font-normal leading-[1.2] text-[#165DD0] underline decoration-solid decoration-from-font hover:text-blue-800 transition-colors'>
                Change Store Logo
              </button>
            </div>
          </div>

          {/* Store Banner */}
          <div className='flex w-full flex-col items-start gap-[8px]'>
            <div className='flex items-start gap-[32px]'>
              <label className='text-[16px] font-normal leading-[1.2] text-black'>
                Store Banner
              </label>
              <button className='text-[16px] font-normal leading-[1.2] text-[#165DD0] underline decoration-solid decoration-from-font hover:text-blue-800 transition-colors'>
                Update Banner
              </button>
            </div>
            <div className='flex w-full flex-col items-center rounded-[2px] border border-dashed border-[#E5E5E6] px-[24px] py-[12px]'>
              <div className='relative h-[499px] w-full overflow-hidden bg-white'>
                {/* Banner Content Container matches Figma height perfectly */}
                <div className='absolute left-0 top-[11px] h-[478px] w-full overflow-hidden rounded-[4px]'>
                  <Image
                    src='https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=1400&auto=format&fit=crop'
                    alt='Store Banner Background'
                    fill
                    className='object-cover'
                  />
                  {/* Overlay text */}
                  <div className='absolute left-[130px] top-[179px] flex flex-col items-start gap-[24px] text-white'>
                    <p className='font-[Arial] text-[48px] font-bold leading-[1.1] tracking-[-0.96px]'>
                      Buy Your Favorite Plant
                    </p>
                    <p className='font-[Arial] text-[64px] font-bold leading-none tracking-[-1.92px]'>
                      From Plant home
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Name */}
          <div className='flex w-full flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Store Name
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <input
                type='text'
                defaultValue='Plant House'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none'
              />
            </div>
          </div>

          {/* Store Description */}
          <div className='flex w-full flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Store Description
            </label>
            <div className='flex h-[84px] w-full items-start overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <textarea
                defaultValue='Brief product description'
                className='h-full w-full resize-none bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none'
              />
            </div>
          </div>

          {/* Contact Email & Phone */}
          <div className='flex w-full items-start gap-[18px]'>
            <div className='flex flex-[1_0_0] flex-col items-start gap-[8px]'>
              <label className='text-[16px] font-normal leading-[1.2] text-black'>
                Contact Email
              </label>
              <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
                <input
                  type='email'
                  defaultValue='support@planthome.com'
                  className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none'
                />
              </div>
            </div>
            <div className='flex flex-[1_0_0] flex-col items-start gap-[8px]'>
              <label className='text-[16px] font-normal leading-[1.2] text-black'>
                Contact Phone
              </label>
              <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
                <input
                  type='tel'
                  defaultValue='+1 (555) 123-4567'
                  className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none'
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Store Policies */}
      <div className='flex w-full flex-col items-start gap-[18px]'>
        <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
          Store Policies
        </h2>
        
        <div className='flex w-full flex-col items-start gap-[24px]'>
          
          {/* Return Policy */}
          <div className='flex w-full flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Return Policy
            </label>
            <div className='flex h-[84px] w-full items-start overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <textarea
                defaultValue='Return Policy'
                className='h-full w-full resize-none bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none'
              />
            </div>
          </div>

          {/* Shipping Policy */}
          <div className='flex w-full flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Shipping Policy
            </label>
            <div className='flex h-[84px] w-full items-start overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <textarea
                defaultValue='Shipping Policy'
                className='h-full w-full resize-none bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none'
              />
            </div>
          </div>

          {/* Warranty Information */}
          <div className='flex w-full flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Warranty Information
            </label>
            <div className='flex h-[84px] w-full items-start overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <textarea
                defaultValue='Warranty Information'
                className='h-full w-full resize-none bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none'
              />
            </div>
          </div>

          {/* Save Changes Button */}
          <div className='flex w-full justify-end'>
            <button className='flex h-[36px] items-center justify-center gap-[4px] rounded-[2px] border border-[#F09000] bg-[#F09000] px-[12px] py-[8px] transition-colors hover:bg-[#d88200]'>
              <span className='whitespace-nowrap text-[14px] font-normal leading-[1.2] text-black'>
                Save Changes
              </span>
              <CircleCheck size={16} className='text-black' />
            </button>
          </div>

        </div>
      </div>
      
    </div>
  );
}
