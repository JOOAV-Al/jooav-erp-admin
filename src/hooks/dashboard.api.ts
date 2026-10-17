import { Order } from "@/features/orders/types";
import { User } from "@/interfaces/authentication";
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  activeOrders: Order[];
  recentUsers: User[];
  stats: {
    totalRevenue: number;
    completedOrders: number;
    liveProducts: number;
    allUsers: number;
    paymentsToVerify: number;
  };
}

export interface OutOfStockReportItem {
  id: string;
  reportId?: string;
  orderId?: string;
  orderItemId?: string;
  productId?: string;
  quantityAffected: number;
  createdAt?: string;
  order?: {
    id: string;
    orderNumber: string;
    status: string;
    orderDate: string | null;
    submittedAt: string | null;
    confirmedAt: string | null;
    totalAmount: string;
  };
  orderItem?: {
    id: string;
    quantity: number;
    status: string;
    unitPrice: string;
    lineTotal: string;
  };
  product: {
    id: string;
    name: string;
    sku?: string;
    thumbnail: string | null;
    images: string[];
    price?: string;
    packSize?: {
      id?: string;
      name: string;
    };
    packType?: {
      id?: string;
      name: string;
    };
  };
}

export interface OutOfStockReport {
  id: string;
  wholesalerId?: string;
  status: string;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  wholesaler: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role: string;
    status: string;
    createdAt?: string;
  };
  items: OutOfStockReportItem[];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await api.get(`/admin/dashboard`, {
    noToast: true,
  } as CustomAxiosRequestConfig);
  return response.data.data;
}

export async function fetchOutOfStockReports(): Promise<OutOfStockReport[]> {
  const response = await api.get(`/orders/out-of-stock-reports`, {
    noToast: true,
  } as CustomAxiosRequestConfig);
  return response.data.data?.reports ?? [];
}

export const useGetDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => fetchDashboardData(),
    retry: 2,
  });
};

export const useGetOutOfStockReports = () => {
  return useQuery({
    queryKey: ["out-of-stock-reports"],
    queryFn: () => fetchOutOfStockReports(),
    retry: 2,
  });
};

export const useResolveOutOfStockReport = () => {
  return useInvalidatingMutation({
    mutationFn: ({ reportId }: { reportId: string }) =>
      api.patch(`/orders/out-of-stock-reports/${reportId}/resolve`, {}),
    invalidateQueries: [["out-of-stock-reports"]],
  });
};
