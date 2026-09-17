'use client';

import React from 'react';

interface VendorsTabsProps {
  activeTab: 'all-stores' | 'pending-approvals';
  onTabChange: (tab: 'all-stores' | 'pending-approvals') => void;
  allCount?: number;
  pendingCount?: number;
}

export default function VendorsTabs({
  activeTab,
  onTabChange,
  allCount = 0,
  pendingCount = 0
}: VendorsTabsProps) {
  return (
    <div className="bg-white border border-[#e5e5e6] rounded-[4px] p-2 flex gap-1 w-fit">
      
      {/* All Stores Tab */}
      <button
        onClick={() => onTabChange('all-stores')}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] transition-colors ${
          activeTab === 'all-stores' ? 'bg-[#ede7de]' : 'bg-transparent hover:bg-gray-50'
        }`}
      >
        <span className="text-[14px] text-black">All Stores</span>
        <div className="bg-[#e3d7b5] border border-[#f09000] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
          <span className="text-[9px] font-bold text-[#b86e00] leading-none">{allCount}</span>
        </div>
      </button>

      {/* Pending Approvals Tab */}
      <button
        onClick={() => onTabChange('pending-approvals')}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] transition-colors ${
          activeTab === 'pending-approvals' ? 'bg-[#ede7de]' : 'bg-transparent hover:bg-gray-50'
        }`}
      >
        <span className="text-[14px] text-black">Pending Approvals</span>
        <div className="bg-[#e3d7b5] border border-[#f09000] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
          <span className="text-[9px] font-bold text-[#b86e00] leading-none">{pendingCount}</span>
        </div>
      </button>

    </div>
  );
}
