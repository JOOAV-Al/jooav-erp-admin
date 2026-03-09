"use client"
import ProductPageComponent from "@/features/products/components/ProductPageComponent"
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const ProductPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <ProductPageComponent />
    </ShowIfRole>
  );
}

export default ProductPage;