"use client"
import UserPageComponent from "@/features/users/components/UserPageComponent"
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const UserPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <UserPageComponent />
    </ShowIfRole>
  );
}

export default UserPage;