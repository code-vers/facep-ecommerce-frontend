import ToysAndGamesManagement from '@/components/dashboard/toys-and-games/ToysAndGamesManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toys & Games Management | Admin Dashboard',
  description: 'Manage featured Toys & Games catalog products and curated entertainment on Facep platform',
};

export default function ToysAndGamesDashboardPage() {
  return <ToysAndGamesManagement />;
}
