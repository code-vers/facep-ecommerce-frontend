import SpecialProductsManagement from '@/components/dashboard/special-products/SpecialProductsManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Products Management | Admin Dashboard',
  description: 'Manage featured Special Products on Facep platform',
};

export default function SpecialProductsDashboardPage() {
  return <SpecialProductsManagement />;
}
