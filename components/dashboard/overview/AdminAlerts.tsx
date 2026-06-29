'use client';

import React from 'react';
import { Store, Box, MessageCircleQuestion } from 'lucide-react';

export default function AdminAlerts() {
  return (
    <div className="w-full flex flex-col xl:flex-row gap-6">
      
      {/* Stores Alert */}
      <div className="flex-1 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col justify-between min-h-[154px]">
        <div className="flex gap-4 items-start">
          <Store className="size-6 text-[#cb1b1b] shrink-0" />
          <div className="flex flex-col gap-2">
            <h3 className="text-[18px] text-[#cb1b1b] leading-[1.2]">Pending Approvals For New Vendors/Stores</h3>
            <p className="text-[22px] text-[#42454d] leading-[1.2]">200</p>
          </div>
        </div>
        <button className="w-full mt-4 border border-[#686f7d] rounded-[2px] py-2 flex items-center justify-center text-[14px] text-black hover:bg-gray-50 transition-colors">
          Manage Pending Stores
        </button>
      </div>

      {/* Products Alert */}
      <div className="flex-1 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col justify-between min-h-[154px]">
        <div className="flex gap-4 items-start">
          <Box className="size-6 text-[#cb1b1b] shrink-0" />
          <div className="flex flex-col gap-2">
            <h3 className="text-[18px] text-[#cb1b1b] leading-[1.2]">Pending Approvals For New Products</h3>
            <p className="text-[22px] text-[#42454d] leading-[1.2]">200</p>
          </div>
        </div>
        <button className="w-full mt-4 border border-[#686f7d] rounded-[2px] py-2 flex items-center justify-center text-[14px] text-black hover:bg-gray-50 transition-colors">
          Manage Pending Products
        </button>
      </div>

      {/* Support Inquiries Alert */}
      <div className="flex-1 bg-white border border-[#e5e5e6] rounded-[4px] p-4 flex flex-col justify-between min-h-[154px]">
        <div className="flex gap-4 items-start">
          <MessageCircleQuestion className="size-6 text-[#165dd0] shrink-0" />
          <div className="flex flex-col gap-2">
            <h3 className="text-[18px] text-[#165dd0] leading-[1.2]">Support Inquiries</h3>
            <p className="text-[22px] text-[#42454d] leading-[1.2]">20</p>
          </div>
        </div>
        <button className="w-full mt-4 border border-[#686f7d] rounded-[2px] py-2 flex items-center justify-center text-[14px] text-black hover:bg-gray-50 transition-colors">
          Reply to Inquiries
        </button>
      </div>

    </div>
  );
}
