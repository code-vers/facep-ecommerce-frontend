import React from 'react';
import Link from 'next/link';
import ProductCard, { type ProductCardButtonVariant } from '@/components/shared/ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const IMG1 = '/ImageWithFallback.png';
const IMG2 = '/ImageWithFallback2.png';

interface GridProduct {
  id: string;
  title: string;
  rating: number;
  reviewCount: string;
  price: string;
  originalPrice?: string;
  offerText: string;
  shippingText: string;
  imageSrc: string;
  buttonVariant: Extract<ProductCardButtonVariant, 'add-to-cart' | 'see-options'>;
}

// Mock data generation for results based on Figma
const generateProducts = (count: number): GridProduct[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `prod-${i}`,
    title: i % 2 === 0 ? "Gaming Setup" : "Office Chair",
    rating: i % 3 === 1 ? 4.7 : 4.5,
    reviewCount: i % 3 === 1 ? "320+" : "624+",
    price: i % 2 === 0 ? "$299.99" : "$199.99",
    originalPrice: i % 3 === 0 ? "$399.99" : undefined,
    offerText: i % 2 === 0 ? "Up to 30% off" : "Free Shipping on orders over $50",
    shippingText: "$36 Shipping",
    imageSrc: i % 2 === 0 ? IMG1 : IMG2,
    buttonVariant: (i % 5 === 4 || i % 7 === 2) ? "see-options" : "add-to-cart",
  }));
};

const products = generateProducts(28); // 4 rows of 7

export default function ProductGrid() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[21px] font-bold leading-none text-black">Results</h2>
        <p className="text-[14px] leading-[1.3] text-[#42454D]">
          Check each product page for other buying options. Price and other details may vary based on product size and color
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/home/${product.id}`} className="flex h-full">
            <ProductCard
              {...product}
              imageAlt={product.title}
              buttonVariant="none"
            />
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-10">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E6] bg-white transition-colors hover:bg-gray-50">
          <ChevronLeft size={20} className="text-[#42454D]" />
        </button>
        <span className="text-[14px] text-[#42454D]">Page 1 of 12</span>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E6] bg-white transition-colors hover:bg-gray-50">
          <ChevronRight size={20} className="text-[#42454D]" />
        </button>
      </div>
    </div>
  );
}
