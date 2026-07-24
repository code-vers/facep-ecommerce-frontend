import { apiClient } from './axios';

export interface Courier {
  id: string;
  name: string;
  rate: number;
  deliveryTime: string;
  shipments: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingZone {
  id: string;
  zoneName: string;
  countries: string;
  baseRate: number;
  perKgRate: number;
  isFreeShipping: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export const getCouriers = async (page = 1, limit = 4): Promise<{ data: Courier[]; meta?: ApiResponse<Courier[]>['meta'] }> => {
  const { data } = await apiClient.get<ApiResponse<Courier[]>>(`/couriers?page=${page}&limit=${limit}`);
  return { data: data.data, meta: data.meta };
};

export const createCourier = async (payload: Partial<Courier>): Promise<Courier> => {
  const { data } = await apiClient.post<ApiResponse<Courier>>('/couriers', payload);
  return data.data;
};

export const updateCourier = async ({
  id,
  ...payload
}: { id: string } & Partial<Courier>): Promise<Courier> => {
  const { data } = await apiClient.patch<ApiResponse<Courier>>(`/couriers/${id}`, payload);
  return data.data;
};

export const deleteCourier = async (id: string): Promise<Courier> => {
  const { data } = await apiClient.delete<ApiResponse<Courier>>(`/couriers/${id}`);
  return data.data;
};

export const getShippingZones = async (): Promise<ShippingZone[]> => {
  const { data } = await apiClient.get<ApiResponse<ShippingZone[]>>('/shipping-zones');
  return data.data;
};

export const createShippingZone = async (payload: Partial<ShippingZone>): Promise<ShippingZone> => {
  const { data } = await apiClient.post<ApiResponse<ShippingZone>>('/shipping-zones', payload);
  return data.data;
};

export const updateShippingZone = async ({
  id,
  ...payload
}: { id: string } & Partial<ShippingZone>): Promise<ShippingZone> => {
  const { data } = await apiClient.patch<ApiResponse<ShippingZone>>(
    `/shipping-zones/${id}`,
    payload,
  );
  return data.data;
};

export const deleteShippingZone = async (id: string): Promise<ShippingZone> => {
  const { data } = await apiClient.delete<ApiResponse<ShippingZone>>(`/shipping-zones/${id}`);
  return data.data;
};
