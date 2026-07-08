'use client';

import { CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';

export default function SupportContents() {
  // In a real application, these would hold File objects
  const [deliveryFile, setDeliveryFile] = useState<string | null>(null);
  const [signInFile, setSignInFile] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  const [securityFile, setSecurityFile] = useState<string | null>(null);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (name: string | null) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0].name);
    } else {
      setFile(null);
    }
  };

  const handleSave = () => {
    setIsSaveModalOpen(false);
    setToastMessage('Support documents updated successfully');
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[32px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] md:p-[32px] relative'>
      
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
        <button 
          onClick={() => setIsSaveModalOpen(true)}
          className='flex h-[40px] items-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'
        >
          <span className='text-[14px] font-normal text-black'>Save Changes</span>
          <CheckCircle2 size={16} className='text-black' />
        </button>
      </div>

      {/* Save Confirmation Modal */}
      {isSaveModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[400px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] shadow-xl'>
            <div className='flex items-start justify-between mb-[16px]'>
              <h3 className='text-[18px] font-semibold text-black'>Save Changes</h3>
              <button 
                onClick={() => setIsSaveModalOpen(false)} 
                className='text-[#848995] hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-[14px] text-[#42454D] mb-[24px] leading-[1.5]'>
              Are you sure you want to save these support documents?
            </p>
            <div className='flex justify-end gap-[12px]'>
              <button 
                onClick={() => setIsSaveModalOpen(false)}
                className='rounded-[2px] border border-[#E5E5E6] px-[16px] py-[8px] text-[14px] font-medium text-[#42454D] hover:bg-gray-50 focus-visible:outline-none'
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className='rounded-[2px] bg-[#F09000] px-[16px] py-[8px] text-[14px] font-medium text-black hover:bg-[#D98200] focus-visible:outline-none'
              >
                Confirm
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
