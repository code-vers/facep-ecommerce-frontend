import HolidayDealsManagement from '@/components/dashboard/holiday-deals/HolidayDealsManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Holiday Deals Management | Admin Dashboard',
  description: 'Manage featured Holiday Deals campaigns and seasonal promotions on Facep platform',
};

export default function HolidayDealsDashboardPage() {
  return <HolidayDealsManagement />;
}
