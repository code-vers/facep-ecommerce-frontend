import { apiClient } from './axios';

export interface IReviewItem {
  id: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  rating: number;
  comment: string;
  replyText: string | null;
  replyDate: string | null;
  createdAt: string;
}

export interface ICategoryReviewProduct {
  id: string;
  name: string;
  thumbnail: string;
  basePrice: number;
  totalReviews: number;
  overallRating: number;
  unitsSold: number;
  reviews: IReviewItem[];
}

export interface ICategoryReview {
  categoryId: string;
  categoryName: string;
  categoryImage: string | null;
  totalReviews: number;
  averageRating: number;
  productsCount: number;
  products: ICategoryReviewProduct[];
}

export interface ITopRatedProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  rating: number;
  price: number;
  reviewsCount: number;
}

export interface IReviewStats {
  averageRating: number;
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
}

export interface IVendorReviewsResponse {
  stats: IReviewStats;
  topRatedProducts: ITopRatedProduct[];
  categoryReviews: ICategoryReview[];
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const reviewApi = {
  getVendorReviews: async (): Promise<IVendorReviewsResponse> => {
    const response = await apiClient.get<ApiResponse<IVendorReviewsResponse>>('/reviews/vendor');
    return response.data.data;
  },
  replyToReview: async (reviewId: string, replyText: string): Promise<IReviewItem> => {
    const response = await apiClient.patch<ApiResponse<IReviewItem>>(`/reviews/${reviewId}/reply`, {
      replyText,
    });
    return response.data.data;
  },
};
