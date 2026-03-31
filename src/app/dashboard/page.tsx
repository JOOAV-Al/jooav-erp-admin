"use client";
import DashboardStatsCard from "@/components/general/DashboardStatsCard";
import {PageSpinner} from "@/components/ui/spinner";
import DashboardActiveOrders from "@/features/orders/components/DashboardActiveOrders";
import DashboardOutOfStock from "@/features/orders/components/DashboardOutOfStock";
import DashboardUsers from "@/features/users/components/DashboardUsers";
import {
  useGetDashboardData,
  useGetOutOfStockReports,
} from "@/hooks/dashboard.api";
import { showToast } from "@/lib/toast";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const SuperAdminDashboardHome = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isPending, refetch } = useGetDashboardData();
  const { data: outOfStockReports } = useGetOutOfStockReports();
  const users = data?.recentUsers;
  const orders = data?.activeOrders;
  const stats = data?.stats;

  const displayStats = [
    {
      value: stats?.totalRevenue ? `${stats?.totalRevenue}` : "0",
      label: "Revenue",
    },
    {
      value: stats?.completedOrders ? `${stats?.completedOrders}` : "0",
      label: "Completed Orders",
    },
    {
      value: stats?.liveProducts ? `${stats?.liveProducts}` : "0",
      label: "Live Products",
    },
    {
      value: stats?.allUsers ? `${stats?.allUsers}` : "0",
      label: "All Users",
    },
  ];
  
  return (
    <div className="flex flex-col gap-5 px-sm pb-main">
      {isPending ? (
        <div className="flex min-h-[80vh] justify-center items-center">
          <PageSpinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col mdx:flex-row py-main gap-6">
            {displayStats?.map((stat, i) => (
              <DashboardStatsCard
                key={i}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-11 gap-main">
            <div className="col-span-11 xl:col-span-7 pt-sm pb-md bg-white rounded-2xl flex flex-col min-h-[70vh]">
              <DashboardActiveOrders orders={orders} refetchOrders={refetch} />
            </div>
            <div className="col-span-11 xl:col-span-4 flex flex-col gap-main min-h-[70vh]">
              <div className="pt-sm pb-md bg-white rounded-2xl flex flex-col">
                <DashboardOutOfStock reports={outOfStockReports} />
              </div>
              <div className="pt-sm pb-md bg-white rounded-2xl flex flex-col min-h-[35vh] flex-1">
                <DashboardUsers users={users} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboardHome;
