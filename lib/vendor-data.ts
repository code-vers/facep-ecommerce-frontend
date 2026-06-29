/**
 * @fileoverview Mock data for the Vendor Dashboard Product Management layout.
 * Matches Figma Node 2161:5546 details.
 *
 * @module lib/vendor-data
 */

export interface VendorProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unitsSold: number;
  status: 'Active' | 'Low stock' | 'Out Of Stock';
  imageSrc: string;
}

export interface VendorStats {
  totalProducts: {
    value: number;
    trend: string;
    period: string;
  };
  lowStock: number;
  outOfStock: number;
  inStock: number;
}

export const VENDOR_STATS: VendorStats = {
  totalProducts: {
    value: 200,
    trend: '+10%',
    period: 'January',
  },
  lowStock: 3,
  outOfStock: 2,
  inStock: 155,
};

export const VENDOR_PRODUCTS: VendorProduct[] = [
  {
    id: 'AV001',
    name: 'Aloe Vera',
    category: 'Plant',
    price: 119.99,
    stock: 2400,
    unitsSold: 200,
    status: 'Active',
    imageSrc: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'SP002',
    name: 'Snake Plant',
    category: 'Plant',
    price: 79.99,
    stock: 2400,
    unitsSold: 300,
    status: 'Active',
    imageSrc: 'https://images.unsplash.com/photo-1598880940375-775b9577f101?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'ZZ003',
    name: 'ZZ Plant',
    category: 'Cactus',
    price: 89.99,
    stock: 2400,
    unitsSold: 300,
    status: 'Active',
    imageSrc: 'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'PL004',
    name: 'Peace Lily',
    category: 'Cactus',
    price: 39.99,
    stock: 15,
    unitsSold: 300,
    status: 'Low stock',
    imageSrc: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'MO005',
    name: 'Monstera',
    category: 'Cactus',
    price: 69.99,
    stock: 10,
    unitsSold: 300,
    status: 'Low stock',
    imageSrc: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'FF006',
    name: 'Fiddle Leaf Fig',
    category: 'Cactus',
    price: 49.99,
    stock: 0,
    unitsSold: 300,
    status: 'Out Of Stock',
    imageSrc: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?q=80&w=200&auto=format&fit=crop',
  },
];

export interface VendorReturnRequest {
  orderId: string;
  customerName: string;
  contactNo: string;
  productName: string;
  reason: string;
  condition: string;
  pickupDate: string;
  status: 'pending' | 'approved' | 'declined';
}

export const VENDOR_RETURNS: VendorReturnRequest[] = [
  {
    orderId: '#12345',
    customerName: 'Alice Johnson',
    contactNo: '+1234567890',
    productName: 'Aloe Vera',
    reason: 'Damaged in transit',
    condition: 'Damaged',
    pickupDate: '2023-11-20',
    status: 'pending',
  },
  {
    orderId: '#12346',
    customerName: 'Bob Smith',
    contactNo: '+1987654321',
    productName: 'Snake Plant',
    reason: 'Wrong item received',
    condition: 'Unopened',
    pickupDate: '2023-11-21',
    status: 'approved',
  }
];
