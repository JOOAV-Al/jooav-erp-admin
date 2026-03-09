"use client";
import FulfilledOrderLogsPageComponent from "@/features/orders/components/FulfilledOrderLogsPageComponent";
import ProcurementFulfilledOrderLogsPageComponent from "@/features/orders/components/ProcurementFulfilledOrderLogsPageComponent";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const FulfilledOrderLogsPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isProcurement = user?.role === "PROCUREMENT_OFFICER";
  return (
    <>
      {!isProcurement ? (
        <FulfilledOrderLogsPageComponent />
      ) : (
        <ProcurementFulfilledOrderLogsPageComponent />
      )}
    </>
  );
};

export default FulfilledOrderLogsPage;
