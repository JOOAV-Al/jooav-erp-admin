"use client";

import WarehouseSettingsPageComponent from "@/features/settings/components/WarehouseSettingsPageComponent";
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const WarehouseSettingsPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <WarehouseSettingsPageComponent />
    </ShowIfRole>
  );
};

export default WarehouseSettingsPage;
