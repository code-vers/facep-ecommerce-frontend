import type { AuthResponse, LoginPayload, RegisterPayload } from '../auth/auth.types';
import { apiClient } from './axios';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  register: async (data: RegisterPayload) => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginPayload) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/users/me');
    return response.data;
  },
};
