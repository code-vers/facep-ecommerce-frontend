import {
  createDeal,
  deleteDeal,
  getActiveDeal,
  getDeals,
  getUnavailableDealCategoryIds,
  updateDeal,
} from '@/lib/api/deal';
import { useAuth } from '@/contexts/AuthContext';
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

export const useUnavailableDealCategoryIds = (excludeDealId?: string) => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    // Availability is role/user-specific: never reuse an admin result for a vendor.
    queryKey: ['deals', 'unavailable-categories', userId, excludeDealId],
    queryFn: () => getUnavailableDealCategoryIds(excludeDealId),
    enabled: Boolean(userId),
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['activeDeal'] });
      queryClient.invalidateQueries({ queryKey: ['deals', 'unavailable-categories'] });
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
      queryClient.invalidateQueries({ queryKey: ['deals', 'unavailable-categories'] });
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
      queryClient.invalidateQueries({ queryKey: ['deals', 'unavailable-categories'] });
    },
  });
};
