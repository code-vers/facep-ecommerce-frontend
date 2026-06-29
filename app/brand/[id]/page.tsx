/**
 * @fileoverview Dynamic Brand storefront route - `/brand/[id]`.
 * Renders the brand storefront component.
 *
 * @module app/brand/[id]/page
 */

import { Metadata } from 'next';
import BrandStoreFront from '@/components/brand/BrandStoreFront';

interface BrandPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { id } = await params;
  const brandName = id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${brandName} Storefront — Facep`,
    description: `Shop original products from ${brandName} on Facep storefront.`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  // Await params per Next.js App Router rules
  const { id } = await params;

  return (
    <main className="min-h-screen">
      <BrandStoreFront />
    </main>
  );
}
