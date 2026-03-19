"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const AdminSidebarDropdown = ({ isCollapsed }: { isCollapsed?: boolean }) => {
  const router = useRouter();
  const options = [
    { value: "/dashboard/order-logs?open=true", label: "Order" },
    { value: "/dashboard/product?open=true", label: "Product" },
    { value: "/dashboard/users?open=true", label: "User" },
  ];
  const [triggerOpen, setTriggerOpen] = useState<boolean>(false);

  const handleRouting = async (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex items-center px-sm py-5 rounded-md">
      <div
        onClick={() => setTriggerOpen(true)}
        className="flex gap-6 items-center mr-2 cursor-pointer"
      >
        <Plus size={18} className={`text-outline ${isCollapsed && "ml-1.5"}`} />
        {!isCollapsed && (
          <span className="text-[15px] font-medium text-body leading-[1.2] tracking-[0.04em]">
            Create new
          </span>
        )}
      </div>
      <DropdownMenu open={triggerOpen} onOpenChange={setTriggerOpen}>
        {!isCollapsed && (
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer">
              {triggerOpen ? (
                <ChevronUp
                  strokeWidth={2}
                  className="h-[16px] w-[16px] text-outline"
                />
              ) : (
                <ChevronDown
                  strokeWidth={2}
                  className="h-[16px] w-[16px] text-outline"
                />
              )}
            </div>
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent
          align="start"
          className="flex flex-col gap-5 p-sm! rounded-lg! max-h-90 w-[208px] overflow-y-auto user-dropdown"
        >
          <p className="py-5 px-3 tracking-[0.08em] text-body-passive font-mono leading-[1.2] text-xs font-normal">
            ACTIONS
          </p>
          {options?.map((o) => (
            <DropdownMenuItem
              key={o.value}
              className={cn(
                "rounded-md py-5 px-sm h-[22px] cursor-pointer transition-colors text-body-passive hover:bg-storey-foreground select-option",
              )}
              onClick={() => handleRouting(o.value)}
            >
              <div className="flex items-center gap-5">
                <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                  {o.label}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminSidebarDropdown;
