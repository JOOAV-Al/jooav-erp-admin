"use client";

import {
  useDeleteMultipleOrders,
  useGetOrders,
  useUpdateOrderItemStatus,
} from "@/features/orders/services/orders.api";
import { useState } from "react";
import { Order, OrderItem } from "@/features/orders/types";
import { useDebounce } from "@/hooks/useDebounce";
import OrdersGroupedTable from "@/features/orders/components/OrdersGroupedTable";
import SearchBox from "@/components/filters/SearchBox";

const ProcurementFulfilledOrderLogsPageComponent = () => {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  );
  const [selectedOrderItem, setSelectedOrderItem] = useState<
    OrderItem | undefined
  >(undefined);

  const debouncedQuery = useDebounce(query);
  const { mutateAsync: updateItemStatus, isPending: updatingItem } =
    useUpdateOrderItemStatus();
  const {
    mutateAsync: deleteMultipleOrders,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleOrders();

  // const { data: stats, isPending: isStatsPending } = useGetOrdersStats();
  const {
    data,
    isPending: isOrdersPending,
    isRefetching,
    refetch,
  } = useGetOrders({ page, search: debouncedQuery });

  const orders: Order[] = data?.data?.orders ?? [];

  // ── Item status updates ────────────────────────────────────────────────────
  // const handleUpdateOrderItemStatus = async (
  //   status: string,
  //   itemId: string,
  //   orderNumber: string,
  // ) => {

  //   await updateItemStatus({
  //     orderNumber,
  //     id: itemId,
  //     payload: { status, processingNotes: "" },
  //   });
  //   setSelectedOrder(undefined);
  // };

  // ── Row click handlers ─────────────────────────────────────────────────────
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setSelectedOrderItem(undefined);
  };

  const handleOrderItemClick = (item: OrderItem, order: Order) => {
    setSelectedOrderItem(item);
    setSelectedOrder(order);
  };

  return (
    <div className="flex flex-col gap-5 pb-main">
      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-end flex-wrap gap-6">
          {/* <FilterContainer label="">
            <StatusFilter
              value={statusFilter}
              onChange={setStatusFilter}
              isOrders
            />
          </FilterContainer> */}

          <div className="flex items-center gap-6 flex-wrap">
            <SearchBox
              value={query}
              onChange={(value) => {
                setPage(1);
                setQuery(value);
              }}
            />
          </div>
        </div>

        <OrdersGroupedTable
          orders={orders}
          loading={isOrdersPending || isRefetching}
          onOrderClick={handleOrderClick}
          onOrderItemClick={handleOrderItemClick}
          onDelete={(rows) =>
            deleteMultipleOrders({ orderIds: rows.map((o) => o.id) })
          }
          // onMarkItemPending={(item, order) =>
          //   handleUpdateOrderItemStatus("PENDING", item.id, order.orderNumber)
          // }
          // onMarkItemCancelled={(item, order) =>
          //   handleUpdateOrderItemStatus("CANCELLED", item.id, order.orderNumber)
          // }
          // onMarkItemComplete={(item, order) =>
          //   handleUpdateOrderItemStatus("DELIVERED", item.id, order.orderNumber)
          // }
          // onMarkItemInProgress={(item, order) =>
          //   handleUpdateOrderItemStatus("SOURCING", item.id, order.orderNumber)
          // }
          actionLoading={updatingItem}
          showActions
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          emptyHeader="No order summaries"
          emptyDescription="You will see a summary of recent orders here once order are initiated."
          // emptyImage="/dashboard/import-csv.svg"
          // emptyCta="Refresh"
          // onEmptyCta={refetch}
        />
      </div>
    </div>
  );
};

export default ProcurementFulfilledOrderLogsPageComponent;
