import EarlyDealsCatalog from '@/components/early-deals/EarlyDealsCatalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Early Deals — Facep',
  description: 'Shop exclusive early deals, markdowns, and limited-time savings across all categories.',
};

export default function EarlyDealsPage() {
  return <EarlyDealsCatalog />;
}
