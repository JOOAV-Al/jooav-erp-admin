import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/lib/api/axiosInstance";
import { logout, setCredentials } from "@/redux/slices/authSlice";

export const useAuthHydration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await api.get("/admin/me");

        dispatch(
          setCredentials({
            user: res.data.user,
            token: res.data.token,
          })
        );
      } catch {
        dispatch(logout());
      }
    };

    hydrate();
  }, [dispatch]);
};
