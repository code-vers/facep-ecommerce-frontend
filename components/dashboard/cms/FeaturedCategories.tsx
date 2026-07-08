'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data generator matching the screenshot exact layout
// 11 rows * 8 columns = 88 items
const initialCategories = Array.from({ length: 88 }).map((_, i) => {
  const row = Math.floor(i / 8);
  if (row < 8) return { id: i, name: 'Appliance', checked: false };
  if (row === 8) return { id: i, name: 'Electronics', checked: true };
  if (row === 9) return { id: i, name: 'Furniture', checked: true };
  return { id: i, name: 'Clothing', checked: true };
});

export default function FeaturedCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleCategory = (id: number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, checked: !cat.checked } : cat
    ));
  };
  
  const handleSave = () => {
    setIsSaveModalOpen(false);
    setToastMessage('Categories updated successfully');
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filteredCategories = categories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-[32px] rounded-[4px] border border-[#E5E5E6] bg-white p-[24px] md:p-[32px] relative'>
      
      {/* Header Section */}
      <div className='flex w-full flex-col gap-[8px]'>
        <h2 className='text-[20px] font-semibold leading-[1.2] text-black'>
          Featured Categories
        </h2>
        <p className='text-[14px] font-normal text-[#42454D]'>
          Select Product Categories
        </p>
      </div>

      {/* Search Input */}
      <div className='relative w-full max-w-[400px]'>
        <input
          type='text'
          placeholder='Search by keywords and select'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='h-[40px] w-full rounded-[2px] border border-[#E5E5E6] bg-white pl-[12px] pr-[36px] text-[14px] text-black placeholder:text-[#848995] focus-visible:border-[#165DD0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#165DD0]'
        />
        <Search size={16} className='absolute right-[12px] top-1/2 -translate-y-1/2 text-[#848995]' />
      </div>

      {/* Categories Grid */}
      <div className='w-full'>
        <div className='grid w-full grid-cols-2 gap-y-[16px] gap-x-[8px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'>
          {filteredCategories.map((cat) => (
            <label
              key={cat.id}
              className='flex cursor-pointer items-center gap-[8px] group'
            >
              <div className='relative flex h-[16px] w-[16px] shrink-0 items-center justify-center'>
                <input
                  type='checkbox'
                  className='peer sr-only'
                  checked={cat.checked}
                  onChange={() => toggleCategory(cat.id)}
                />
                <div className='h-[16px] w-[16px] rounded-[2px] border border-[#848995] bg-white transition-colors peer-checked:border-[#F09000] peer-checked:bg-[#F09000] peer-focus-visible:ring-2 peer-focus-visible:ring-[#F09000] peer-focus-visible:ring-offset-1 group-hover:border-[#F09000]'>
                </div>
                <Check
                  size={12}
                  strokeWidth={3}
                  className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100'
                />
              </div>
              <span className='truncate text-[13px] font-normal text-[#42454D] select-none group-hover:text-black'>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
        {filteredCategories.length === 0 && (
          <p className="text-[#848995] text-[14px]">No categories found.</p>
        )}
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
              Are you sure you want to save these category selections?
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
