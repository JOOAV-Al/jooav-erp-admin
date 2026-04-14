import { fetchDeletedUsers, fetchUserDetails, fetchUsers, fetchUsersStats, fetchUsersByManufacturer } from "@/features/users/services/queryFunctions";
import { UserItem, CreateUserPayload } from "@/features/users/types";
import { User } from "@/interfaces/authentication";
import { GeneralFetchingParams, MutationResponse } from "@/interfaces/general";
import { api } from "@/lib/api/axiosInstance";
import { useInvalidatingMutation } from "@/lib/api/useInvalidatingMutations";
import { useQuery } from "@tanstack/react-query";


export const useGetUsers = (params: GeneralFetchingParams) => {
  const {search, status, role, page, limit} = params
  return useQuery({
    queryKey: ["all-users", search, status, role, page, limit],
    queryFn: () => fetchUsers(params),
    retry: 2,
  });
};

export const useGetDeletedUsers = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-deleted-users"],
    queryFn: () => fetchDeletedUsers(params),
    retry: 2,
  });
};

export const useGetUsersByManufacturer = (params: GeneralFetchingParams) => {
  return useQuery({
    queryKey: ["all-users-by-manufacturer"],
    queryFn: () => fetchUsersByManufacturer(params),
    retry: 2,
  });
};

export const useGetUserDetails = ({id}: {id: string}) => {
  return useQuery({
    queryKey: ["user-details", id],
    queryFn: () => fetchUserDetails({id}),
    retry: 2,
  });
};

export const useCreateUser = () => {
  return useInvalidatingMutation({
    mutationFn: (payload: CreateUserPayload) =>
      api.post<MutationResponse<UserItem>>("/users", payload,), 
    invalidateQueries: [["users-stats"], ["dashboard-data"]]
  });
};

export const useUpdateUser = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload, id}: {payload: CreateUserPayload, id: string}) =>
      api.patch<MutationResponse<UserItem>>(`/users/${id}`, payload), 
    invalidateQueries: [["user-details"], ["dashboard-data"]]
  });
};

export const useUpdateProfile = () => {
  return useInvalidatingMutation({
    mutationFn: ({payload}: {payload: CreateUserPayload}) =>
      api.patch<MutationResponse<User>>(`/users/me/profile`, payload), 
    invalidateQueries: [["all-users"], ["admin-auth-me"], ["dashboard-data"]]
  });
};

export const useDeleteUserAccount = () => {
  return useInvalidatingMutation({
    mutationFn: () =>
      api.delete(`/users/me/account`), 
    invalidateQueries: [["all-users"], ["users-stats"], ["dashboard-data"]]
  });
};
export const useDeleteUser = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/users/${id}`), 
    invalidateQueries: [["user-details"], ["users-stats"], ["dashboard-data"]]
  });
};

export const useRegenerateResetToken = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<MutationResponse<UserItem>>(`/users/${id}/regenerate-reset-token`), 
    // invalidateQueries: [["all-users"], ["user-details"], ["users-stats"]]
  });
};

export const useDeleteMultipleUsers = () => {
  return useInvalidatingMutation({
    mutationFn: ({userIds}: {userIds: string[]}) =>
      api.post(`/users/bulk/delete`, {userIds}), 
    invalidateQueries: [["user-details"], ["users-stats"], ["dashboard-data"]]
  });
};

export const useUpdateUserStatus = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, status}: {id: string, status: string}) =>
      api.patch<UserItem>(`/users/${id}/status`, {status}), 
    invalidateQueries: [["all-users"], ["user-details"], ["dashboard-data"]]
  });
};

export const useUpdateUserLogo = () => {
  return useInvalidatingMutation({
    mutationFn: ({id, logo}: {id: string, logo: string}) =>
      api.put(`/users/${id}/logo`, {logo}), 
    invalidateQueries: [["all-users"], ["user-details"]]
  });
};
export const useDeleteUserLogo = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.delete(`/users/${id}/logo`), 
    invalidateQueries: [["all-users"], ["user-details"]]
  });
};

export const useActivateUser = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<UserItem>(`/users/${id}/activate`), 
    invalidateQueries: [["all-users"], ["user-details"]]
  });
};
export const useSuspendUser = () => {
  return useInvalidatingMutation({
    mutationFn: ({id}: {id: string}) =>
      api.post<UserItem>(`/users/${id}/suspend`), 
    invalidateQueries: [["all-users"], ["user-details"]]
  });
};

export const useGetUsersStats = () => {
  return useQuery({
    queryKey: ["users-stats"],
    queryFn: fetchUsersStats,
    retry: 2,
  });
};