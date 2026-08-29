'use client';

import { useAuth } from '@/contexts/AuthContext';
import { GetMyOrdersParams, orderApi } from '@/lib/api/order';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const orderKeys = {
  all: ['orders'] as const,
  myOrders: (params?: GetMyOrdersParams) => ['orders', 'my-orders', params] as const,
  myOrderDetail: (orderId: string) => ['orders', 'my-orders', 'detail', orderId] as const,
};

export const useMyOrders = (params?: GetMyOrdersParams) => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: orderKeys.myOrders(params),
    queryFn: () => orderApi.getMyOrders(params),
    enabled: Boolean(userId),
  });
};

export const useMyOrderById = (orderId: string, enabled: boolean = true) => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: orderKeys.myOrderDetail(orderId),
    queryFn: () => orderApi.getMyOrderById(orderId),
    enabled: enabled && Boolean(userId) && Boolean(orderId),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      orderApi.cancelOrder(orderId, reason),
    onSuccess: (_, variables) => {
      toast.success(`Order #${variables.orderId} cancelled successfully.`);
      void queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel order.');
    },
  });
};
