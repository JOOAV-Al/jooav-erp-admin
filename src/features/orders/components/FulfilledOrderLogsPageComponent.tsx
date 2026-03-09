"use client";
import {
  // useDeleteOrder,
  useDeleteMultipleOrders,
  useGetOrders,
  // useGetOrdersStats,
  useUpdateOrderItemStatus,
} from "@/features/orders/services/orders.api";
import { useState } from "react";
import { Order, OrderItem } from "@/features/orders/types";
import FilterContainer from "@/components/filters/FilterContainer";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetUsers } from "@/features/users/services/users.api";
import OrdersGroupedTable from "@/features/orders/components/OrdersGroupedTable";
import SearchBox from "@/components/filters/SearchBox";
import SortFilter from "@/components/filters/SortFilter";

const FulfilledOrderLogsPageComponent = () => {
  // const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc" | "">("");
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  );
  const [selectedOrderItem, setSelectedOrderItem] = useState<
    OrderItem | undefined
  >(undefined);

  const debouncedQuery = useDebounce(query);
  // const ordersFormResetRef = useRef<(() => void) | null>(null);

  // const { mutateAsync: deleteOrder, isPending: deleting } = useDeleteOrder();
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
  } = useGetOrders({ page, search: debouncedQuery, status: "COMPLETED" });

  // const { data: products } = useGetProducts({});
  // const { data: wholesalers } = useGetUsers({ role: "WHOLESALER" });
  const { data: officers } = useGetUsers({ role: "PROCUREMENT_OFFICER" });

  const orders: Order[] = data?.data?.orders ?? [];

  const handleUpdateOrderItemStatus = async (
    status: string,
    itemId: string,
    orderNumber: string,
  ) => {
    await updateItemStatus({
      orderNumber,
      id: itemId,
      payload: {
        status,
        processingNotes: "",
      },
    });
    setSelectedOrder(undefined);
  };

  // const handleDelete = async () => {
  //   await deleteOrder({ id: selectedOrder?.id ?? "" });
  //   setOpen(false);
  //   setSelectedOrder(undefined);
  //   setSelectedOrderItem(undefined);
  // };

  // const displayStats = [
  //   { value: `${stats?.totalOrders ?? 0}`, label: "Orders" },
  //   { value: `${stats?.archived ?? 0}`, label: "Archived" },
  // ];

  return (
    <div className="flex flex-col gap-5 pb-main">
      {/* {isStatsPending ? (
        <StatsSkeleton count={2} />
      ) : (
        <StatsContainer stats={displayStats} />
      )} */}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="">
            <SortFilter value={sortOrder} onChange={setSortOrder} />
          </FilterContainer>

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
          officers={officers?.data}
          loading={isOrdersPending || isRefetching}
          onOrderClick={(order) => {
            setSelectedOrder(order);
            // setOpen(true);
          }}
          onOrderItemClick={(orderItem, order) => {
            setSelectedOrderItem(orderItem);
            setSelectedOrder(order);
            // setOpen(true);
          }}
          onDelete={(rows) =>
            deleteMultipleOrders({ orderIds: rows.map((o) => o.id) })
          }
          onMarkItemPending={(item, order) =>
            handleUpdateOrderItemStatus("PENDING", item?.id, order?.orderNumber)
          }
          onMarkItemCancelled={(item, order) =>
            handleUpdateOrderItemStatus(
              "CANCELLED",
              item?.id,
              order?.orderNumber,
            )
          }
          onMarkItemComplete={(item, order) =>
            handleUpdateOrderItemStatus(
              "DELIVERED",
              item?.id,
              order?.orderNumber,
            )
          }
          onMarkItemInProgress={(item, order) =>
            handleUpdateOrderItemStatus(
              "SOURCING",
              item?.id,
              order?.orderNumber,
            )
          }
          actionLoading={updatingItem}
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          emptyHeader="No orders yet"
          emptyDescription="No order records yet. Orders will appear here once placed."
          emptyImage="/dashboard/import-csv.svg"
          emptyCta="Refresh"
          onEmptyCta={refetch}
          showActions={false}
        />
      </div>
    </div>
  );
};

export default FulfilledOrderLogsPageComponent;
