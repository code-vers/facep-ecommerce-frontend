import { apiClient } from './axios';

export interface IVendorStorefront {
  id?: string;
  vendorId: string;
  storeName: string;
  storeLogo: string | null;
  storeBanner: string | null;
  bannerHeadline: string;
  bannerSubheadline: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  returnPolicy: string;
  shippingPolicy: string;
  warrantyInformation: string;
  createdAt?: string;
  updatedAt?: string;
  productCount?: number;
}

export interface IUpdateStorefrontPayload {
  storeName?: string;
  storeLogo?: string;
  storeBanner?: string;
  bannerHeadline?: string;
  bannerSubheadline?: string;
  storeDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  returnPolicy?: string;
  shippingPolicy?: string;
  warrantyInformation?: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const storefrontApi = {
  getStorefront: async (): Promise<IVendorStorefront> => {
    const response = await apiClient.get<ApiResponse<IVendorStorefront>>('/storefront/vendor');
    return response.data.data;
  },

  getPublicStorefront: async (vendorId: string): Promise<IVendorStorefront> => {
    const response = await apiClient.get<ApiResponse<IVendorStorefront>>(`/storefront/${vendorId}`);
    return response.data.data;
  },

  updateStorefront: async (payload: IUpdateStorefrontPayload): Promise<IVendorStorefront> => {
    const response = await apiClient.patch<ApiResponse<IVendorStorefront>>('/storefront/vendor', payload);
    return response.data.data;
  },

  uploadLogo: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file, file.name || 'logo.png');
    const response = await apiClient.post<ApiResponse<string>>('/uploads/avatar', form);
    return response.data.data;
  },

  uploadBanner: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('files', file, file.name || 'banner.png');
    const response = await apiClient.post<ApiResponse<string[]>>('/uploads/storefront', form);
    return response.data.data[0];
  },
};
