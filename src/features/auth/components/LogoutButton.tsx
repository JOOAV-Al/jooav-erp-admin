import { useLogout } from "@/features/auth/services/auth.api";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const { mutateAsync } = useLogout();
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await mutateAsync();
        dispatch(logout());
        router.push("/login");
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton