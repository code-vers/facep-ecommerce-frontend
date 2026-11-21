import HolidayDealsCatalog from '@/components/holiday-deals/HolidayDealsCatalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Holiday Deals & Seasonal Specials — Facep',
  description: 'Unwrap festive savings and holiday specials on top gifts, electronics, toys, and seasonal favorites at Facep.',
};

export default function HolidayDealsPage() {
  return <HolidayDealsCatalog />;
}
