import { apiClient } from './axios';

export type BackendOrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type UIOrderStatus =
  | 'Ordered'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Returned';

export type TabType =
  | 'All Orders'
  | 'Ordered'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Returned';

export interface BackendOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  slug: string;
  sku?: string | null;
  quantity: number;
  price: number | string;
  image?: string | null;
  color?: string | null;
  size?: string | null;
  storage?: string | null;
  material?: string | null;
  vendorName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackendOrder {
  id: string;
  orderNumber: string;
  userId?: string | null;
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  country: string;
  city: string;
  location: string;
  note?: string | null;
  subtotal: number | string;
  shippingCost: number | string;
  taxAmount: number | string;
  vatGst: number | string;
  importCharges: number | string;
  handlingFee: number | string;
  total: number | string;
  paymentMethod: string;
  stripeSessionId?: string | null;
  status: BackendOrderStatus;
  items: BackendOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  all: number;
  ordered: number;
  packed: number;
  shipped: number;
  delivered: number;
  returned: number;
}

export interface OrdersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  stats?: OrderStats;
}

export interface GetMyOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TabType;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  meta?: OrdersMeta;
}

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);

export const formatOrderImageUrl = (url?: string | null) => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=300&auto=format&fit=crop';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${apiOrigin}${url}`;
  return `${apiOrigin}/${url}`;
};

export const mapBackendStatusToUI = (status: BackendOrderStatus): UIOrderStatus => {
  switch (status) {
    case 'PENDING_PAYMENT':
    case 'PAID':
      return 'Ordered';
    case 'PROCESSING':
      return 'Packed';
    case 'SHIPPED':
      return 'Shipped';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Returned';
    default:
      return 'Ordered';
  }
};

export const orderApi = {
  getMyOrders: async (params?: GetMyOrdersParams) => {
    const response = await apiClient.get<ApiResponse<BackendOrder[]>>('/orders/my-orders', {
      params,
    });
    return {
      orders: response.data.data,
      meta: response.data.meta,
    };
  },

  getMyOrderById: async (orderId: string) => {
    const response = await apiClient.get<ApiResponse<BackendOrder>>(
      `/orders/my-orders/${orderId}`,
    );
    return response.data.data;
  },

  cancelOrder: async (orderId: string, reason?: string) => {
    const response = await apiClient.patch<ApiResponse<BackendOrder>>(
      `/orders/my-orders/${orderId}/cancel`,
      { reason },
    );
    return response.data.data;
  },
};
