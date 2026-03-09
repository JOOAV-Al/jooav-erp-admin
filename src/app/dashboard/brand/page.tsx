"use client"
import BrandPageComponent from "@/features/brands/components/BrandPageComponent"
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const BrandPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <BrandPageComponent />
    </ShowIfRole>
  );
}

export default BrandPage;