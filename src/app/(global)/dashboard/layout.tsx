"use client";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthHydration();
  return (
    <div>
      <h1>Dashboard Layout</h1>
      {children}
    </div>
  );
};

export default DashboardLayout;
