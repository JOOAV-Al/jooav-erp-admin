"use client";
import {
  useDeleteUserAccount,
} from "@/features/users/services/users.api";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/services/auth.api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { logout } from "@/redux/slices/authSlice";
import { getLoginRoute } from "@/features/auth/services/helpers";
import { Spinner } from "@/components/ui/spinner";

const UserDeleteConfirmation = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mutateAsync: logoutUser } = useLogout();
  const { mutateAsync: deleteUserAccount, isPending } = useDeleteUserAccount();

  const handleLogout = async () => {
    const token = Cookies.get("authToken");
    const decoded = jwtDecode<{ role: string }>(token ?? "");
    try {
      dispatch(logout());
      await logoutUser();
    } finally {
      Cookies.remove("refreshToken");
      Cookies.remove("authToken");
      router.replace(getLoginRoute(decoded?.role));
    }
  };

  const handleDeleteAccount = async () => {
    const response = await deleteUserAccount({});
    if (response.data.status === "success") {
      handleLogout();
    }
  };
  return (
    <div className="p-xl">
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-5">
          <div className="py-sm gap-2">
            <h4>Account deletion</h4>
          </div>
          <div className="py-sm gap-6">
            <p className="text-body-passive leading-[1.5] tracking-[0.03] text-[15px] font-medium">
              This action cannot be undone. Are you sure you want to delete your
              account?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-main">
          <Button
            // onClick={}
            disabled={isPending}
            size={"neutral"}
            variant={"ghost"}
            className={`text-[15px] text-secondary-foreground tracking-[0.02em] leading-[1] hover:no-underline`}
          >
            <span className="py-4 px-2">Cancel</span>
          </Button>
          <Button
            onClick={handleDeleteAccount}
            type="button"
            disabled={isPending}
            size={"neutral"}
            // variant={"filter"}
            className={`text-[15px] bg-destructive tracking-[0.02em] leading-[1] shadow-input hover:bg-destructive/80`}
          >
            {isPending && <Spinner color="white" />}
            <span className="py-4 px-2">
              {isPending ? "Deleting..." : "Delete Account"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteConfirmation;
