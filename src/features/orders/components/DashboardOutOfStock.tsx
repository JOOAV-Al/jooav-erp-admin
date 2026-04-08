import DashboardDrawer from "@/components/general/DashboardDrawer";
import EmptyState from "@/components/general/EmptyState";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import OutOfStockRequestDetails from "@/features/orders/components/OutOfStockRequestDetails";
import {
  OutOfStockReport,
  useResolveOutOfStockReport,
} from "@/hooks/dashboard.api";
import { truncateText } from "@/lib/utils";
import { useState } from "react";

const DashboardOutOfStock = ({ reports }: { reports?: OutOfStockReport[] }) => {
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<OutOfStockReport | null>(
    null,
  );
  const { mutateAsync: resolveReport, isPending: isResolving } =
    useResolveOutOfStockReport();

  const handleOpenDetails = (report: OutOfStockReport) => {
    setSelectedReport(report);
    setOpen(true);
  };

  const handleDrawerStateChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedReport(null);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    await resolveReport({ reportId });
    setOpen(false);
    setSelectedReport(null);
  };

  const outOfStockItems =
    reports?.flatMap((report) =>
      (report.items ?? []).map((item) => ({ report, item })),
    ) ?? [];

  return (
    <>
      <div className="flex flex-col h-full">
        {outOfStockItems.length > 0 ? (
          <div className="flex flex-col gap-3 h-full">
            <div className="flex justify-between items-center py-sm px-lg border-b border-border-main">
              <h4>Stock request</h4>
              {/* <div className="py-sm rounded-lg">
                <span className="py-4 px-2 text-body-passive tracking-[0.02em] font-semibold text-[15px]">
                  View requests
                </span>
              </div> */}
            </div>

            <ScrollArea isSidebar orientation="horizontal">
              <div className="px-md flex flex-col gap-5">
                {outOfStockItems.map(({ report, item }, idx) => {
                  const isLast = idx === outOfStockItems.length - 1;
                  const itemLabel =
                    item?.product?.name ||
                    item?.order?.orderNumber ||
                    "Product name";

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-5 min-h-[37px] ${isLast ? "mb-1" : "border-b border-border-main"} py-5 px-md hover:bg-storey-foreground select-option rounded-lg`}
                    >
                      <p className="font-medium text-sm leading-normal tracking-[0.04em] text-body flex-1">
                        {truncateText(itemLabel, 28)}
                      </p>

                      <Button
                        type="button"
                        variant="tag"
                        size="tag"
                        className="text-body bg-white border-[#FEFAEB] p-sm! text-[12px]"
                        onClick={() => handleOpenDetails(report)}
                      >
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <EmptyState
              header="No stock request notice"
              description="You will see a No stock request notice once a request is initiated."
            />
          </div>
        )}
      </div>

      <DashboardDrawer
        openDrawer={handleDrawerStateChange}
        isOpen={open}
        showFooter={false}
        showHeader
      >
        <OutOfStockRequestDetails
          report={selectedReport}
          onResolve={handleResolveReport}
          resolving={isResolving}
        />
      </DashboardDrawer>
    </>
  );
};

export default DashboardOutOfStock;
