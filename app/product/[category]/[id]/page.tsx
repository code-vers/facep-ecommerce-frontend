import ProductOverviewSection from '@/components/product-detail/ProductOverviewSection';

interface ProductDetailPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  await params;

  return (
    <div className='min-h-screen'>
      <ProductOverviewSection />
    </div>
  );
}
