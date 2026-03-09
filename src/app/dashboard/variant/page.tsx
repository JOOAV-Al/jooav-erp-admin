"use client"
import VariantPageComponent from "@/features/variants/components/VariantPageComponent"
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const VariantPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <VariantPageComponent />
    </ShowIfRole>
  );
}

export default VariantPage;