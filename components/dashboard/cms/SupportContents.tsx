'use client';

import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function SupportContents() {
  // In a real application, these would hold File objects
  const [deliveryFile, setDeliveryFile] = useState<string | null>(null);
  const [signInFile, setSignInFile] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  const [securityFile, setSecurityFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (name: string | null) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0].name);
    } else {
      setFile(null);
    }
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[32px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] md:p-[32px]'>
      
      {/* Title */}
      <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
        Support Documents
      </h2>

      {/* Form Sections */}
      <div className='flex w-full flex-col gap-[24px]'>
        
        {/* Delivery Documents */}
        <div className='flex w-full flex-col gap-[8px]'>
          <label className='text-[14px] font-normal text-black'>
            Upload Delivery or order return Documents
          </label>
          <div className='flex h-[40px] w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white transition-colors focus-within:border-[#165DD0] focus-within:ring-1 focus-within:ring-[#165DD0]'>
            <label className='flex h-full cursor-pointer items-center justify-center border-r border-[#E5E5E6] bg-[#F2F2F3] px-[12px] transition-colors hover:bg-gray-200'>
              <span className='text-[13px] font-normal text-[#42454D]'>Choose File</span>
              <input 
                type='file' 
                className='hidden' 
                onChange={(e) => handleFileChange(e, setDeliveryFile)}
              />
            </label>
            <span className='truncate px-[12px] text-[13px] font-normal text-[#848995]'>
              {deliveryFile || 'No file chosen'}
            </span>
          </div>
        </div>

        {/* Sign In Documents */}
        <div className='flex w-full flex-col gap-[8px]'>
          <label className='text-[14px] font-normal text-black'>
            Upload Help with sign in Documents
          </label>
          <div className='flex h-[40px] w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white transition-colors focus-within:border-[#165DD0] focus-within:ring-1 focus-within:ring-[#165DD0]'>
            <label className='flex h-full cursor-pointer items-center justify-center border-r border-[#E5E5E6] bg-[#F2F2F3] px-[12px] transition-colors hover:bg-gray-200'>
              <span className='text-[13px] font-normal text-[#42454D]'>Choose File</span>
              <input 
                type='file' 
                className='hidden' 
                onChange={(e) => handleFileChange(e, setSignInFile)}
              />
            </label>
            <span className='truncate px-[12px] text-[13px] font-normal text-[#848995]'>
              {signInFile || 'No file chosen'}
            </span>
          </div>
        </div>

        {/* Payment Documents */}
        <div className='flex w-full flex-col gap-[8px]'>
          <label className='text-[14px] font-normal text-black'>
            Upload Payment & charges Documents
          </label>
          <div className='flex h-[40px] w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white transition-colors focus-within:border-[#165DD0] focus-within:ring-1 focus-within:ring-[#165DD0]'>
            <label className='flex h-full cursor-pointer items-center justify-center border-r border-[#E5E5E6] bg-[#F2F2F3] px-[12px] transition-colors hover:bg-gray-200'>
              <span className='text-[13px] font-normal text-[#42454D]'>Choose File</span>
              <input 
                type='file' 
                className='hidden' 
                onChange={(e) => handleFileChange(e, setPaymentFile)}
              />
            </label>
            <span className='truncate px-[12px] text-[13px] font-normal text-[#848995]'>
              {paymentFile || 'No file chosen'}
            </span>
          </div>
        </div>

        {/* Security Documents */}
        <div className='flex w-full flex-col gap-[8px]'>
          <label className='text-[14px] font-normal text-black'>
            Upload Security & privacy - policy Documents
          </label>
          <div className='flex h-[40px] w-full items-center overflow-hidden rounded-[2px] border border-[#E5E5E6] bg-white transition-colors focus-within:border-[#165DD0] focus-within:ring-1 focus-within:ring-[#165DD0]'>
            <label className='flex h-full cursor-pointer items-center justify-center border-r border-[#E5E5E6] bg-[#F2F2F3] px-[12px] transition-colors hover:bg-gray-200'>
              <span className='text-[13px] font-normal text-[#42454D]'>Choose File</span>
              <input 
                type='file' 
                className='hidden' 
                onChange={(e) => handleFileChange(e, setSecurityFile)}
              />
            </label>
            <span className='truncate px-[12px] text-[13px] font-normal text-[#848995]'>
              {securityFile || 'No file chosen'}
            </span>
          </div>
        </div>

      </div>

      {/* Save Changes Button */}
      <div className='flex w-full justify-end pt-[8px]'>
        <button className='flex h-[40px] items-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'>
          <span className='text-[14px] font-normal text-black'>Save Changes</span>
          <CheckCircle2 size={16} className='text-black' />
        </button>
      </div>
      
    </div>
  );
}
