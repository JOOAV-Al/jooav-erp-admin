import { Role } from "@/lib/rbac/roles";

export interface User {
  id: string;
  email: string;
  address: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  emailVerified: boolean;
  status: string;
  avatar: string | null;
  availabilityStatus: string | null;
  role: Role;
  assignedRegions: [];
  permissions: {
    canManageManufacturers: boolean,
    canApproveSMEs: boolean,
    canManageSubAdmins: boolean,
    canAccessAnalytics: boolean,
    canModifySystemConfig: boolean
  },
  userAddress: {
    address: string,
    state: string,
    city: string,
    phone: string,
    name: string
  }[]
    
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};
