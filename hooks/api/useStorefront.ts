'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { storefrontApi, type IUpdateStorefrontPayload } from '@/lib/api/storefront';
import { getApiErrorMessage } from '@/lib/api/axios';

export const STOREFRONT_QUERY_KEYS = {
  vendorStorefront: ['vendor-storefront'] as const,
};

export const useStorefront = (enabled = true) => {
  return useQuery({
    queryKey: STOREFRONT_QUERY_KEYS.vendorStorefront,
    queryFn: () => storefrontApi.getStorefront(),
    enabled,
    staleTime: 30 * 1000,
  });
};

export const usePublicStorefront = (vendorId: string, enabled = true) => {
  return useQuery({
    queryKey: ['public-storefront', vendorId],
    queryFn: () => storefrontApi.getPublicStorefront(vendorId),
    enabled: enabled && Boolean(vendorId),
    staleTime: 60 * 1000,
  });
};

export const useUpdateStorefront = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateStorefrontPayload) => storefrontApi.updateStorefront(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOREFRONT_QUERY_KEYS.vendorStorefront });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-overview'] });
      toast.success('Storefront saved successfully!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to save storefront.'));
    },
  });
};
