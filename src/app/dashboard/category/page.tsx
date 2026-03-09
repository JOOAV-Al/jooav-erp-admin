"use client"
import CategoryPageComponent from "@/features/categories/components/CategoryPageComponent"
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const CategoryPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <CategoryPageComponent />
    </ShowIfRole>
  );
}

export default CategoryPage;