import { apiClient } from './axios';

export type VendorStatus = 'Active' | 'Pending' | 'Suspend';

export interface VendorWallet {
  pendingBalance: number | string;
  availableBalance: number | string;
  totalWithdrawn: number | string;
}

export interface VendorItem {
  id: string;
  name: string;
  storeName: string;
  email: string;
  contactNumber: string | null;
  address: string | null;
  avatarUrl: string | null;
  productsCount: number;
  totalSales: number;
  status: VendorStatus;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  wallet?: VendorWallet | null;
}

export interface VendorsCounts {
  all: number;
  pending: number;
  active: number;
  suspended: number;
}

export interface VendorsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: VendorsCounts;
}

export interface VendorQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  meta?: VendorsMeta;
}

export const vendorApi = {
  getVendors: async (params?: VendorQueryParams): Promise<{ data: VendorItem[]; meta: VendorsMeta }> => {
    const response = await apiClient.get<ApiResponse<VendorItem[]>>('/users/vendors', { params });
    return {
      data: response.data.data,
      meta: response.data.meta ?? {
        total: response.data.data.length,
        page: 1,
        limit: 10,
        totalPages: 1,
        counts: { all: response.data.data.length, pending: 0, active: response.data.data.length, suspended: 0 }
      }
    };
  },

  getVendorById: async (id: string): Promise<VendorItem> => {
    const response = await apiClient.get<ApiResponse<VendorItem>>(`/users/vendors/${id}`);
    return response.data.data;
  },

  updateStatus: async (
    id: string,
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'
  ): Promise<VendorItem> => {
    const response = await apiClient.patch<ApiResponse<VendorItem>>(`/users/vendors/${id}/status`, { status });
    return response.data.data;
  },

  bulkUpdateStatus: async (
    ids: string[],
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'
  ): Promise<{ count: number }> => {
    const response = await apiClient.patch<ApiResponse<{ count: number }>>('/users/vendors/bulk-status', {
      ids,
      status
    });
    return response.data.data;
  },

  deleteVendor: async (id: string): Promise<VendorItem> => {
    const response = await apiClient.delete<ApiResponse<VendorItem>>(`/users/vendors/${id}`);
    return response.data.data;
  }
};
