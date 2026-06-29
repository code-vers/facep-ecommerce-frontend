'use client';

import React from 'react';

interface VendorsTabsProps {
  activeTab: 'all-stores' | 'pending-approvals';
  onTabChange: (tab: 'all-stores' | 'pending-approvals') => void;
}

export default function VendorsTabs({ activeTab, onTabChange }: VendorsTabsProps) {
  return (
    <div className="bg-white border border-[#e5e5e6] rounded-[4px] p-2 flex gap-1 w-fit">
      
      {/* All Stores Tab */}
      <button
        onClick={() => onTabChange('all-stores')}
        className={`flex items-center gap-2 px-2 py-2 rounded-[2px] transition-colors ${
          activeTab === 'all-stores' ? 'bg-[#ede7de]' : 'bg-transparent hover:bg-gray-50'
        }`}
      >
        <span className="text-[14px] text-black">All Stores</span>
        <div className="bg-[#e3d7b5] border border-[#f09000] rounded-[10px] w-[15px] h-[15px] flex items-center justify-center">
          <span className="text-[6px] text-[#f09000]">100</span>
        </div>
      </button>

      {/* Pending Approvals Tab */}
      <button
        onClick={() => onTabChange('pending-approvals')}
        className={`flex items-center gap-2 px-2 py-2 rounded-[2px] transition-colors ${
          activeTab === 'pending-approvals' ? 'bg-[#ede7de]' : 'bg-transparent hover:bg-gray-50'
        }`}
      >
        <span className="text-[14px] text-black">Pending Approvals</span>
        <div className="bg-[#e3d7b5] border border-[#f09000] rounded-[10px] w-[15px] h-[15px] flex items-center justify-center">
          <span className="text-[6px] text-[#f09000]">20</span>
        </div>
      </button>

    </div>
  );
}
