import {
  createDeal,
  deleteDeal,
  getActiveDeal,
  getDeals,
  updateDeal,
} from '@/lib/api/deal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDeals = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['deals', page, limit],
    queryFn: () => getDeals(page, limit),
  });
};

export const useActiveDeal = () => {
  return useQuery({
    queryKey: ['activeDeal'],
    queryFn: getActiveDeal,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['activeDeal'] });
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['activeDeal'] });
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['activeDeal'] });
    },
  });
};
