import { apiClient } from './axios';
import type { Product } from './product';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface WishlistStatusResponse {
  isWishlisted: boolean;
  wishlistId?: string | null;
}

export interface ToggleWishlistResponse {
  isWishlisted: boolean;
  wishlistId?: string;
  data?: WishlistItem;
  message: string;
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

export const getWishlist = async (params?: WishlistQueryParams) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);

  const queryString = query.toString();
  const { data } = await apiClient.get<ApiResponse<WishlistItem[]>>(
    `/wishlist/mine${queryString ? `?${queryString}` : ''}`
  );

  return {
    data: data.data,
    meta: data.meta
  };
};

export const checkWishlistStatus = async (productId: string) => {
  if (!productId) return { isWishlisted: false, wishlistId: null };
  const { data } = await apiClient.get<ApiResponse<WishlistStatusResponse>>(
    `/wishlist/check/${productId}`
  );
  return data.data;
};

export const getUserWishlistedProductIds = async () => {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/wishlist/product-ids');
  return data.data;
};

export const toggleWishlist = async (productId: string) => {
  const { data } = await apiClient.post<ApiResponse<ToggleWishlistResponse>>('/wishlist/toggle', {
    productId
  });
  return data.data;
};

export const addToWishlist = async (productId: string) => {
  const { data } = await apiClient.post<ApiResponse<ToggleWishlistResponse>>('/wishlist', {
    productId
  });
  return data.data;
};

export const removeFromWishlist = async (productId: string) => {
  const { data } = await apiClient.delete<ApiResponse<{ isWishlisted: boolean; message: string }>>(
    `/wishlist/${productId}`
  );
  return data.data;
};
