import { apiClient } from './axios';

export type CouponDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
export type CouponScope = 'ALL' | 'CATEGORY' | 'PRODUCT';

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  discountType: CouponDiscountType;
  discountValue: number | string;
  maxDiscountAmount?: number | string | null;
  minOrderAmount: number | string;
  scope: CouponScope;
  categoryIds: string[];
  productIds: string[];
  usageLimit?: number | null;
  usageCount: number;
  userUsageLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isPublic: boolean;
  badgeText?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
  expiringSoon: number;
}

export interface CreateCouponPayload {
  code: string;
  title: string;
  description?: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount?: number | null;
  minOrderAmount?: number;
  scope?: CouponScope;
  categoryIds?: string[];
  productIds?: string[];
  usageLimit?: number | null;
  userUsageLimit?: number;
  startDate?: string;
  endDate: string;
  isActive?: boolean;
  isPublic?: boolean;
  badgeText?: string | null;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> {}

export interface CouponQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isPublic?: boolean;
  scope?: CouponScope;
  discountType?: CouponDiscountType;
  sortBy?: string;
}

export interface ValidateCouponPayload {
  code: string;
  cartItems?: Array<{
    productId: string;
    price: number;
    quantity: number;
    categoryId?: string;
  }>;
  subtotal: number;
}

export interface ValidateCouponResponse {
  isValid: boolean;
  couponId: string;
  code: string;
  title: string;
  discountType: CouponDiscountType;
  discountValue: number;
  discountAmount: number;
  minOrderAmount: number;
  scope: CouponScope;
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

// ── Admin API Methods ────────────────────────────────────────────────────────

export const getAdminCoupons = async (
  params?: CouponQueryParams
): Promise<{ data: Coupon[]; meta?: ApiResponse<Coupon[]>['meta'] }> => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.search) query.append('search', params.search);
  if (params?.isActive !== undefined) query.append('isActive', String(params.isActive));
  if (params?.isPublic !== undefined) query.append('isPublic', String(params.isPublic));
  if (params?.scope) query.append('scope', params.scope);
  if (params?.discountType) query.append('discountType', params.discountType);
  if (params?.sortBy) query.append('sortBy', params.sortBy);

  const { data } = await apiClient.get<ApiResponse<Coupon[]>>(
    `/coupons/admin${query.toString() ? `?${query.toString()}` : ''}`
  );
  return { data: data.data, meta: data.meta };
};

export const getCouponStats = async (): Promise<CouponStats> => {
  const { data } = await apiClient.get<ApiResponse<CouponStats>>('/coupons/admin/stats');
  return data.data;
};

export const getCouponById = async (id: string): Promise<Coupon> => {
  const { data } = await apiClient.get<ApiResponse<Coupon>>(`/coupons/admin/${id}`);
  return data.data;
};

export const createCoupon = async (payload: CreateCouponPayload): Promise<Coupon> => {
  const { data } = await apiClient.post<ApiResponse<Coupon>>('/coupons', payload);
  return data.data;
};

export const updateCoupon = async (
  id: string,
  payload: UpdateCouponPayload
): Promise<Coupon> => {
  const { data } = await apiClient.patch<ApiResponse<Coupon>>(`/coupons/${id}`, payload);
  return data.data;
};

export const toggleCouponStatus = async (id: string): Promise<Coupon> => {
  const { data } = await apiClient.patch<ApiResponse<Coupon>>(`/coupons/${id}/toggle`);
  return data.data;
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await apiClient.delete(`/coupons/${id}`);
};

// ── Public / Storefront API Methods ──────────────────────────────────────────

export const getPublicCoupons = async (filters?: {
  search?: string;
  categoryId?: string;
}): Promise<Coupon[]> => {
  const query = new URLSearchParams();
  if (filters?.search) query.append('search', filters.search);
  if (filters?.categoryId) query.append('categoryId', filters.categoryId);

  const { data } = await apiClient.get<ApiResponse<Coupon[]>>(
    `/coupons/public${query.toString() ? `?${query.toString()}` : ''}`
  );
  return data.data;
};

export const validateCoupon = async (
  payload: ValidateCouponPayload
): Promise<ValidateCouponResponse> => {
  const { data } = await apiClient.post<ApiResponse<ValidateCouponResponse>>(
    '/coupons/validate',
    payload
  );
  return data.data;
};
