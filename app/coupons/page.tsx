import CouponsGallery from '@/components/coupons/CouponsGallery';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coupons & Digital Vouchers — Facep',
  description: 'Collect verified promo codes, copy with 1-click, and save instantly on all orders at Facep.',
};

export default function CouponsPage() {
  return <CouponsGallery />;
}
