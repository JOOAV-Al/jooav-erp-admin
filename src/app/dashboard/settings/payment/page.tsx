"use client";

import PaymentSettingsPageComponent from "@/features/settings/components/PaymentSettingsPageComponent";
import { majorRoles } from "@/lib/rbac/roles";
import { ShowIfRole } from "@/lib/rbac/ShowIfRole";

const PaymentSettingsPage = () => {
  return (
    <ShowIfRole roles={majorRoles}>
      <PaymentSettingsPageComponent />
    </ShowIfRole>
  );
};

export default PaymentSettingsPage;
