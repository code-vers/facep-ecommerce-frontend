import {
  createInquiry,
  deleteInquiry,
  getInquiries,
  updateInquiry,
  CreateInquiryPayload,
} from '@/lib/api/inquiry';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useInquiries = (page = 1, limit = 10, status?: string) => {
  return useQuery({
    queryKey: ['inquiries', page, limit, status],
    queryFn: () => getInquiries(page, limit, status),
  });
};

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInquiryPayload) => createInquiry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};

export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};
