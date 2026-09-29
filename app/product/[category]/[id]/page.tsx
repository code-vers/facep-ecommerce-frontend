import PublicProductDetail from '@/components/product-detail/PublicProductDetail';
import ProductOverviewSection from '@/components/product-detail/ProductOverviewSection';
import { getProductBySlug } from '@/lib/api/product';

interface ProductDetailPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  try {
    const product = await getProductBySlug(id);
    if (product) {
      return <PublicProductDetail product={product} />;
    }
  } catch {
    // If not found or fallback requested
  }

  return (
    <div className='min-h-screen'>
      <ProductOverviewSection />
    </div>
  );
}

