"use client"
import OrderLogsPageComponent from "@/features/orders/components/OrderLogsPageComponent";
import ProcurementOrderLogsPageComponent from "@/features/orders/components/ProcurementOrderLogsPageComponent";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const OrderLogsPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isProcurement = user?.role === "PROCUREMENT_OFFICER";
  return (
    <>
      {!isProcurement ? (
        <OrderLogsPageComponent />
      ) : (
        <ProcurementOrderLogsPageComponent />
      )}
    </>
  );
};

export default OrderLogsPage;
