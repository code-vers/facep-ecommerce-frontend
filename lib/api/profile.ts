import { apiClient } from './axios';

export type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN';
export type PaymentPreference = 'COD' | 'CARD';
export type CardBrand = 'VISA' | 'MASTERCARD';

export interface Address {
  id: string;
  label: string;
  addressLine: string;
  phone: string;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  label: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  contactNumber: string | null;
  address: string | null;
  avatarUrl: string | null;
  preferredPaymentMethod: PaymentPreference;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  addresses: Address[];
  paymentMethods: SavedPaymentMethod[];
}

export interface PlatformSettings {
  id: string;
  siteName: string;
  adminEmail: string | null;
  supportEmail: string | null;
  address: string | null;
  defaultCurrency: string;
  defaultTimezone: string;
  commissionRate: string;
  paymentGatewayFee: string;
}

interface ApiResponse<T> { data: T; message: string; success: boolean; meta?: { total: number; page: number; limit: number } }
const unwrap = <T>(request: Promise<{ data: ApiResponse<T> }>) => request.then((response) => response.data.data);

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');
export const profileAssetUrl = (value: string | null | undefined) =>
  value && value.startsWith('/') ? `${apiOrigin}${value}` : value || '';

export const profileApi = {
  getMe: () => unwrap<Profile>(apiClient.get('/users/me')),
  updateMe: (data: Partial<Pick<Profile, 'name' | 'contactNumber' | 'address' | 'avatarUrl'>>) =>
    unwrap<Profile>(apiClient.patch('/users/me', data)),
  deactivateMe: (currentPassword: string) => unwrap<Profile>(apiClient.delete('/users/me', { data: { currentPassword } })),
  changePassword: (data: { oldPassword: string; newPassword: string }) => unwrap<null>(apiClient.post('/auth/change-password', data)),
  uploadAvatar: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post<ApiResponse<string>>('/uploads/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  createAddress: (data: Omit<Address, 'id'>) => unwrap<Address>(apiClient.post('/users/me/addresses', data)),
  updateAddress: (id: string, data: Partial<Omit<Address, 'id'>>) => unwrap<Address>(apiClient.patch(`/users/me/addresses/${id}`, data)),
  defaultAddress: (id: string) => unwrap<Address>(apiClient.patch(`/users/me/addresses/${id}/default`)),
  deleteAddress: (id: string) => unwrap<Address>(apiClient.delete(`/users/me/addresses/${id}`)),
  createPaymentMethod: (data: Omit<SavedPaymentMethod, 'id'>) => unwrap<SavedPaymentMethod>(apiClient.post('/users/me/payment-methods', data)),
  updatePaymentMethod: (id: string, data: Partial<Omit<SavedPaymentMethod, 'id'>>) => unwrap<SavedPaymentMethod>(apiClient.patch(`/users/me/payment-methods/${id}`, data)),
  defaultPaymentMethod: (id: string) => unwrap<SavedPaymentMethod>(apiClient.patch(`/users/me/payment-methods/${id}/default`)),
  deletePaymentMethod: (id: string) => unwrap<SavedPaymentMethod>(apiClient.delete(`/users/me/payment-methods/${id}`)),
  updatePaymentPreference: (preferredPaymentMethod: PaymentPreference) =>
    unwrap<Profile>(apiClient.patch('/users/me/payment-preference', { preferredPaymentMethod })),
  getPlatformSettings: () => unwrap<PlatformSettings>(apiClient.get('/users/platform-settings')),
  updatePlatformSettings: (data: Partial<Omit<PlatformSettings, 'commissionRate' | 'paymentGatewayFee'>> & { commissionRate?: number; paymentGatewayFee?: number }) => unwrap<PlatformSettings>(apiClient.patch('/users/platform-settings', data)),
  getUsers: async () => {
    const response = await apiClient.get<ApiResponse<Profile[]>>('/users', { params: { limit: 100 } });
    return response.data.data;
  },
  reactivateUser: (id: string) => unwrap<Profile>(apiClient.patch(`/users/${id}/reactivate`)),
};
