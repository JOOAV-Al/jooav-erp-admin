import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/lib/api/axiosInstance";
import { logout, setCredentials } from "@/redux/slices/authSlice";
import Cookies from "js-cookie"
import {jwtDecode} from "jwt-decode"
import { useRouter } from "next/navigation";
import { getLoginRoute } from "@/features/auth/services/helpers";

export const useAuthHydration = () => {
  const dispatch = useDispatch();
  const router = useRouter()

  useEffect(() => {
    const hydrate = async () => {
      const token = Cookies.get("authToken")
      const decoded = jwtDecode<{role: string}>(token ?? "")
      let role = ""
      try {
        const res = await api.get("/admin/auth/me");

        dispatch(
          setCredentials({
            user: res.data.data,
            token: Cookies.get("authToken")!, // reuse stored token
          })
        );
        role = res?.data?.data?.role
      } catch {
        dispatch(logout());
        router.push(getLoginRoute(role ?? decoded?.role ?? ""));
      }
    };

    hydrate();
  }, [dispatch]);
};
