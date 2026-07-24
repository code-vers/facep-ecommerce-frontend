import type { AuthResponse, LoginPayload, RegisterPayload } from '../auth/auth.types';
import { apiClient } from './axios';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  register: async (data: RegisterPayload) => {
    const response = await apiClient.post<ApiResponse<AuthResponse['user']>>(
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
    const response = await apiClient.get<ApiResponse<AuthResponse['user']>>('/users/me');
    return response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', data);
    return response.data;
  },

  verifyResetCode: async (data: { email: string; code: string }) => {
    const response = await apiClient.post<ApiResponse<{ resetToken: string }>>(
      '/auth/verify-reset-code',
      { email: data.email, code: data.code },
    );
    return response.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/reset-password', {
      token: data.token,
      newPassword: data.newPassword,
    });
    return response.data;
  },
};
