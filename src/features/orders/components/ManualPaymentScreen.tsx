"use client";

import Image from "next/image";
import { Order, OrderItem } from "@/features/orders/types";
import {
  formatCurrency,
  formatOrderDate,
  getItemStatusStyles,
} from "@/lib/utils";
import { InitialsAvatar } from "@/features/orders/components/OrderCard";
import {
  useGetOrderDetails,
  useUpdateOrderItemStatus,
} from "@/features/orders/services/orders.api";
import { MoreHorizontal, X } from "lucide-react";
// import OrderCardSkeleton from "@/features/orders/components/OrderCardSkeleton";
import { PageSpinner, Spinner } from "@/components/ui/spinner";
import TableTag from "@/components/general/TableTag";
import FormDropdown from "@/components/general/FormDropdown";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ManualPaymentScreenProps {
  order?: Order;
  orderNumber?: string;
}

const ManualPaymentScreen = ({
  order,
  orderNumber,
}: ManualPaymentScreenProps) => {
  // console.log(order);
  const { data, isPending, refetch } = useGetOrderDetails({
    orderNumber: orderNumber ?? "",
  });
  const items = data?.data?.items ?? [];
  const dynamicOrder = data?.data;

  const wholesaler =
    (dynamicOrder?.wholesaler?.firstName ?? "") +
    " " +
    (dynamicOrder?.wholesaler?.lastName ?? "");

  const thumbnail = items?.[0]?.product?.thumbnail;
  const dummyFiveDaysEstimated = new Date();
  dummyFiveDaysEstimated.setDate(dummyFiveDaysEstimated.getDate() + 5);

  if (isPending) {
    return (
      <div className="flex flex-col flex-1 gap-main justify-center items-center h-50">
        <PageSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-7 py-main">
      <div className="py-sm gap-2">
        <h4>Payment Details</h4>
      </div>

      <div className="flex flex-col gap-7">
        {/* ── Order meta ─────────────────────────────────────────────────────── */}

        <div className="flex flex-col gap-6">
          <p className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-heading uppercase font-mono">
            Order details:
          </p>
          <div className="h-[0.5px] bg-[#E6E6E6] w-full"></div>
          <div className="flex flex-col gap-5">
            <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
              Order for:
            </span>
            <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
              {wholesaler}
            </span>
          </div>
          <div className="h-[0.5px] bg-[#E6E6E6] w-full"></div>
          <div className="flex items-center justify-between gap-5">
            <div className="flex flex-col gap-5">
              <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                Order no:
              </span>
              <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                {dynamicOrder?.orderNumber}
              </span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="flex-shrink-0 w-[24px] h-[24px] rounded-lg border border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center">
                {thumbnail && thumbnail.startsWith("https://") ? (
                  <Image
                    src={thumbnail}
                    alt={"order item"}
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-storey-foreground flex items-center justify-center text-[10px] text-body-passive font-mono">
                    IMG
                  </div>
                )}
              </div>
              <span className="text-[14px] font-medium text-body">
                {dynamicOrder?.items?.length ?? 0}
              </span>
            </div>
          </div>
          <div className="h-[0.5px] bg-[#E6E6E6] w-full"></div>
          <div className="flex justify-between gap-x-lg gap-y-sm">
            <div className="flex flex-col gap-5">
              <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                Order date:
              </span>
              <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                {formatOrderDate(
                  dynamicOrder?.orderDate ?? dynamicOrder?.createdAt ?? "-",
                )}
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                est delivery date:
              </span>
              <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                {format(dummyFiveDaysEstimated, "dd/MM/yyyy.")}
              </span>
            </div>
          </div>
          <div className="h-[0.5px] bg-[#E6E6E6] w-full"></div>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="rounded-2xl p-main flex flex-col gap-main table-tag bg-storey-foreground">
          <div className="py-sm px-3 flex flex-col gap-3 ">
            <div className="py-3">
              <h4>Account Details</h4>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-[0.5px] bg-[#E6E6E6] w-full"></div>

            <div className="flex justify-between items-center gap-[16px]">
              <div className="flex flex-col gap-5 flex-1">
                <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                  Account name:
                </span>
                <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                  JOOAV LLC
                </span>
              </div>
              <div className="h-7 w-[1.38px] bg-[#D9D9D9]"></div>
              <div className="flex flex-col gap-5 flex-1">
                <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                  bank name:
                </span>
                <span className="text-[14px] font-medium text-body leading-[1.5] tracking-[0.04em]">
                  Moniepoint
                </span>
              </div>
            </div>
            <div className="h-[0.5px] bg-[#E6E6E6] w-full"></div>
            <div className="flex flex-col gap-5">
              <span className="text-[12px] py-2 font-normal tracking-[0.08em] leading-[1.2] text-body-passive uppercase font-mono">
                Account No:
              </span>
              <h4 className="text-body">5478890487</h4>
            </div>
          </div>
        </div>
      </div>

      {/* ── Total ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-start gap-5 py-main px-5 border-y-[1px] border-border-main">
        <span className="text-[12px] font-mono text-body uppercase tracking-[0.08]">
          TOTAL:
        </span>
        <h3 className="text-body!">
          NGN
          {formatCurrency(
            dynamicOrder?.totalAmount ?? dynamicOrder?.subtotal ?? 0,
          )}
        </h3>
      </div>
    </div>
  );
};

export default ManualPaymentScreen;
