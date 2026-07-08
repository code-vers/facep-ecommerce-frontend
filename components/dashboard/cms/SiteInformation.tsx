'use client';

import { useState, useRef } from 'react';
import { Plus, CheckCircle2, ChevronDown, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SiteInformation() {
  const [formData, setFormData] = useState({
    platformName: '',
    email: '',
    contactNumber: '',
    address: '',
    workingHours: '',
  });

  const [socials, setSocials] = useState([
    { id: 1, platform: 'Select Account Type', url: '', isDropdownOpen: false }
  ]);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSocialAccount = () => {
    setSocials([...socials, { id: Date.now(), platform: 'Select Account Type', url: '', isDropdownOpen: false }]);
  };

  const removeSocialAccount = (id: number) => {
    setSocials(socials.filter(s => s.id !== id));
  };

  const updateSocialPlatform = (id: number, platform: string) => {
    setSocials(socials.map(s => s.id === id ? { ...s, platform, isDropdownOpen: false } : s));
  };

  const updateSocialUrl = (id: number, url: string) => {
    setSocials(socials.map(s => s.id === id ? { ...s, url } : s));
  };

  const toggleDropdown = (id: number) => {
    setSocials(socials.map(s => s.id === id ? { ...s, isDropdownOpen: !s.isDropdownOpen } : { ...s, isDropdownOpen: false }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleSave = () => {
    setIsSaveModalOpen(false);
    setToastMessage('Site information updated successfully');
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[32px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] md:p-[32px] relative'>
      {/* Title */}
      <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>Site Information</h2>

      {/* Form Sections */}
      <div className='flex w-full flex-col gap-[24px]'>
        
        {/* Logo Section */}
        <div className='flex flex-col gap-[8px]'>
          <label className='text-[14px] font-normal text-black'>Logo</label>
          <div className='flex items-center gap-[16px]'>
            {/* Mock Logo Box */}
            <div className='relative flex h-[80px] w-[80px] shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-[#0A132B]'>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
              ) : (
                <svg
                  width='48'
                  height='48'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='4' y1='20' x2='20' y2='4'></line>
                  <line x1='14' y1='20' x2='20' y2='14'></line>
                  <line x1='4' y1='10' x2='10' y2='4'></line>
                </svg>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleLogoChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className='text-[14px] font-normal text-[#165DD0] transition-colors hover:underline focus-visible:outline-none'
            >
              Change Logo
            </button>
          </div>
        </div>

        {/* Text Inputs Grid */}
        <div className='grid w-full grid-cols-1 gap-[24px] md:grid-cols-2'>
          {/* Platform Name (Full Width) */}
          <div className='flex flex-col gap-[8px] md:col-span-2'>
            <label className='text-[14px] font-normal text-black'>Platform Name</label>
            <input
              type='text'
              name='platformName'
              value={formData.platformName}
              onChange={handleInputChange}
              placeholder='Platform Name'
              className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
            />
          </div>

          {/* Email */}
          <div className='flex flex-col gap-[8px]'>
            <label className='text-[14px] font-normal text-black'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='alexander@domain.com'
              className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
            />
          </div>

          {/* Contact Number */}
          <div className='flex flex-col gap-[8px]'>
            <label className='text-[14px] font-normal text-black'>Contact Number</label>
            <input
              type='text'
              name='contactNumber'
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder='+41 00 000 00 00'
              className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
            />
          </div>

          {/* Address */}
          <div className='flex flex-col gap-[8px]'>
            <label className='text-[14px] font-normal text-black'>Address</label>
            <input
              type='text'
              name='address'
              value={formData.address}
              onChange={handleInputChange}
              placeholder='123 Edelweiss Strasse, Zurich'
              className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
            />
          </div>

          {/* Working Hours */}
          <div className='flex flex-col gap-[8px]'>
            <label className='text-[14px] font-normal text-black'>Working Hours</label>
            <input
              type='text'
              name='workingHours'
              value={formData.workingHours}
              onChange={handleInputChange}
              placeholder='9 am - 5 pm'
              className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
            />
          </div>
        </div>

        {/* Company Socials Section */}
        <div className='mt-[8px] flex w-full flex-col gap-[16px]'>
          <h3 className='text-[16px] font-semibold leading-[1.2] text-black'>
            Company Socials
          </h3>
          
          <div className='flex w-full flex-col gap-[16px]'>
            <div className='flex items-center justify-between'>
              <label className='text-[14px] font-normal text-black'>Social Media Accounts</label>
              <button
                type='button'
                onClick={addSocialAccount}
                className='flex items-center justify-center text-[#848995] transition-colors hover:text-black focus-visible:outline-none'
                aria-label='Add social media account'
              >
                <Plus size={20} />
              </button>
            </div>

            {socials.map((social, index) => (
              <div key={social.id} className='flex w-full flex-col sm:flex-row gap-[16px]'>
                {/* Custom Dropdown */}
                <div className='relative w-full sm:w-[240px] shrink-0'>
                  <button
                    type='button'
                    onClick={() => toggleDropdown(social.id)}
                    className='flex h-[40px] w-full items-center justify-between rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                  >
                    <span className={cn(social.platform !== 'Select Account Type' ? 'text-black' : '')}>
                      {social.platform}
                    </span>
                    <ChevronDown size={16} className='text-[#848995]' />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {social.isDropdownOpen && (
                    <div className='absolute left-0 top-[calc(100%+4px)] z-10 w-full rounded-[2px] border border-[#E5E5E6] bg-white shadow-sm'>
                      <div className='flex items-center justify-between px-[12px] py-[10px] border-b border-[#E5E5E6] text-[13px] text-[#848995]'>
                        <span>Account</span>
                        <ChevronDown size={14} />
                      </div>
                      <div className='flex flex-col py-[4px]'>
                        <button
                          onClick={() => updateSocialPlatform(social.id, 'Facebook')}
                          className='flex w-full items-center gap-[12px] px-[12px] py-[8px] hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none'
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H7.5V12H10V9.5C10 7.03 11.47 5.63 13.82 5.63C14.9 5.63 16.03 5.82 16.03 5.82V8.25H14.78C13.55 8.25 13.17 9.01 13.17 9.79V12H15.94L15.5 15H13.17V21.8C17.72 20.87 21.16 16.84 22 12H22Z" fill="#1877F2"/>
                          </svg>
                          <span className='text-[14px] text-[#42454D]'>Facebook</span>
                        </button>
                        <button
                          onClick={() => updateSocialPlatform(social.id, 'Instagram')}
                          className='flex w-full items-center gap-[12px] px-[12px] py-[8px] hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none'
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E4405F]">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                          <span className='text-[14px] text-[#42454D]'>Instagram</span>
                        </button>
                        <button
                          onClick={() => updateSocialPlatform(social.id, 'X')}
                          className='flex w-full items-center gap-[12px] px-[12px] py-[8px] hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none'
                        >
                          <svg width="14" height="14" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="#14171A"/>
                          </svg>
                          <span className='text-[14px] text-[#42454D] ml-[2px]'>X</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Link Input and Remove Button */}
                <div className='flex w-full flex-1 gap-[8px]'>
                  <input
                    type='text'
                    value={social.url}
                    onChange={(e) => updateSocialUrl(social.id, e.target.value)}
                    placeholder='Enter profile link'
                    className='h-[40px] w-full flex-1 rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
                  />
                  {socials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocialAccount(social.id)}
                      className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[2px] border border-[#E5E5E6] text-[#848995] hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Changes Button */}
        <div className='mt-[16px] flex w-full justify-end'>
          <button 
            onClick={() => setIsSaveModalOpen(true)}
            className='flex h-[40px] items-center gap-[8px] rounded-[2px] bg-[#F09000] px-[16px] transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'
          >
            <span className='text-[14px] font-normal text-black'>Save Changes</span>
            <CheckCircle2 size={16} className='text-black' />
          </button>
        </div>

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
              Are you sure you want to save these changes to the site information?
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

