// lib/toast.ts
import { AppToast } from "@/components/general/AppToast";
import { toast } from "sonner";

interface ShowToastOptions {
  title: string;
  description?: string;
  variant: "success" | "error";
  action?: { label: string; onClick: () => void };
  cancel?: { label: string; onClick?: () => void };
  duration?: number;
}

export function showToast({
  title,
  description,
  variant,
  action,
  cancel,
  duration = 4000,
}: ShowToastOptions) {
  toast.custom(
    (t) => (
      <AppToast
        t={t}
        title={title}
        description={description}
        variant={variant}
        action={action}
        cancel={cancel}
      />
    ),
    { duration }
  );
}