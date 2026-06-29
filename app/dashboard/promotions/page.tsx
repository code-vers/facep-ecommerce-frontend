'use client';

import AdminPromotions from '@/components/dashboard/promotions/AdminPromotions';
import PromotionsTable from '@/components/dashboard/promotions/PromotionsTable';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPromotionsPage() {
  const { session } = useAuth();
  const isAdmin = session?.role === 'admin';

  return (
    <div className='flex w-full flex-col items-center gap-[24px] bg-white px-4 py-6 md:px-8 md:py-8 2xl:px-[45px] 2xl:py-[36px] min-h-screen'>
      {isAdmin ? <AdminPromotions /> : <PromotionsTable />}
    </div>
  );
}
