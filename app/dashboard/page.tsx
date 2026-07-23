'use client';

import AdminOverviewPage from '@/components/dashboard/overview/AdminOverviewPage';
import VendorOverviewPage from '@/components/dashboard/overview/VendorOverViewPage';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardOverviewPage() {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'admin';

  return <div>{isAdmin ? <AdminOverviewPage /> : <VendorOverviewPage />}</div>;
}
