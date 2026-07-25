import { apiClient } from './axios';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  message: string;
  status: 'PENDING' | 'REPLIED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryPayload {
  name: string;
  email: string;
  contactNumber?: string;
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

export const createInquiry = async (payload: CreateInquiryPayload): Promise<Inquiry> => {
  const { data } = await apiClient.post<ApiResponse<Inquiry>>('/inquiries', payload);
  return data.data;
};

export const getInquiries = async (
  page = 1,
  limit = 10,
  status?: string,
): Promise<{ data: Inquiry[]; meta?: ApiResponse<Inquiry[]>['meta'] }> => {
  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) queryParams.append('status', status);

  const { data } = await apiClient.get<ApiResponse<Inquiry[]>>(`/inquiries?${queryParams.toString()}`);
  return { data: data.data, meta: data.meta };
};

export const updateInquiry = async ({
  id,
  ...payload
}: { id: string } & Partial<Inquiry>): Promise<Inquiry> => {
  const { data } = await apiClient.patch<ApiResponse<Inquiry>>(`/inquiries/${id}`, payload);
  return data.data;
};

export const deleteInquiry = async (id: string): Promise<Inquiry> => {
  const { data } = await apiClient.delete<ApiResponse<Inquiry>>(`/inquiries/${id}`);
  return data.data;
};
