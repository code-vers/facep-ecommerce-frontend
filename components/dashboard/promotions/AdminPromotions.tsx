'use client';

import React from 'react';
import { Search, Calendar, RefreshCcw, Check } from 'lucide-react';

const checkboxItems = Array.from({ length: 32 }, (_, i) => {
  const labels = ['Appliance', 'Electronics', 'Furniture', 'Clothing'];
  return {
    id: i,
    label: labels[i % 4],
    checked: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23, 25, 26, 27, 29, 30, 31].includes(i),
  };
});

export default function AdminPromotions() {
  return (
    <div className="w-full bg-white border border-[#e5e5e6] rounded-[4px] p-6 flex flex-col gap-8">
      
      {/* Top Section */}
      <div className="flex flex-col gap-6 w-full border-b border-[#e5e5e6] pb-8">
        <h3 className="font-semibold text-[18px] text-black">On Going Today's Deals</h3>
        
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[13px] text-[#42454d] font-normal">Fathers Day Sale</label>
          <input 
            type="text" 
            defaultValue="Plant House"
            className="w-full border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 text-[13px] text-[#848995] bg-white outline-none focus:border-[#f09000]"
          />
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#42454d]">Deal Banner</span>
            <button className="text-[13px] text-[#165dd0] hover:underline font-normal">Update Banner</button>
          </div>
          
          <div className="w-full border border-dashed border-[#dcdce0] p-[4px] rounded-[2px]">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] bg-[#ffca08] relative overflow-hidden rounded-[2px] flex">
              <div className="flex-1 flex flex-col justify-center px-10 md:px-20 z-10">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold leading-tight">Buy Your Favorite Plant</h1>
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold leading-tight mt-2">From Plant Home</h1>
              </div>
              
              <div className="hidden md:flex flex-1 relative">
                {/* Gift box placeholder */}
                <div className="absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-4">
                  <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop" className="w-[300px] h-auto object-contain drop-shadow-2xl mix-blend-multiply opacity-80" alt="gift" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 w-full">
        <h3 className="font-semibold text-[18px] text-black">Products and Other Control</h3>
        
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[13px] text-[#42454d] font-normal">Deal Product Subcategories</label>
          <div className="relative w-full sm:w-[350px]">
            <input 
              type="text" 
              placeholder="Search by keywords and select"
              className="w-full border border-[#e5e5e6] rounded-[2px] h-[36px] pl-3 pr-10 text-[13px] text-black placeholder-[#848995] bg-white outline-none focus:border-[#f09000]"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b3b8]" />
          </div>

          <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-4 gap-x-2 mt-4">
            {checkboxItems.map((item) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer w-fit">
                {item.checked ? (
                  <div className="w-[14px] h-[14px] rounded-[2px] bg-[#f09000] flex items-center justify-center shrink-0">
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-[14px] h-[14px] rounded-[2px] border border-[#dcdce0] bg-white shrink-0" />
                )}
                <span className="text-[12px] text-[#42454d]">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full mt-4">
          <div className="flex flex-col gap-1.5 w-full flex-1">
            <label className="text-[13px] text-[#42454d] font-normal">Discount Percentage (starting)</label>
            <input 
              type="text" 
              defaultValue="5%"
              className="w-full border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 text-[13px] text-[#848995] bg-white outline-none focus:border-[#f09000]"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full flex-1">
            <label className="text-[13px] text-[#42454d] font-normal">Discount Percentage (End)</label>
            <input 
              type="text" 
              defaultValue="50%"
              className="w-full border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 text-[13px] text-[#848995] bg-white outline-none focus:border-[#f09000]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full mt-2">
          <div className="flex flex-col gap-1.5 w-full flex-1 relative">
            <label className="text-[13px] text-[#42454d] font-normal">Deal start Date</label>
            <input 
              type="text" 
              className="w-full border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 text-[13px] text-[#848995] bg-white outline-none focus:border-[#f09000]"
            />
            <Calendar size={16} className="absolute right-3 top-[32px] text-[#b0b3b8] pointer-events-none" />
          </div>
          <div className="flex flex-col gap-1.5 w-full flex-1 relative">
            <label className="text-[13px] text-[#42454d] font-normal">Deal End Date</label>
            <input 
              type="text" 
              className="w-full border border-[#e5e5e6] rounded-[2px] h-[36px] px-3 text-[13px] text-[#848995] bg-white outline-none focus:border-[#f09000]"
            />
            <Calendar size={16} className="absolute right-3 top-[32px] text-[#b0b3b8] pointer-events-none" />
          </div>
        </div>

        <button className="w-full h-[40px] bg-[#f09000] hover:bg-[#e08600] transition-colors rounded-[2px] flex items-center justify-center gap-2 mt-6">
          <span className="text-[14px] text-white font-medium">Update Today's Deal</span>
          <RefreshCcw size={16} className="text-white" />
        </button>

      </div>
    </div>
  );
}
