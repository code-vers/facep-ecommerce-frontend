import BrowsingHistoryCatalog from '@/components/browsing-history/BrowsingHistoryCatalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Browsing History',
  description: 'View and manage items you have recently browsed on Facep.',
};

export default function BrowsingHistoryPage() {
  return <BrowsingHistoryCatalog />;
}
