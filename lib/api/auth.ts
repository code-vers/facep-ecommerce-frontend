import type { AuthResponse, LoginPayload, RegisterPayload } from '../auth/auth.types';
import { apiClient } from './axios';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  register: async (data: RegisterPayload) => {
    const response = await apiClient.post<ApiResponse<Record<string, unknown>>>(
      '/auth/register',
      data,
    );
    return response.data;
  },

  login: async (data: LoginPayload) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>('/users/me');
    return response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', data);
    return response.data;
  },

  verifyResetCode: async (data: { email: string; resetCode: string }) => {
    const response = await apiClient.post<ApiResponse<{ resetToken: string }>>(
      '/auth/verify-reset-code',
      data,
    );
    return response.data;
  },

  resetPassword: async (data: { resetToken: string; newPassword: string }) => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/reset-password', data);
    return response.data;
  },
};
