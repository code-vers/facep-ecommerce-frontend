import SpecialProductsCatalog from '@/components/special-products/SpecialProductsCatalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Products — Facep',
  description: 'Shop curated and premier special products on Facep.',
};

export default function SpecialProductsPage() {
  return <SpecialProductsCatalog />;
}
