import { useMemo } from 'react';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/lib/api/category';
import { CategoryGridData } from '@/lib/homepage-data';
import { getImageUrl } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCategories = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['categories', page, limit],
    queryFn: () => getCategories(page, limit),
  });
};

export const useHomepageCategoryGrids = () => {
  const { data, isLoading, error } = useCategories(1, 32);

  const cards: CategoryGridData[] = useMemo(() => {
    const categories = data?.data || [];
    if (!categories.length) return [];

    const resultCards: CategoryGridData[] = [];
    // Group 32 categories into 8 cards of 4 categories each (2x2 grid per card)
    for (let i = 0; i < categories.length && resultCards.length < 8; i += 4) {
      const chunk = categories.slice(i, i + 4);
      resultCards.push({
        id: `homepage-cat-card-${resultCards.length + 1}`,
        title: '', // Title removed per user requirement
        exploreHref: '/products', // Redirects to /products per user requirement
        exploreLabel: 'Explore All',
        items: chunk.map((cat) => ({
          label: cat.name,
          imageSrc: getImageUrl(cat.imageUrl) || '/banner.png',
          href: `/products?category=${encodeURIComponent(cat.name)}`,
        })),
      });
    }
    return resultCards;
  }, [data]);

  const grid1 = cards.slice(0, 4);
  const grid2 = cards.slice(4, 8);

  return {
    grid1,
    grid2,
    hasData: cards.length > 0,
    isLoading,
    error,
  };
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
