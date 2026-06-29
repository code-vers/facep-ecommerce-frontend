/**
 * @fileoverview Plant House storefront mock data.
 * Contains categories, product data, and metadata for the brand storefront page.
 *
 * @module lib/brand-data
 */

export interface BrandProduct {
  id: string;
  title: string;
  category: 'indoor' | 'outdoor' | 'pots' | 'soils' | 'care' | 'seeds';
  imageSrc: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  badgeText?: string;
  badgeLabel?: string;
  shippingText: string;
  isTodayDeal?: boolean;
}

export const BRAND_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'indoor', label: 'Indoor Gardening' },
  { id: 'outdoor', label: 'Outdoor Gardening' },
  { id: 'pots', label: 'Pots & Planters' },
  { id: 'soils', label: 'Soils & Amendments' },
  { id: 'care', label: 'Plant Care' },
  { id: 'seeds', label: 'Seed Packs' },
] as const;

export const BRAND_PRODUCTS: BrandProduct[] = [
  {
    id: 'ph-1',
    title: 'Snake Plant Laurentii',
    category: 'indoor',
    imageSrc: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 312,
    price: 29.99,
    originalPrice: 45.00,
    badgeText: '33% off',
    badgeLabel: 'Limited time offer',
    shippingText: 'Free Shipping',
    isTodayDeal: true,
  },
  {
    id: 'ph-2',
    title: 'Monstera Deliciosa (Swiss Cheese Plant)',
    category: 'indoor',
    imageSrc: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 412,
    price: 39.99,
    shippingText: 'Free Shipping',
  },
  {
    id: 'ph-3',
    title: 'Chinese Money Plant (Pilea)',
    category: 'indoor',
    imageSrc: 'https://images.unsplash.com/photo-1508500383102-124b2f409c1a?q=80&w=600&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 182,
    price: 19.99,
    originalPrice: 29.99,
    badgeText: '33% off',
    badgeLabel: 'Limited time offer',
    shippingText: '$5.99 Shipping',
    isTodayDeal: true,
  },
  {
    id: 'ph-4',
    title: 'Premium Terracotta Pots (Set of 3)',
    category: 'pots',
    imageSrc: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 88,
    price: 24.99,
    shippingText: '$8.50 Shipping',
  },
  {
    id: 'ph-5',
    title: 'Dwarf Ficus Bonsai Tree',
    category: 'indoor',
    imageSrc: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 95,
    price: 49.99,
    originalPrice: 65.00,
    badgeText: '23% off',
    badgeLabel: 'Limited time offer',
    shippingText: 'Free Shipping',
  },
  {
    id: 'ph-6',
    title: 'Organic Potting Soil Mix (10 Liters)',
    category: 'soils',
    imageSrc: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 220,
    price: 14.99,
    shippingText: '$6.00 Shipping',
  },
  {
    id: 'ph-7',
    title: 'Calathea Orbifolia (Round-Leaf Plant)',
    category: 'indoor',
    imageSrc: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop',
    rating: 4.4,
    reviewCount: 154,
    price: 34.99,
    shippingText: 'Free Shipping',
  },
  {
    id: 'ph-8',
    title: 'Sweet Basil & Herb Seed Pack (10 Varieties)',
    category: 'seeds',
    imageSrc: 'https://images.unsplash.com/photo-1520302723644-46526f5a7c2a?q=80&w=600&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 76,
    price: 9.99,
    originalPrice: 15.00,
    badgeText: '33% off',
    badgeLabel: 'Today Only',
    shippingText: 'Free Delivery',
    isTodayDeal: true,
  },
  {
    id: 'ph-9',
    title: 'Premium Liquid Plant Fertilizer (500ml)',
    category: 'care',
    imageSrc: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 110,
    price: 12.99,
    shippingText: '$3.50 Shipping',
  },
  {
    id: 'ph-10',
    title: 'Stripe Calathea Outdoor Shrub',
    category: 'outdoor',
    imageSrc: 'https://images.unsplash.com/photo-1508500383102-124b2f409c1a?q=80&w=600&auto=format&fit=crop',
    rating: 4.3,
    reviewCount: 64,
    price: 27.99,
    shippingText: 'Free Shipping',
  },
  {
    id: 'ph-11',
    title: 'Succulent Duo (Echeveria & Haworthia)',
    category: 'indoor',
    imageSrc: 'https://images.unsplash.com/photo-1520302723644-46526f5a7c2a?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 231,
    price: 15.99,
    originalPrice: 19.99,
    badgeText: '20% off',
    badgeLabel: 'Limited time offer',
    shippingText: '$4.99 Shipping',
  },
  {
    id: 'ph-12',
    title: 'Handmade Ceramic Plant Pots (Set of 2)',
    category: 'pots',
    imageSrc: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 43,
    price: 32.00,
    shippingText: '$9.00 Shipping',
  }
];
