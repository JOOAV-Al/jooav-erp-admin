"use client"
import RolesAndPermissionsPageComponent from "@/features/users/components/RolesAndPermissionsPageComponent"
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const RolesAndPermissionsPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <RolesAndPermissionsPageComponent />
    </ShowIfRole>
  );
}

export default RolesAndPermissionsPage;