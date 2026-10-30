"use client";

import { useState } from "react";
import { useConfirmOrderPayment, useGetOrders, useGetOrdersStats } from "@/features/orders/services/orders.api";
import { Order } from "@/features/orders/types";
import FilterContainer from "@/components/filters/FilterContainer";
import { useDebounce } from "@/hooks/useDebounce";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerBoxContent from "@/components/general/DrawerBoxContent";
import StatsContainer from "@/components/general/StatsContainer";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import TableTag from "@/components/general/TableTag";
import SearchBox from "@/components/filters/SearchBox";
import OrdersGroupedTable from "@/features/orders/components/OrdersGroupedTable";
import FormOrderList from "@/features/orders/components/FormOrderList";
import PaymentClaimReview from "@/features/orders/components/PaymentClaimReview";
import { getOrderStatusStyles } from "@/lib/utils";

/**
 * Queue of manual-payment orders whose customer submitted an
 * "I have made payment" claim (order status PENDING_PAYMENT +
 * paymentClaimStatus PENDING). Confirming from the drawer approves the
 * claim and moves the order forward; rejecting sends it back to the
 * customer with a reason. Both actions live here so admins review the
 * full queue from one place.
 */
const PaymentConfirmationPageComponent = () => {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  );
  const [isOpen, setOpen] = useState<boolean>(false);

  const debouncedQuery = useDebounce(query);

  const { data: stats, isPending: isStatsPending } = useGetOrdersStats();
  const {
    data,
    isPending: isOrdersPending,
    refetch,
  } = useGetOrders({
    page,
    search: debouncedQuery,
    status: "PENDING_PAYMENT",
    paymentClaimStatus: "PENDING",
    limit: 100,
  });

  const { mutateAsync: confirmPayment, isPending: isConfirmingPayment } =
    useConfirmOrderPayment();

  const orders: Order[] = data?.data?.orders ?? [];

  const displayStats = [
    {
      value: `${stats?.summary?.claimsToVerify ?? 0}`,
      label: "Claims to review",
    },
  ];

  const resetDrawer = () => {
    setSelectedOrder(undefined);
    setOpen(false);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedOrder) return;
    await confirmPayment({
      orderNumber: selectedOrder.orderNumber,
      mode: "manual",
    });
    // The approve/reject mutations invalidate the orders list, so the
    // resolved order drops out of the queue on its own.
    resetDrawer();
  };

  return (
    <div className="flex flex-col gap-5 pb-main">
      {isStatsPending ? (
        <StatsSkeleton count={1} />
      ) : (
        <StatsContainer stats={displayStats} />
      )}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="">
            <SearchBox
              value={query}
              onChange={(value) => {
                setPage(1);
                setQuery(value);
              }}
            />
          </FilterContainer>
        </div>

        <DashboardDrawer
          showTrigger={false}
          openDrawer={(drawerIsOpen) => {
            if (!drawerIsOpen) resetDrawer();
            setOpen(drawerIsOpen);
          }}
          isOpen={isOpen}
          onPrimaryAction={handleConfirmPayment}
          submitLabel="Confirm payment"
          submitLoading={isConfirmingPayment}
          showFooter={!!selectedOrder}
        >
          {selectedOrder && (
            <DrawerBoxContent
              heading="Payment confirmation"
              content={
                <div className="flex flex-col">
                  <PaymentClaimReview
                    order={selectedOrder}
                    onUpdated={() => resetDrawer()}
                  />
                  <FormOrderList
                    order={selectedOrder}
                    orderNumber={selectedOrder.orderNumber}
                    refetchOrders={refetch}
                  />
                </div>
              }
              statusTag={
                <TableTag
                  small
                  className={
                    getOrderStatusStyles(
                      selectedOrder.status,
                      selectedOrder.paymentClaimStatus,
                    ).styles
                  }
                  text={
                    getOrderStatusStyles(
                      selectedOrder.status,
                      selectedOrder.paymentClaimStatus,
                    ).text
                  }
                />
              }
            />
          )}
        </DashboardDrawer>

        <OrdersGroupedTable
          orders={orders}
          loading={isOrdersPending}
          onOrderClick={handleOrderClick}
          emptyHeader="No claims to review"
          emptyDescription="When a customer claims to have paid by bank transfer, the order appears here for confirmation."
          emptyImage="/dashboard/empty-state.svg"
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default PaymentConfirmationPageComponent;
