'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Camera, ChevronDown, CircleCheck } from 'lucide-react';
import Image from 'next/image';

export default function ProfileSettingsForm() {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className='flex w-full flex-col items-end border border-[#E5E5E6] bg-white p-4 md:p-6 2xl:p-6 rounded-lg gap-9'>
      {/* Personal Information */}
      <div className='flex w-full flex-col items-start gap-6'>
        <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
          {isAdmin ? 'Profile Settings' : 'Personal Information'}
        </h2>

        <div className='flex w-full flex-col items-start gap-3'>
          <div className='relative h-21.5 w-21.5 shrink-0'>
            <div className='relative h-full w-full overflow-hidden rounded-full bg-gray-100'>
              <Image
                src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
                alt='Seller Avatar'
                fill
                className='object-cover'
              />
            </div>
            {/* Camera Badge */}
            <button className='absolute bottom-0 right-0 flex h-6.25 w-6.25 items-center justify-center rounded-full bg-[#DEC33A] border-[2.5px] border-white hover:bg-[#c9b134] transition-colors'>
              <Camera size={12} className='text-black' />
            </button>
          </div>
          <label className='text-[16px] font-normal leading-[1.2] text-black'>
            {isAdmin ? 'Admin Name' : 'Seller Name'}
          </label>
        </div>

        <div className='flex w-full flex-col md:flex-row items-start gap-4 2xl:gap-6'>
          <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>Full Name</label>
            <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
              <input
                type='text'
                placeholder='e.g. Alexander von Berg'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>
          <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>Email</label>
            <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
              <input
                type='email'
                placeholder='alexander@domain.com'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col md:flex-row items-start gap-4 2xl:gap-6'>
          <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Contact Number
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
              <input
                type='tel'
                placeholder='+41 00 000 00 00'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>
          <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>Address</label>
            <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
              <input
                type='text'
                placeholder='123 Edelweiss Strasse, Zurich'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <>
          {/* Business Settings */}
          <div className='flex w-full flex-col items-start gap-6'>
            <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
              Business Settings
            </h2>

            <div className='flex w-full flex-col md:flex-row items-start gap-4 2xl:gap-6'>
              <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
                <label className='text-[16px] font-normal leading-[1.2] text-black'>
                  Site Name
                </label>
                <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
                  <input
                    type='text'
                    placeholder='Business name'
                    className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
                  />
                </div>
              </div>
              <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
                <label className='text-[16px] font-normal leading-[1.2] text-black'>
                  Admin Email
                </label>
                <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
                  <input
                    type='email'
                    placeholder='alexander@domain.com'
                    className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>

            <div className='flex w-full flex-col md:flex-row items-start gap-4 2xl:gap-6'>
              <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
                <label className='text-[16px] font-normal leading-[1.2] text-black'>
                  Support Email
                </label>
                <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
                  <input
                    type='email'
                    placeholder='alexander@domain.com'
                    className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
                  />
                </div>
              </div>
              <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
                <label className='text-[16px] font-normal leading-[1.2] text-black'>Address</label>
                <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
                  <input
                    type='text'
                    placeholder='123 Edelweiss Strasse, Zurich'
                    className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>

            <div className='flex w-full flex-col md:flex-row items-start gap-4 2xl:gap-6'>
              <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
                <label className='text-[16px] font-normal leading-[1.2] text-black'>
                  Default Currency
                </label>
                <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
                  <p className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#848995]'>
                    $ (Dollar)
                  </p>
                  <ChevronDown size={16} className='text-[#848995]' />
                </div>
              </div>
              <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
                <label className='text-[16px] font-normal leading-[1.2] text-black'>
                  Default Time zone
                </label>
                <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
                  <p className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#848995]'>
                    GMT +6
                  </p>
                  <ChevronDown size={16} className='text-[#848995]' />
                </div>
              </div>
            </div>
          </div>

          {/* Platform Commission */}
          <div className='flex w-full flex-col items-start gap-6'>
            <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
              Platform Commission
            </h2>
            <div className='flex w-full flex-col md:flex-row items-start gap-4 2xl:gap-6'>
              <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
                <label className='text-[16px] font-normal leading-[1.2] text-black'>
                  Commission Rate (%)
                </label>
                <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
                  <input
                    type='text'
                    placeholder='10%'
                    className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
                  />
                </div>
              </div>
              <div className='flex w-full md:w-auto md:flex-[1_0_0] flex-col items-start gap-2'>
                <label className='text-[16px] font-normal leading-[1.2] text-black'>
                  Payment Gateway Fee (%)
                </label>
                <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
                  <input
                    type='text'
                    placeholder='2%'
                    className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Change Password */}
      <div className='flex w-full flex-col items-start gap-6'>
        <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>Change Password</h2>

        <div className='flex w-full flex-col items-start gap-6'>
          <div className='flex w-full flex-col items-start gap-2'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Type Password
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
              <input
                type='password'
                placeholder='*********'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>

          <div className='flex w-full flex-col items-start gap-2'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Type New Password
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
              <input
                type='password'
                placeholder='*********'
                className='w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none placeholder:text-[#848995]'
              />
            </div>
          </div>

          <div className='flex w-full flex-col items-start gap-2'>
            <label className='text-[16px] font-normal leading-[1.2] text-black'>
              Confirm New Password
            </label>
            <div className='flex w-full items-center overflow-hidden rounded-xs border border-[#E5E5E6] bg-white px-3 py-2.5'>
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
      <button className='flex h-9 items-center justify-center gap-1 rounded-xs border border-[#F09000] bg-[#F09000] px-3 py-2 transition-colors hover:bg-[#d88200]'>
        <span className='whitespace-nowrap text-[14px] font-normal leading-[1.2] text-black'>
          Save Changes
        </span>
        <CircleCheck size={16} className='text-black' />
      </button>
    </div>
  );
}
