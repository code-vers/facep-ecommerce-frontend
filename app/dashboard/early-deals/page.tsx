import EarlyDealsManagement from '@/components/dashboard/early-deals/EarlyDealsManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Early Deals Management | Admin Dashboard',
  description: 'Manage products featured in Early Deals on Facep platform',
};

export default function EarlyDealsDashboardPage() {
  return <EarlyDealsManagement />;
}
