import { apiClient } from './axios';
import type { Category, Subcategory } from './category';

export interface ProductVariant {
  id?: string;
  sku: string;
  image?: string | null;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  storage?: string | null;
  price: number | string;
  stock: number;
}

export interface ProductSpecification {
  id?: string;
  name: string;
  value: string;
}

export interface ProductVendor {
  id: string;
  name: string;
  email?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  vendorId?: string | null;
  vendor?: ProductVendor | null;
  isActive: boolean;
  publishedAt: string;
  brand?: string | null;
  productType?: string | null;
  shortDescription?: string | null;
  categoryId: string;
  category?: Category | null;
  subcategoryId?: string | null;
  subcategory?: Subcategory | null;
  tags: string[];
  condition: 'NEW' | 'RENEWED' | 'USED';
  availableColors: string[];
  thumbnail: string;
  previewImages: string[];
  hasVariants: boolean;
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  basePrice: number | string;
  oldPrice?: number | string | null;
  discountType?: 'PERCENTAGE' | 'FIXED' | null;
  discountValue?: number | string | null;
  dealBadgeText?: string | null;
  dealStartDate?: string | null;
  dealEndDate?: string | null;
  taxAmount?: number | string | null;
  vatGst?: number | string | null;
  importCharges?: number | string | null;
  handlingFee?: number | string | null;
  shipsFrom: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  shippingFeeType: 'FREE' | 'STANDARD' | 'PREDEFINED';
  shippingCost?: number | string | null;
  shippingZoneId?: string | null;
  courierId?: string | null;
  deliveryStandard: boolean;
  deliveryCod: boolean;
  deliveryExpress: boolean;
  deliveryReturnPickup: boolean;
  keyFeatures?: string | null;
  detailedDescription?: string | null;
  returnPolicy?: string | null;
  returnTerms?: string | null;
  stockQuantity: number;
  stockStatus: 'AVAILABLE' | 'OUT_OF_STOCK';
  lowStockAlertQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  inventoryManagedBy?: string | null;
  warehouseLocation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  searchTerm?: string;
  category?: string;
  categoryId?: string;
  subcategory?: string;
  condition?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  inStock?: boolean;
  status?: string;
  sort?: string;
}

export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
}

export interface ProductPromotionPayload {
  id: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  dealBadgeText?: string;
  dealStartDate?: string;
  dealEndDate?: string;
}

export interface ProductFacets {
  categories: Array<Category & { _count?: { products: number } }>;
  vendors: Array<{ id: string; name: string; _count: { products: number } }>;
  price: { min: number | string; max: number | string };
  colors: string[];
  conditions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

const buildQuery = (params?: ProductQueryParams) => {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== false) query.set(key, String(value));
  });
  return query.toString();
};

const unwrapList = (response: ApiResponse<Product[]>) => ({
  data: response.data,
  meta: response.meta,
});

export const getProducts = async (params?: ProductQueryParams) => {
  const query = buildQuery(params);
  const { data } = await apiClient.get<ApiResponse<Product[]>>(`/products${query ? `?${query}` : ''}`);
  return unwrapList(data);
};

export const getVendorProducts = async (params?: ProductQueryParams) => {
  const query = buildQuery(params);
  const { data } = await apiClient.get<ApiResponse<Product[]>>(
    `/products/vendor/mine${query ? `?${query}` : ''}`,
  );
  return unwrapList(data);
};

export const getAdminProducts = async (params?: ProductQueryParams) => {
  const query = buildQuery(params);
  const { data } = await apiClient.get<ApiResponse<Product[]>>(
    `/products/admin${query ? `?${query}` : ''}`,
  );
  return unwrapList(data);
};

export const getProductBySlug = async (slug: string) => {
  const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`);
  return data.data;
};

export const getVendorProductById = async (id: string) => {
  const { data } = await apiClient.get<ApiResponse<Product>>(`/products/vendor/${id}`);
  return data.data;
};

export const getRelatedProducts = async (slug: string) => {
  const { data } = await apiClient.get<ApiResponse<Product[]>>(`/products/${slug}/related`);
  return data.data;
};

export const getProductFacets = async () => {
  const { data } = await apiClient.get<ApiResponse<ProductFacets>>('/products/facets');
  return data.data;
};

export const getVendorProductStats = async () => {
  const { data } = await apiClient.get<ApiResponse<ProductStats>>('/products/vendor/stats');
  return data.data;
};

export const createProduct = async (payload: Partial<Product>) => {
  const { data } = await apiClient.post<ApiResponse<Product>>('/products', payload);
  return data.data;
};

export const updateProduct = async ({ id, ...payload }: { id: string } & Partial<Product>) => {
  const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, payload);
  return data.data;
};

export const updateProductStatus = async ({ id, isActive }: { id: string; isActive: boolean }) => {
  const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/status`, {
    isActive,
  });
  return data.data;
};

export const updateProductPromotion = async ({ id, ...payload }: ProductPromotionPayload) => {
  const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/promotion`, payload);
  return data.data;
};

export const removeProductPromotion = async (id: string) => {
  const { data } = await apiClient.delete<ApiResponse<Product>>(`/products/${id}/promotion`);
  return data.data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await apiClient.delete<ApiResponse<Product>>(`/products/${id}`);
  return data.data;
};
