import {
  getAdminCoupons,
  getCouponStats,
  getCouponById,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
  getPublicCoupons,
  validateCoupon,
  CouponQueryParams,
  CreateCouponPayload,
  UpdateCouponPayload,
  ValidateCouponPayload,
} from '@/lib/api/coupon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAdminCoupons = (params?: CouponQueryParams) => {
  return useQuery({
    queryKey: ['coupons', 'admin', params],
    queryFn: () => getAdminCoupons(params),
  });
};

export const useCouponStats = () => {
  return useQuery({
    queryKey: ['coupons', 'admin', 'stats'],
    queryFn: getCouponStats,
  });
};

export const useCouponById = (id?: string) => {
  return useQuery({
    queryKey: ['coupons', 'admin', 'detail', id],
    queryFn: () => getCouponById(id as string),
    enabled: Boolean(id),
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => createCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCouponPayload }) =>
      updateCoupon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useToggleCouponStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleCouponStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const usePublicCoupons = (filters?: { search?: string; categoryId?: string }) => {
  return useQuery({
    queryKey: ['coupons', 'public', filters],
    queryFn: () => getPublicCoupons(filters),
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (payload: ValidateCouponPayload) => validateCoupon(payload),
  });
};
