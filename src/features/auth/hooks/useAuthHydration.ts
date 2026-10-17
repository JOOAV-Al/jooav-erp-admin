import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/lib/api/axiosInstance";
import { logout, setCredentials } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getLoginRoute, getStoredRole } from "@/features/auth/services/helpers";

export const useAuthHydration = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await api.get("/admin/auth/me");

        dispatch(
          setCredentials({
            user: res.data.data,
            token: Cookies.get("authToken")!, // reuse stored token
          })
        );
      } catch {
        dispatch(logout());
        router.push(getLoginRoute(getStoredRole()));
      }
    };

    hydrate();
  }, [dispatch, router]);
};
