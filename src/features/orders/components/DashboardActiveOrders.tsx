import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerBoxContent from "@/components/general/DrawerBoxContent";
import EmptyState from "@/components/general/EmptyState";
import TableTag from "@/components/general/TableTag";
import { ScrollArea } from "@/components/ui/scroll-area";
import FormOrderList from "@/features/orders/components/FormOrderList";
import { InitialsAvatar } from "@/features/orders/components/OrderCard";
import { Order } from "@/features/orders/types";
import {
  formatCurrency,
  getOrderStatusStyles,
  truncateText,
} from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// const COL_WIDTHS = "grid-cols-[140px_80px_120px_160px_140px]";

const DashboardActiveOrders = ({
  orders,
  refetchOrders,
}: {
  orders?: Order[];
  refetchOrders?: () => void;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  );

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const resetDrawer = () => setSelectedOrder(undefined);

  return (
    <div className="flex flex-col h-full">
      {orders && orders.length > 0 ? (
        <div className="flex flex-col gap-3 h-full">
          {/* Header bar — outside scroll so it stays put */}
          <div className="flex justify-between items-center py-sm px-lg border-b border-border-main flex-shrink-0">
            <h4>Active orders</h4>
            <div
              onClick={() => router.push("/dashboard/order-logs")}
              className="py-sm rounded-lg cursor-pointer hover:underline"
            >
              <span className="py-4 px-2 text-body-passive tracking-[0.02em] font-semibold text-[15px]">
                View orders
              </span>
            </div>
          </div>

          {/* Horizontally scrollable table body */}
          <ScrollArea
            orientation="horizontal"
            isSidebar
            className="min-h-[70vh]"
          >
            <div className="min-w-[680px] w-full py-sm flex flex-col gap-3">
              {/* Column headings */}
              <div
                className={`grid grid-cols-6 gap-4 px-lg py-sm text-[12px] uppercase tracking-[0.08em] text-body-passive font-mono border-b border-border-main`}
              >
                <span className="col-span-2">Order No.</span>
                <span>Items</span>
                {/* <span className="text-nowrap">Delivery Date</span> */}
                <span>Ordered For</span>
                <span className="ml-auto">Order Amount</span>
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-2 px-md">
                {orders.map((order, idx) => {
                  const wholesaler =
                    (order.wholesaler?.firstName ?? "") +
                    " " +
                    (order.wholesaler?.lastName ?? "");
                  const orderStatusStyles = getOrderStatusStyles(order.status);
                  const thumbnail = order?.items?.[0]?.product?.thumbnail;
                  const itemName = order?.items?.[0]?.product?.name;

                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-6 gap-4 items-center p-md cursor-pointer hover:bg-storey-foreground rounded-2xl transition-colors ${
                        idx !== orders.length - 1
                          ? "border-b border-border-main"
                          : ""
                      }`}
                      onClick={() => handleOrderClick(order)}
                    >
                      {/* Order number + status */}
                      <div className="col-span-2 flex items-center gap-5 min-w-0">
                        <span className="text-[14px] font-medium text-body truncate">
                          {order.orderNumber}
                        </span>
                        <TableTag
                          small
                          className={orderStatusStyles.styles}
                          text={orderStatusStyles.text}
                        />
                      </div>

                      {/* Items count + thumbnail */}
                      <div className="flex items-center gap-[6px]">
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg border border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center">
                          {thumbnail?.startsWith("https://") ? (
                            <Image
                              src={thumbnail}
                              alt={itemName ?? ""}
                              width={24}
                              height={24}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-[10px] text-body-passive font-mono">
                              IMG
                            </span>
                          )}
                        </div>
                        <span className="text-[14px] font-medium text-body">
                          {order?.items?.length ?? 0}
                        </span>
                      </div>

                      {/* Date */}
                      {/* <span className="text-[14px] font-medium text-body">
                        {format(
                          order.orderDate ?? order.createdAt,
                          "dd/MM/yyyy",
                        )}
                      </span> */}

                      {/* Wholesaler */}
                      <div className="flex items-center gap-2 min-w-0">
                        <InitialsAvatar name={wholesaler || "—"} />
                        <span className="text-[14px] font-medium text-body truncate">
                          {truncateText(wholesaler, 10) || "—"}
                        </span>
                      </div>

                      {/* Amount */}
                      <span className="text-body font-garantpro font-semibold text-[13px] tracking-[0.05em] ml-auto">
                        {formatCurrency(
                          order.totalAmount ?? order?.subtotal ?? 0,
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <EmptyState
            header="No order summaries"
            description="You will see a summary of recent orders here once orders are initiated."
          />
        </div>
      )}

      <DashboardDrawer
        showTrigger={false}
        openDrawer={(isOpen) => {
          if (!isOpen) resetDrawer();
          setOpen(isOpen);
        }}
        isOpen={open}
        secondarySubmitLabel={undefined}
        showSecondaryButton={false}
        showFooter={false}
      >
        <DrawerBoxContent
          heading="Order details"
          content={
            <FormOrderList
              order={selectedOrder!}
              orderNumber={selectedOrder?.orderNumber}
              showItemStatus
              showItemStatusActions
              showWhatsAppShare
              showAssignedTo
              refetchOrders={refetchOrders}
            />
          }
          statusTag={
            <TableTag
              small
              className={getOrderStatusStyles(selectedOrder?.status).styles}
              text={getOrderStatusStyles(selectedOrder?.status).text}
            />
          }
        />
      </DashboardDrawer>
    </div>
  );
};

export default DashboardActiveOrders;