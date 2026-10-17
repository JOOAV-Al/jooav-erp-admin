"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { CreditCard, Landmark, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageSpinner, Spinner } from "@/components/ui/spinner";
import {
  useGetAdminPaymentSettings,
  useUpdatePaymentSettings,
} from "@/features/settings/services/settings.api";
import { PaymentMethod, PaymentSettings } from "@/features/settings/types";
import { RootState } from "@/redux/store";

const MAX_MANUAL_ACCOUNTS = 10;

interface AccountRow {
  id?: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  isVisible: boolean;
}

const PAYMENT_METHOD_OPTIONS: Array<{
  value: PaymentMethod;
  title: string;
  description: string;
  Icon: typeof CreditCard;
}> = [
  {
    value: "MONNIFY",
    title: "Online payment (Monnify)",
    description:
      "Customers pay online and orders confirm automatically once the payment is received.",
    Icon: CreditCard,
  },
  {
    value: "MANUAL",
    title: "Manual bank transfer",
    description:
      "Customers pay into one of the bank accounts below and confirm the transfer for review.",
    Icon: Landmark,
  },
];

const PaymentSettingsForm = ({
  settings,
}: {
  settings: PaymentSettings;
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const canEdit =
    user?.role === "SUPER_ADMIN" ||
    !!user?.permissions?.canModifySystemConfig;

  const { mutateAsync: saveSettings, isPending: saving } =
    useUpdatePaymentSettings();

  const [method, setMethod] = useState<PaymentMethod>(settings.method);
  const [accounts, setAccounts] = useState<AccountRow[]>(
    settings.manualAccounts,
  );

  const updateAccount = (index: number, changes: Partial<AccountRow>) => {
    setAccounts((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...changes } : row)),
    );
  };

  const addAccount = () => {
    setAccounts((rows) => [
      ...rows,
      { accountName: "", accountNumber: "", bankName: "", isVisible: true },
    ]);
  };

  const removeAccount = (index: number) => {
    setAccounts((rows) => rows.filter((_, i) => i !== index));
  };

  const hasIncompleteAccount = accounts.some(
    (account) =>
      !account.accountName.trim() ||
      !account.accountNumber.trim() ||
      !account.bankName.trim(),
  );
  const manualNeedsVisibleAccount =
    method === "MANUAL" && !accounts.some((account) => account.isVisible);

  const handleSave = async () => {
    const res = await saveSettings({ method, manualAccounts: accounts });
    const saved = res.data?.data;
    if (saved) {
      // Sync server-assigned ids and trimmed values back into the form.
      setMethod(saved.method);
      setAccounts(saved.manualAccounts);
    }
  };

  return (
    <div className="px-xl pt-xl pb-main flex flex-col gap-7 max-w-[860px]">
      <div className="flex flex-col gap-2">
        <h3>Payment settings</h3>
        <p className="text-body-passive text-[15px] font-medium leading-normal tracking-[0.03em]">
          Choose how wholesale customers pay for their orders and manage the
          accounts shown for bank transfers.
        </p>
      </div>

      {!canEdit && (
        <div className="rounded-xl border border-border-main bg-storey-foreground p-main">
          <p className="text-[14px] font-medium text-body leading-[1.5]">
            You can view these settings, but only a super admin (or an admin
            with configuration permissions) can change them.
          </p>
        </div>
      )}

      {/* ── Payment method ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white shadow-card p-main flex flex-col gap-main">
        <h4>Payment method</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-main">
          {PAYMENT_METHOD_OPTIONS.map(({ value, title, description, Icon }) => {
            const active = method === value;
            return (
              <button
                key={value}
                type="button"
                disabled={!canEdit}
                onClick={() => setMethod(value)}
                className={`text-left rounded-2xl border p-main flex items-start gap-main transition-all ${
                  active
                    ? "border-brand-primary bg-storey-foreground"
                    : "border-border-main bg-white"
                } ${canEdit ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
              >
                <span
                  className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? "border-brand-primary" : "border-border-main"
                  }`}
                >
                  {active && (
                    <span className="size-2.5 rounded-full bg-brand-primary" />
                  )}
                </span>
                <span className="flex flex-col gap-2">
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-body">
                    <Icon className="size-4 text-outline-passive" />
                    {title}
                  </span>
                  <span className="text-[13px] font-medium leading-[1.5] text-body-passive">
                    {description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[13px] font-medium text-body-passive leading-[1.5]">
          Changing the method only affects new payments. Orders that are already
          awaiting payment keep the method they were started with.
        </p>
      </div>

      {/* ── Bank accounts ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white shadow-card p-main flex flex-col gap-main">
        <div className="flex items-start justify-between gap-main">
          <div className="flex flex-col gap-2">
            <h4>Bank accounts</h4>
            <p className="text-[13px] font-medium text-body-passive leading-[1.5]">
              These accounts are shown to customers when manual bank transfer is
              active. Hidden accounts stay available here but are not shown to
              customers.
            </p>
          </div>
          <span className="text-[13px] font-medium text-body-passive whitespace-nowrap">
            {accounts.length}/{MAX_MANUAL_ACCOUNTS}
          </span>
        </div>

        {accounts.length === 0 && (
          <p className="text-[14px] font-medium text-body-passive py-main">
            No bank accounts yet. Add one so customers can pay by transfer.
          </p>
        )}

        {accounts.map((account, index) => (
          <div
            key={account.id ?? `new-${index}`}
            className="rounded-2xl border border-border-main p-main flex flex-col gap-main"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-main">
              <div className="flex flex-col gap-3">
                <Label htmlFor={`account-name-${index}`}>Account name</Label>
                <Input
                  id={`account-name-${index}`}
                  value={account.accountName}
                  disabled={!canEdit}
                  placeholder="e.g. Jooav Companies Limited"
                  onChange={(e) =>
                    updateAccount(index, { accountName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor={`account-number-${index}`}>Account number</Label>
                <Input
                  id={`account-number-${index}`}
                  value={account.accountNumber}
                  disabled={!canEdit}
                  placeholder="e.g. 0123456789"
                  onChange={(e) =>
                    updateAccount(index, { accountNumber: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor={`bank-name-${index}`}>Bank name</Label>
                <Input
                  id={`bank-name-${index}`}
                  value={account.bankName}
                  disabled={!canEdit}
                  placeholder="e.g. GTBank"
                  onChange={(e) =>
                    updateAccount(index, { bankName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-main">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={account.isVisible}
                  disabled={!canEdit}
                  onCheckedChange={(checked) =>
                    updateAccount(index, { isVisible: checked === true })
                  }
                />
                <span className="text-[14px] font-medium text-body">
                  Visible to customers
                </span>
              </label>
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeAccount(index)}
                disabled={!canEdit}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
                <span className="text-[13px]">Remove</span>
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between gap-main flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={addAccount}
            disabled={!canEdit || accounts.length >= MAX_MANUAL_ACCOUNTS}
          >
            <Plus className="size-4" />
            Add account
          </Button>
          {manualNeedsVisibleAccount && (
            <p className="text-[13px] font-medium text-body-passive">
              At least one visible bank account is required for manual bank
              transfer.
            </p>
          )}
        </div>
      </div>

      {canEdit && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={
              saving || hasIncompleteAccount || manualNeedsVisibleAccount
            }
          >
            {saving && <Spinner color="white" />}
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
};

const PaymentSettingsPageComponent = () => {
  const { data, isPending, isError } = useGetAdminPaymentSettings();

  if (!data) {
    if (isPending) {
      return (
        <div className="flex flex-col flex-1 gap-main justify-center items-center h-50">
          <PageSpinner />
        </div>
      );
    }

    return (
      <div className="px-xl pt-xl pb-main">
        <div className="rounded-xl border border-border-main bg-storey-foreground p-main">
          <p className="text-[14px] font-medium text-body leading-[1.5]">
            {isError
              ? "Payment settings could not be loaded. Please refresh and try again."
              : "No payment settings available."}
          </p>
        </div>
      </div>
    );
  }

  return <PaymentSettingsForm settings={data} />;
};

export default PaymentSettingsPageComponent;
