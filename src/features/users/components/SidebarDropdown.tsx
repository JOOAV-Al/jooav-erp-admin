"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TableTag from "@/components/general/TableTag";
import Spinner from "@/components/general/Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useOfficerSetAvailability,
} from "@/features/orders/services/orders.api";
import { cn, toProperCase } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAvailabilityStatus } from "@/redux/slices/authSlice";

const SidebarDropdown = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth);
  const { mutateAsync: updateAvailability, isPending: isUpdating } =
    useOfficerSetAvailability();
  const options = [
    { value: "AVAILABLE", label: "Active" },
    { value: "UNAVAILABLE", label: "Offline" },
  ];
  const [status, setStatus] = useState(
    toProperCase(auth?.user?.availabilityStatus ?? ""),
  );

  const handleOfficerStatusUpdate = async (status: string) => {
    // setStatus(status); // optimistic update
    const res = await updateAvailability({
      payload: { availabilityStatus: status },
    });
    dispatch(setAvailabilityStatus({availabilityStatus: res.data.availabilityStatus }))
    setStatus(res.data.availabilityStatus);
  };

  const getUserStatusStyles = (status = "") => {
    switch (status?.toUpperCase()) {
      case "AVAILABLE":
        return {
          styles:
            "table-tag border-border-main bg-tag-queue text-brand-signal px-4! py-5! rounded-main!",
          text: "Active",
        };
      default:
        return {
          styles:
            "table-tag border-border-main bg-border-main text-body-passive px-4! py-5! rounded-main!",
          text: "Offline",
        };
    }
  };
  const statusStyles = getUserStatusStyles(status);
  return (
    <div className="flex items-center gap-6 px-sm rounded-md">
      <div className="flex gap-[8px] items-center">
        <span className="text-[15px] font-medium text-body leading-[1.2] tracking-[0.04em]">
          Status
        </span>
        <TableTag text={statusStyles.text} className={statusStyles.styles} />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center cursor-pointer">
            {isUpdating ? (
              <Spinner className="h-[14px] w-[14px] text-outline" />
            ) : (
              <ChevronDown
                strokeWidth={2}
                className="h-[16px] w-[16px] text-outline"
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="flex flex-col gap-5 p-sm! rounded-lg! max-h-90 w-[208px] overflow-y-auto user-dropdown"
        >
          <p className="py-5 px-3 tracking-[0.08em] text-body-passive font-mono leading-[1.2] text-xs font-normal">CHANGE STATUS</p>
          {options?.map((o) => (
            <DropdownMenuItem
              key={o.value}
              className={cn(
                "rounded-md py-5 px-sm h-[22px] cursor-pointer transition-colors text-body-passive hover:bg-storey-foreground select-option",
                o.value === status &&
                  "bg-storey-foreground text-body table-selected",
              )}
              onClick={() => handleOfficerStatusUpdate(o.value)}
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

export default SidebarDropdown;
