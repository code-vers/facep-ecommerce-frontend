import GroceriesCatalog from '@/components/groceries/GroceriesCatalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Groceries & Fresh Market | Facep',
  description: 'Shop fresh groceries, pantry essentials, gourmet snacks, organic goods, and daily kitchen items on Facep.',
};

export default function GroceriesPage() {
  return <GroceriesCatalog />;
}
