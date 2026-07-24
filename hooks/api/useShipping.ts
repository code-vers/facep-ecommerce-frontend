import {
  createCourier,
  createShippingZone,
  deleteCourier,
  deleteShippingZone,
  getCouriers,
  getShippingZones,
  updateCourier,
  updateShippingZone,
} from '@/lib/api/shipping';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCouriers = () => {
  return useQuery({
    queryKey: ['couriers'],
    queryFn: getCouriers,
  });
};

export const useCreateCourier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['couriers'] });
    },
  });
};

export const useUpdateCourier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['couriers'] });
    },
  });
};

export const useDeleteCourier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['couriers'] });
    },
  });
};

export const useShippingZones = () => {
  return useQuery({
    queryKey: ['shipping-zones'],
    queryFn: getShippingZones,
  });
};

export const useCreateShippingZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShippingZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
    },
  });
};

export const useUpdateShippingZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShippingZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
    },
  });
};

export const useDeleteShippingZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShippingZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
    },
  });
};
