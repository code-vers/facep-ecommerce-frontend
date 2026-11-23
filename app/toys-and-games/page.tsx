import ToysAndGamesCatalog from '@/components/toys-and-games/ToysAndGamesCatalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toys & Games | Facep',
  description: 'Explore our curated collection of toys, board games, video games, educational sets, and outdoor play for all ages on Facep.',
};

export default function ToysAndGamesPage() {
  return <ToysAndGamesCatalog />;
}
