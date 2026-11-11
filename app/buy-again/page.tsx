import BuyAgainCatalog from '@/components/buy-again/BuyAgainCatalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Again & Past Delivered Favorites — Facep',
  description: 'Easily reorder products from your delivered orders with one click on Facep.',
};

export default function BuyAgainPage() {
  return <BuyAgainCatalog />;
}
