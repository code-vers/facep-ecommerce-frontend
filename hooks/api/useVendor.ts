'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorApi, type VendorQueryParams } from '@/lib/api/vendor';
import { getApiErrorMessage } from '@/lib/api/axios';

export const VENDOR_QUERY_KEYS = {
  all: ['admin-vendors'] as const,
  list: (params?: VendorQueryParams) => ['admin-vendors', params] as const,
  detail: (id: string) => ['admin-vendor', id] as const,
};

export const useVendors = (params?: VendorQueryParams, enabled = true) => {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.list(params),
    queryFn: () => vendorApi.getVendors(params),
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useVendorById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.detail(id),
    queryFn: () => vendorApi.getVendorById(id),
    enabled: Boolean(id) && enabled,
  });
};

export const useUpdateVendorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' }) =>
      vendorApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.all });
      const label =
        variables.status === 'ACTIVE'
          ? 'activated'
          : variables.status === 'PENDING'
          ? 'set to pending'
          : 'suspended';
      toast.success(`Vendor ${label} successfully.`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update vendor status.'));
    },
  });
};

export const useBulkUpdateVendorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' }) =>
      vendorApi.bulkUpdateStatus(ids, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.all });
      const action =
        variables.status === 'ACTIVE'
          ? 'accepted'
          : variables.status === 'PENDING'
          ? 'marked pending'
          : 'rejected';
      toast.success(`${data.count ?? variables.ids.length} vendors ${action} successfully.`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update vendors.'));
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vendorApi.deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.all });
      toast.success('Vendor suspended successfully.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to suspend vendor.'));
    },
  });
};
