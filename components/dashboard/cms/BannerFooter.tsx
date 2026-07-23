'use client';

import { useState, useRef } from 'react';
import { CheckCircle2, Plus, X, Trash2 } from 'lucide-react';
import Image from 'next/image';

const initialHeaderBanners = [
  { id: 1, src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop' },
  { id: 2, src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop' },
  { id: 3, src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop' },
  { id: 4, src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400&auto=format&fit=crop' },
];

const initialFooterBanner = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop';

export default function BannerFooter() {
  const [headerBanners, setHeaderBanners] = useState(initialHeaderBanners);
  const [footerBanner, setFooterBanner] = useState(initialFooterBanner);
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const footerFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaveModalOpen(false);
    setToastMessage('Banners updated successfully');
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const removeHeaderBanner = (id: number) => {
    setHeaderBanners(headerBanners.filter(b => b.id !== id));
  };

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setHeaderBanners([...headerBanners, { id: Date.now(), src: url }]);
    }
  };

  const handleFooterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFooterBanner(url);
    }
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[32px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] md:p-[32px] relative'>
      {/* Title */}
      <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>Banners</h2>

      <div className='flex w-full flex-col gap-[32px]'>
        
        {/* Header Section */}
        <div className='flex w-full flex-col gap-[12px]'>
          <div className='flex items-center gap-[16px]'>
            <span className='text-[14px] font-normal text-black'>Header</span>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={headerFileInputRef}
              onChange={handleHeaderImageUpload}
            />
            <button 
              onClick={() => headerFileInputRef.current?.click()}
              className='text-[14px] font-normal text-[#165DD0] transition-colors hover:underline focus-visible:outline-none'
            >
              Add New Banner +
            </button>
          </div>
          
          <div className='flex w-full items-center rounded-[4px] border border-dashed border-[#E5E5E6] p-[16px] md:p-[24px]'>
            <div className='relative flex flex-wrap gap-[16px]'>
              {headerBanners.map((banner, idx) => {
                const isLast = idx === headerBanners.length - 1;
                return (
                  <div key={banner.id} className='relative flex items-center group'>
                    <div className='relative h-[120px] w-[120px] overflow-hidden rounded-[4px] border border-[#E5E5E6]'>
                      <Image
                        src={banner.src}
                        alt={`Header banner ${idx + 1}`}
                        fill
                        sizes='120px'
                        className='object-cover'
                        unoptimized
                      />
                      {/* Delete Overlay */}
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <button 
                          onClick={() => removeHeaderBanner(banner.id)}
                          className='p-2 bg-white rounded-full text-red-600 hover:bg-red-50 focus-visible:outline-none'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {isLast && (
                      <button 
                        onClick={() => headerFileInputRef.current?.click()}
                        className='absolute -right-[16px] z-10 flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#E5E5E6] bg-[#F2F2F3] shadow-sm hover:bg-white focus-visible:outline-none'
                      >
                        <Plus size={16} className='text-[#42454D]' />
                      </button>
                    )}
                  </div>
                );
              })}
              {headerBanners.length === 0 && (
                <div className='flex h-[120px] w-[120px] items-center justify-center rounded-[4px] border border-dashed border-[#E5E5E6] bg-gray-50'>
                  <span className='text-[12px] text-[#848995]'>No Banners</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className='flex w-full flex-col gap-[12px]'>
          <div className='flex items-center gap-[16px]'>
            <span className='text-[14px] font-normal text-black'>Footer</span>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={footerFileInputRef}
              onChange={handleFooterImageUpload}
            />
            <button 
              onClick={() => footerFileInputRef.current?.click()}
              className='text-[14px] font-normal text-[#165DD0] transition-colors hover:underline focus-visible:outline-none'
            >
              Upload New Banner +
            </button>
          </div>
          
          <div className='flex w-full rounded-[4px] border border-dashed border-[#E5E5E6] p-[16px] md:p-[24px]'>
            <div className='relative h-[200px] sm:h-[300px] w-full overflow-hidden rounded-[4px]'>
              <Image
                src={footerBanner}
                alt='Footer banner'
                fill
                sizes='(max-width: 1400px) 100vw, 1400px'
                className='object-cover'
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className='flex w-full justify-end pt-[16px]'>
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
              Are you sure you want to save these banners?
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
