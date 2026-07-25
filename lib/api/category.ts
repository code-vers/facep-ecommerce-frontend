import { apiClient } from './axios';

export interface Category {
  id: string;
  name: string;
  subcategories: number; // In the table list, it's just a number
  products: number;
  orders: number;
  sales: string;
  status: 'Active' | 'Disable';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDetail extends Omit<Category, 'subcategories'> {
  subcategories: Subcategory[];
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

export const getCategories = async (
  page = 1,
  limit = 10,
): Promise<{ data: Category[]; meta?: ApiResponse<Category[]>['meta'] }> => {
  const { data } = await apiClient.get<ApiResponse<Category[]>>(
    `/categories?page=${page}&limit=${limit}`,
  );
  return { data: data.data, meta: data.meta };
};

export const createCategory = async (payload: {
  name: string;
  subcategories: string[];
  isActive: boolean;
}): Promise<Category> => {
  const { data } = await apiClient.post<ApiResponse<Category>>('/categories', payload);
  return data.data;
};

export const updateCategory = async ({
  id,
  ...payload
}: {
  id: string;
  name?: string;
  subcategories?: string[];
  isActive?: boolean;
}): Promise<Category> => {
  const { data } = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload);
  return data.data;
};

export const deleteCategory = async (id: string): Promise<Category> => {
  const { data } = await apiClient.delete<ApiResponse<Category>>(`/categories/${id}`);
  return data.data;
};
