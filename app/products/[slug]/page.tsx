import PublicProductDetail from '@/components/product-detail/PublicProductDetail';
import { getProductBySlug } from '@/lib/api/product';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return {
      title: `${product.name} — Facep`,
      description: product.shortDescription || `View ${product.name} product details on Facep.`,
      alternates: { canonical: `/products/${product.slug}` },
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.name,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    };
  } catch {
    return { title: 'Product not found — Facep' };
  }
}

export default async function PublicProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }
  return <PublicProductDetail product={product} />;
}
