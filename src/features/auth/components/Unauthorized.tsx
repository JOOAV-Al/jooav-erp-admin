import React from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginRoute } from "@/features/auth/services/helpers";

interface UnauthorizedProps {
  title?: string;
  description?: React.ReactNode;
  backHref?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Unauthorized({
  title = "Unauthorized",
  description = "You don’t have access to view this resource. If you believe this is a mistake, contact your administrator or switch accounts.",
  backHref,
  actionLabel = "Sign in",
  onAction,
}: UnauthorizedProps) {
  const router = useRouter();

  return (
    <div className="w-full h-full flex items-center justify-center p-xl">
      <div className="bg-white rounded-2xl shadow-card max-w-[720px] w-full flex flex-col md:flex-row gap-6 p-lg">
        <div className="flex-shrink-0 flex items-center justify-center w-full md:w-40 h-40 rounded-lg bg-brand-primary/10">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center"
            style={{ background: "var(--brand-primary)" }}
            aria-hidden
          >
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="text-h4 font-semibold text-heading mb-2">{title}</h3>
            <p className="text-body-passive text-base leading-[1.4] min-w-0">
              {description}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="neutral"
              onClick={() => {
                if (backHref) router.push(backHref);
                else router.back();
              }}
              className="px-4 py-2"
            >
              Back
            </Button>

            {onAction ? (
              <Button type="button" onClick={onAction} className="px-4 py-2">
                {actionLabel}
              </Button>
            ) : (
              <Button
                type="button"
                size={"neutral"}
                onClick={() => router.push(getLoginRoute(""))}
                // className="px-4 py-2"
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
