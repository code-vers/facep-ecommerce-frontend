import PublicProductsCatalog from '@/components/product/PublicProductsCatalog';
import { Suspense } from 'react';

export default function ProductPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-white' />}>
      <PublicProductsCatalog />
    </Suspense>
  );
}
