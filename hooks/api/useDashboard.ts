'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';

export const DASHBOARD_QUERY_KEYS = {
  adminOverview: ['admin-overview'] as const,
};

export const useAdminOverview = (enabled = true) => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.adminOverview,
    queryFn: () => dashboardApi.getAdminOverview(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};
