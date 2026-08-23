import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProductFacets,
  getProducts,
  getRelatedProducts,
  getVendorProductById,
  getVendorProducts,
  getAdminProducts,
  getVendorProductStats,
  updateProduct,
  updateProductPromotion,
  updateProductStatus,
  removeProductPromotion,
  type ProductQueryParams,
} from '@/lib/api/product';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProducts = (params?: ProductQueryParams) =>
  useQuery({ queryKey: ['products', 'public', params], queryFn: () => getProducts(params) });

export const useVendorProducts = (params?: ProductQueryParams, enabled: boolean = true) => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    // Vendor product data belongs to the logged-in vendor, not just the route.
    queryKey: ['products', 'vendor', userId, params],
    queryFn: () => getVendorProducts(params),
    enabled: enabled && Boolean(userId),
  });
};

export const useAdminProducts = (params?: ProductQueryParams, enabled: boolean = true) =>
  useQuery({
    queryKey: ['products', 'admin', params],
    queryFn: () => getAdminProducts(params),
    enabled,
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['products', 'detail', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
  });

export const useVendorProduct = (id: string) => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['products', 'vendor-detail', userId, id],
    queryFn: () => getVendorProductById(id),
    enabled: Boolean(userId && id),
  });
};

export const useRelatedProducts = (slug: string) =>
  useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: () => getRelatedProducts(slug),
    enabled: Boolean(slug),
  });

export const useProductFacets = () =>
  useQuery({ queryKey: ['products', 'facets'], queryFn: getProductFacets });

export const useVendorProductStats = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['products', 'vendor-stats', userId],
    queryFn: getVendorProductStats,
    enabled: Boolean(userId),
  });
};

const useProductMutation = <TVariables,>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useCreateProduct = () => useProductMutation(createProduct);
export const useUpdateProduct = () => useProductMutation(updateProduct);
export const useUpdateProductStatus = () => useProductMutation(updateProductStatus);
export const useUpdateProductPromotion = () => useProductMutation(updateProductPromotion);
export const useRemoveProductPromotion = () => useProductMutation(removeProductPromotion);
export const useDeleteProduct = () => useProductMutation(deleteProduct);
