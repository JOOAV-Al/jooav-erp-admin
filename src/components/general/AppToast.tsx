// components/ui/AppToast.tsx
import { toast } from "sonner";
import { CircleCheck, OctagonX, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppToastProps {
  t: string | number; // toast id for dismissal
  title: string;
  description?: string;
  variant: "success" | "error";
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
}

const VARIANTS = {
  success: {
    icon: CircleCheck,
    titleColor: "text-brand-primary", // your blue
    iconColor: "text-brand-primary",
  },
  error: {
    icon: OctagonX,
    titleColor: "text-destructive", // your red
    iconColor: "text-destructive",
  },
};

export function AppToast({
  t,
  title,
  description,
  variant,
  action,
  cancel,
}: AppToastProps) {
  const { icon: Icon, titleColor, iconColor } = VARIANTS[variant];

  return (
    <div className="flex flex-col gap-5 w-full min-w-[280px] max-w-[469px] rounded-3xl bg-white p-main shadow-toaster">
      {/* Icon */}
      {/* <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
        <Icon className="size-[18px]" />
      </div> */}

      {/* Content */}
      <div className={`py-sm px-3 flex flex-col gap-5`}>
        <div className="flex items-center gap-main justify-between">
          <h4 className={`${titleColor}`}>{title}</h4>

          <button
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer p-2 h-6 w-6 flex-shrink-0 text-outline-passive hover:text-outline transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
        {description && (
          <p className="text-[15px] leading-[1.5] tracking-[0.03em] text-body font-medium">
            {description}
          </p>
        )}
      </div>

      {/* Actions — only renders when provided */}
      {(action || cancel) && (
        <div className="flex items-center gap-5 py-2">
          {cancel && (
            <Button
              onClick={() => {
                cancel.onClick?.();
                toast.dismiss(t);
              }}
              // disabled={isPending}
              size={"neutral"}
              variant={"ghost"}
              className={`text-[15px] text-secondary-foreground tracking-[0.02em] leading-[1] hover:no-underline`}
            >
              <span className="py-4 px-2">{cancel.label}</span>
            </Button>
          )}
          {action && (
            <Button
              onClick={() => {
                action.onClick();
                toast.dismiss(t);
              }}
              type="button"
              size={"neutral"}
              className={`text-[15px] ${titleColor} tracking-[0.02em] leading-[1] shadow-input hover:opacity-80`}
            >
              <span className="py-4 px-2">{action.label}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
