'use client';

import React, { useState } from 'react';
import AdminPromotions from '@/components/dashboard/promotions/AdminPromotions';
import PromotionsTable from '@/components/dashboard/promotions/PromotionsTable';
import { Deal } from '@/lib/api/deal';

export default function DashboardPromotionsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'create' | 'edit'>('table');
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
      {viewMode === 'table' ? (
        <PromotionsTable
          onAddNewDeal={handleAddNewDeal}
          onEditDeal={handleEditDeal}
        />
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
