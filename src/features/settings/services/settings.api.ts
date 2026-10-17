import { PaymentSettings } from "@/features/settings/types";
import { MutationResponse } from "@/interfaces/general";
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";

/**
 * Full payment settings for admins — includes hidden bank accounts.
 */
export const useGetAdminPaymentSettings = () => {
  return useQuery({
    queryKey: ["payment-settings"],
    queryFn: async (): Promise<PaymentSettings> => {
      const response = await api.get<MutationResponse<PaymentSettings>>(
        "/admin/settings/payment",
        { noToast: true } as CustomAxiosRequestConfig,
      );
      return response.data.data;
    },
    retry: 2,
  });
};

/**
 * Customer-facing payment settings — hidden accounts are stripped by the backend.
 */
export const useGetPaymentSettings = () => {
  return useQuery({
    queryKey: ["public-payment-settings"],
    queryFn: async (): Promise<PaymentSettings> => {
      const response = await api.get<MutationResponse<PaymentSettings>>(
        "/settings/payment",
        { noToast: true } as CustomAxiosRequestConfig,
      );
      return response.data.data;
    },
    retry: 2,
  });
};

export const useUpdatePaymentSettings = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: {
      method: string;
      manualAccounts: Array<{
        id?: string;
        accountName: string;
        accountNumber: string;
        bankName: string;
        isVisible: boolean;
      }>;
    }) =>
      api.put<MutationResponse<PaymentSettings>>(
        "/admin/settings/payment",
        payload,
      ),
    invalidateQueries: [["payment-settings"], ["public-payment-settings"]],
  });
};
