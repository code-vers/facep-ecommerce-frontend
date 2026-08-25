'use client';

import React, { useState } from 'react';
import AdminPromotions from '@/components/dashboard/promotions/AdminPromotions';
import PromotionsTable from '@/components/dashboard/promotions/PromotionsTable';
import VendorProductPromotions from '@/components/dashboard/promotions/VendorProductPromotions';
import { useAuth } from '@/contexts/AuthContext';
import { Deal } from '@/lib/api/deal';

export default function DashboardPromotionsPage() {
  const { session } = useAuth();
  const [viewMode, setViewMode] = useState<'table' | 'create' | 'edit'>('table');
  const [activeTab, setActiveTab] = useState<'category' | 'product'>('category');
  const [selectedDealToEdit, setSelectedDealToEdit] = useState<Deal | null>(null);

  const handleAddNewDeal = () => {
    setSelectedDealToEdit(null);
    setViewMode('create');
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDealToEdit(deal);
    setViewMode('edit');
  };

  const handleBackToTable = () => {
    setSelectedDealToEdit(null);
    setViewMode('table');
  };

  return (
    <div className='flex w-full flex-col items-center gap-6 bg-white px-4 py-6 md:px-8 md:py-8 2xl:px-11.25 2xl:py-9 min-h-screen'>
      {session?.user.role === 'VENDOR' && viewMode === 'table' && (
        <div className='flex w-full border-b border-[#e5e5e6]'>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-4 py-2.5 text-[14px] font-medium ${activeTab === 'category' ? 'border-b-2 border-[#f09000] text-[#f09000]' : 'text-[#686f7d]'}`}
          >
            Category Deals
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={`px-4 py-2.5 text-[14px] font-medium ${activeTab === 'product' ? 'border-b-2 border-[#f09000] text-[#f09000]' : 'text-[#686f7d]'}`}
          >
            Product Deals
          </button>
        </div>
      )}
      {session?.user.role === 'VENDOR' && activeTab === 'product' && viewMode === 'table' ? (
        <VendorProductPromotions />
      ) : viewMode === 'table' ? (
        <PromotionsTable onAddNewDeal={handleAddNewDeal} onEditDeal={handleEditDeal} />
      ) : (
        <AdminPromotions
          dealToEdit={selectedDealToEdit}
          onBack={handleBackToTable}
          onSuccess={handleBackToTable}
        />
      )}
    </div>
  );
}
//promiton end!.......
