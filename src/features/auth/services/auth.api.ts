import { LoginPayload } from "@/features/auth/types";
import { api, CustomAxiosRequestConfig } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { setCredentials } from "@/redux/slices/authSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

//FETCH USER
// export function useFetchCurrentUser() {
//   return useMutation({
//     mutationFn: () => {
//       return api.get(`/users/user`, {noAuth: false} as CustomAxiosRequestConfig);
//     },
//     retry: 1
//   })
// }

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api.post("/admin/login", payload, { noAuth: true } as CustomAxiosRequestConfig),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => api.post("/admin/logout"),
  });
};

export const useFetchCurrentUser = () => {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: () => api.get("/admin/me"),
    retry: false,
  });
};