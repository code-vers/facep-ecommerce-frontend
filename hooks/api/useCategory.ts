import { createCategory, deleteCategory, getCategories, updateCategory } from '@/lib/api/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCategories = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['categories', page, limit],
    queryFn: () => getCategories(page, limit),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
