"use client"
import ManufacturerPageComponent from "@/features/manufacturers/components/ManufacturerPageComponent"
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const ManufacturerPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <ManufacturerPageComponent />
    </ShowIfRole>
  );
}

export default ManufacturerPage;