'use client';

import Image from 'next/image';
import { Camera, CircleCheck } from 'lucide-react';

export default function ProfileSettingsForm() {
  return (
    <div className='flex w-full flex-col items-end border border-[#E5E5E6] bg-white p-[24px] rounded-[4px] gap-[36px]'>
      
      {/* Personal Information */}
      <div className='flex w-full flex-col items-start gap-[24px]'>
        <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
          Personal Information
        </h2>
        
        <div className='flex w-full flex-col items-start gap-[12px]'>
          <div className='relative h-[86px] w-[86px] shrink-0'>
            <div className='relative h-full w-full overflow-hidden rounded-full bg-gray-100'>
              <Image
                src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
                alt='Seller Avatar'
                fill
                className='object-cover'
              />
            </div>
            {/* Camera Badge */}
            <button className='absolute bottom-0 right-0 flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#DEC33A] border-[2.5px] border-white hover:bg-[#c9b134] transition-colors'>
              <Camera size={12} className='text-black' />
            </button>
          </div>
          <label className='text-[16px] font-normal leading-[1.2] text-black'>
            Seller Name
          </label>
        </div>

        <div className='flex w-full items-start gap-[24px]'>
          <div className='flex flex-[1_0_0] flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Full Name
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <input
                type='text'
                placeholder='e.g. Alexander von Berg'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>
          <div className='flex flex-[1_0_0] flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Email
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <input
                type='email'
                placeholder='alexander@domain.com'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>
        </div>

        <div className='flex w-full items-start gap-[24px]'>
          <div className='flex flex-[1_0_0] flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Contact Number
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <input
                type='tel'
                placeholder='+41 00 000 00 00'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>
          <div className='flex flex-[1_0_0] flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Address
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <input
                type='text'
                placeholder='123 Edelweiss Strasse, Zurich'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>
        </div>

      </div>

      {/* Change Password */}
      <div className='flex w-full flex-col items-start gap-[24px]'>
        <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
          Change Password
        </h2>
        
        <div className='flex w-full flex-col items-start gap-[24px]'>
          
          <div className='flex w-full flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Type Password
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <input
                type='password'
                placeholder='*********'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>

          <div className='flex w-full flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Type New Password
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <input
                type='password'
                placeholder='*********'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>

          <div className='flex w-full flex-col items-start gap-[8px]'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Confirm New Password
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px]'>
              <input
                type='password'
                placeholder='*********'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>

        </div>
      </div>

      {/* Save Changes Button */}
      <button className='flex h-[36px] items-center justify-center gap-[4px] rounded-[2px] border border-[#F09000] bg-[#F09000] px-[12px] py-[8px] transition-colors hover:bg-[#d88200]'>
        <span className='whitespace-nowrap text-[14px] font-normal leading-[1.2] text-black'>
          Save Changes
        </span>
        <CircleCheck size={16} className='text-black' />
      </button>

    </div>
  );
}
