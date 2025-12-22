import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosHeaders,
} from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  noAuth?: boolean;
  noToast?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  withCredentials: true, // ✅ REQUIRED for cookie-based auth
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = Cookies.get("authToken");

    if (token && !config.noAuth) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomAxiosRequestConfig;

    if (config.method !== "get" && !config.noToast) {
      toast.success(response.data?.message || "Success");
    }

    return response;
  },
  (error: AxiosError & { config?: CustomAxiosRequestConfig }) => {
    const message =
      (error.response?.data as any)?.message ||
      "Something went wrong. Please try again.";

    if (error.config?.method !== "get" && !error.config?.noToast) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  patch: axiosInstance.patch,
  delete: axiosInstance.delete,
};
