export type PaymentMethod = "MONNIFY" | "MANUAL";

export interface ManualPaymentAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  isVisible: boolean;
}

export interface PaymentSettings {
  method: PaymentMethod;
  manualAccounts: ManualPaymentAccount[];
}

export interface WarehouseContact {
  id: string;
  name: string;
  phone: string;
}

export interface WarehouseSettings {
  contacts: WarehouseContact[];
}
