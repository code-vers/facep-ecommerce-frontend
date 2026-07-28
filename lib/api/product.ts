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
  email: string;
}

export interface Product {
  id: string;
  sku: string;
  vendorId?: string | null;
  brand?: string | null;
  productType?: string | null;
  shortDescription?: string | null;
  categoryId: string;
  category?: Category | null;
  subcategoryId?: string | null;
  subcategory?: Subcategory | null;
  vendor?: ProductVendor | null;
  tags?: string[];
  condition?: 'NEW' | 'RENEWED' | 'USED';
  availableColors?: string[];
  thumbnail: string;
  previewImages?: string[];
  hasVariants?: boolean;
  variants?: ProductVariant[];
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
  shipsFrom?: string | null;
  minDeliveryDays?: number | null;
  maxDeliveryDays?: number | null;
  shippingFeeType?: 'FREE' | 'STANDARD' | 'PREDEFINED';
  shippingCost?: number | string | null;
  shippingZoneId?: string | null;
  courierId?: string | null;
  deliveryStandard?: boolean;
  deliveryCod?: boolean;
  deliveryExpress?: boolean;
  deliveryReturnPickup?: boolean;
  keyFeatures?: string | null;
  detailedDescription?: string | null;
  returnPolicy?: string | null;
  returnTerms?: string | null;
  stockQuantity: number;
  stockStatus: 'AVAILABLE' | 'OUT_OF_STOCK';
  lowStockAlertQuantity?: number | null;
  minOrderQuantity?: number | null;
  maxOrderQuantity?: number | null;
  inventoryManagedBy?: string | null;
  warehouseLocation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  vendorId?: string;
  status?: string;
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

export const getProducts = async (
  params?: ProductQueryParams,
): Promise<{ data: Product[]; meta?: ApiResponse<Product[]>['meta'] }> => {
  const query = new URLSearchParams();

  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.searchTerm) query.append('searchTerm', params.searchTerm);
  if (params?.categoryId) query.append('categoryId', params.categoryId);
  if (params?.vendorId) query.append('vendorId', params.vendorId);
  if (params?.status) query.append('status', params.status);

  const queryString = query.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  const { data } = await apiClient.get<ApiResponse<Product[]>>(endpoint);
  return { data: data.data, meta: data.meta };
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  return data.data;
};

export const createProduct = async (payload: Partial<Product>): Promise<Product> => {
  const { data } = await apiClient.post<ApiResponse<Product>>('/products', payload);
  return data.data;
};

export const updateProduct = async ({
  id,
  ...payload
}: {
  id: string;
} & Partial<Product>): Promise<Product> => {
  const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, payload);
  return data.data;
};

export const deleteProduct = async (id: string): Promise<Product> => {
  const { data } = await apiClient.delete<ApiResponse<Product>>(`/products/${id}`);
  return data.data;
};
