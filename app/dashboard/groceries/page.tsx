import GroceriesManagement from '@/components/dashboard/groceries/GroceriesManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Groceries Management | Admin Dashboard',
  description: 'Manage featured Groceries catalog products and everyday pantry essentials on Facep platform',
};

export default function GroceriesDashboardPage() {
  return <GroceriesManagement />;
}
