import { useAuth } from '@/contexts/AuthContext';
import {
  checkWishlistStatus,
  getUserWishlistedProductIds,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
  type WishlistQueryParams
} from '@/lib/api/wishlist';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


// get wishtlist
export const useWishlist = (params?: WishlistQueryParams) => {
  // get Session
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['wishlist', 'mine', userId, params],
    queryFn: () => getWishlist(params),
    enabled: Boolean(userId)
  });
};

// check wishlist status
export const useCheckWishlistStatus = (productId: string) => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['wishlist', 'status', userId, productId],
    queryFn: () => checkWishlistStatus(productId),
    enabled: Boolean(userId && productId)
  });
};

// get wishlist product ids
export const useUserWishlistedProductIds = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['wishlist', 'product-ids', userId],
    queryFn: () => getUserWishlistedProductIds(),
    enabled: Boolean(userId)
  });
};


// Toggale wishlist
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: (productId: string) => toggleWishlist(productId),
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });

      const previousProductIds = queryClient.getQueryData<string[]>(['wishlist', 'product-ids', userId]);
      const previousStatus = queryClient.getQueryData<{ isWishlisted: boolean; wishlistId?: string | null }>(['wishlist', 'status', userId, productId]);

      if (previousProductIds) {
        const isWishlisted = previousProductIds.includes(productId);
        const updatedIds = isWishlisted
          ? previousProductIds.filter((id) => id !== productId)
          : [...previousProductIds, productId];
        queryClient.setQueryData(['wishlist', 'product-ids', userId], updatedIds);
      }

      if (previousStatus !== undefined) {
        queryClient.setQueryData(['wishlist', 'status', userId, productId], {
          ...previousStatus,
          isWishlisted: !previousStatus.isWishlisted
        });
      }

      queryClient.setQueriesData({ queryKey: ['wishlist', 'mine', userId] }, (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;
        const exists = oldData.data.some(
          (item: any) => item.product?.id === productId || item.productId === productId
        );
        if (exists) {
          return {
            ...oldData,
            data: oldData.data.filter((item: any) => item.product?.id !== productId && item.productId !== productId),
            meta: oldData.meta ? { ...oldData.meta, total: Math.max(0, oldData.meta.total - 1) } : oldData.meta
          };
        }
        return oldData;
      });

      return { previousProductIds, previousStatus };
    },
    onError: (_err, productId, context: any) => {
      if (context?.previousProductIds) {
        queryClient.setQueryData(['wishlist', 'product-ids', userId], context.previousProductIds);
      }
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(['wishlist', 'status', userId, productId], context.previousStatus);
      }
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });
};

// Remvoe wishlist

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });

      const previousProductIds = queryClient.getQueryData<string[]>(['wishlist', 'product-ids', userId]);
      const previousStatus = queryClient.getQueryData<{ isWishlisted: boolean; wishlistId?: string | null }>(['wishlist', 'status', userId, productId]);

      if (previousProductIds) {
        queryClient.setQueryData(
          ['wishlist', 'product-ids', userId],
          previousProductIds.filter((id) => id !== productId)
        );
      }

      if (previousStatus !== undefined) {
        queryClient.setQueryData(['wishlist', 'status', userId, productId], {
          ...previousStatus,
          isWishlisted: false
        });
      }

      queryClient.setQueriesData({ queryKey: ['wishlist', 'mine', userId] }, (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((item: any) => item.product?.id !== productId && item.productId !== productId),
          meta: oldData.meta ? { ...oldData.meta, total: Math.max(0, oldData.meta.total - 1) } : oldData.meta
        };
      });

      return { previousProductIds, previousStatus };
    },
    onError: (_err, productId, context: any) => {
      if (context?.previousProductIds) {
        queryClient.setQueryData(['wishlist', 'product-ids', userId], context.previousProductIds);
      }
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(['wishlist', 'status', userId, productId], context.previousStatus);
      }
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });
};
