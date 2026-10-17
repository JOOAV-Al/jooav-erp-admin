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
