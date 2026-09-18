'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reviewApi } from '@/lib/api/review';
import { getApiErrorMessage } from '@/lib/api/axios';

export const REVIEW_QUERY_KEYS = {
  vendorReviews: ['vendor-reviews'] as const,
};

export const useVendorReviews = (enabled = true) => {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.vendorReviews,
    queryFn: () => reviewApi.getVendorReviews(),
    enabled,
    staleTime: 30 * 1000,
  });
};

export const useReplyToReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, replyText }: { reviewId: string; replyText: string }) =>
      reviewApi.replyToReview(reviewId, replyText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.vendorReviews });
      toast.success('Reply submitted successfully!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to submit reply.'));
    },
  });
};
