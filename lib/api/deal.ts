import { apiClient } from './axios';

export interface Deal {
  id: string;
  title: string;
  bannerHeading?: string;
  bannerSubheading?: string;
  bannerImage?: string;
  bannerBgColor?: string;
  categoryIds: string[];
  categoryDetails?: Array<{ id: string; name: string }>;
  createdById?: string | null;
  createdBy?: { id: string; name: string; email: string } | null;
  addedBy?: 'ADMIN' | 'VENDOR' | null;
  discountStartPercent?: number;
  discountEndPercent?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealPayload {
  title: string;
  bannerHeading?: string;
  bannerSubheading?: string;
  bannerImage?: string;
  bannerBgColor?: string;
  categoryIds: string[];
  discountStartPercent?: number;
  discountEndPercent?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface UpdateDealPayload extends Partial<CreateDealPayload> {
  id: string;
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

export const getDeals = async (
  page = 1,
  limit = 10,
): Promise<{ data: Deal[]; meta?: ApiResponse<Deal[]>['meta'] }> => {
  const { data } = await apiClient.get<ApiResponse<Deal[]>>(`/deals?page=${page}&limit=${limit}`);
  return { data: data.data, meta: data.meta };
};

export const getActiveDeal = async (): Promise<Deal | null> => {
  const { data } = await apiClient.get<ApiResponse<Deal | null>>('/deals/active');
  return data.data;
};

export const getUnavailableDealCategoryIds = async (excludeDealId?: string): Promise<string[]> => {
  const query = excludeDealId ? `?excludeDealId=${encodeURIComponent(excludeDealId)}` : '';
  const { data } = await apiClient.get<ApiResponse<string[]>>(`/deals/category-availability${query}`);
  return data.data;
};

export const createDeal = async (payload: CreateDealPayload): Promise<Deal> => {
  const { data } = await apiClient.post<ApiResponse<Deal>>('/deals', payload);
  return data.data;
};

export const updateDeal = async ({ id, ...payload }: UpdateDealPayload): Promise<Deal> => {
  const { data } = await apiClient.patch<ApiResponse<Deal>>(`/deals/${id}`, payload);
  return data.data;
};

export const deleteDeal = async (id: string): Promise<Deal> => {
  const { data } = await apiClient.delete<ApiResponse<Deal>>(`/deals/${id}`);
  return data.data;
};
