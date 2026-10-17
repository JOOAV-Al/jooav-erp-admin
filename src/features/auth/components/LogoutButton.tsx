"use client";
import { useLogout } from "@/features/auth/services/auth.api";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import {
  getLoginRoute,
  getStoredRole,
} from "@/features/auth/services/helpers";

const LogoutButton = () => {
  const { mutateAsync: logoutUser } = useLogout();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      dispatch(logout());
      await logoutUser();
    } finally {
      Cookies.remove("refreshToken");
      Cookies.remove("authToken");
      router.replace(getLoginRoute(getStoredRole()));
    }
  };

  return (
    <div
      onClick={handleLogout}
      className="size-9 rounded-full p-sm sidebar-link bg-storey-foreground hover:bg-border-main flex justify-center items-center cursor-pointer"
    >
      <LogOut className="text-destructive" size={20} />
    </div>
  );
};

export default LogoutButton;
