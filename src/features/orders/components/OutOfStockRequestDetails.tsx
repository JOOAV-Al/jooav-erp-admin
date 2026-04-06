import TableTag from "@/components/general/TableTag";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { OutOfStockReport } from "@/hooks/dashboard.api";
import { formatCurrency, formatOrderDate, normalizePhone } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

const OutOfStockRequestDetails = ({
  report,
  onResolve,
  resolving = false,
}: {
  report?: OutOfStockReport | null;
  onResolve?: (reportId: string) => Promise<void> | void;
  resolving?: boolean;
}) => {
  if (!report) {
    return null;
  }

  const wholesalerName =
    `${report.wholesaler?.firstName ?? ""} ${report.wholesaler?.lastName ?? ""}`.trim();
  const whatsappNumber = report.wholesaler?.phone
    ? normalizePhone(report.wholesaler.phone)
    : "";
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-xl pt-main pb-main border-b border-border-main flex justify-between items-center">
        <h4>Stock requests</h4>
        <MoreHorizontal size={18} className="text-outline" />
      </div>

      <div className="px-xl py-main border-b border-border-main flex flex-col gap-4">
        <div className="flex justify-between items-start gap-6 py-main border-b border-border-main">
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2] uppercase">
              Request from
            </span>
            <div className="flex items-center gap-5">
              <div className="w-[26px] h-[26px] shrink-0 flex justify-center items-center rounded-full bg-tag-added border border-border-main text-[13px] font-semibold tracking-[0.05em] text-brand-primary uppercase">
                {(report.wholesaler?.firstName?.[0] ?? "?") +
                  (report.wholesaler?.lastName?.[0] ?? "")}
              </div>
              <span className="text-[14px] font-medium text-body leading-normal tracking-[0.04em]">
                {wholesalerName || "—"}
              </span>
            </div>
          </div>

          {whatsappLink && <div className="flex flex-col gap-5 items-end">
            <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2] uppercase">
              Phone number
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium text-body leading-normal tracking-[0.04em]">
                {report.wholesaler?.phone ?? "Unavailable"}
              </span>

              <Button
                type={"button"}
                size={"icon"}
                variant="input"
                disabled={!!whatsappLink}
                onClick={() => {
                  if (!whatsappLink) {
                    return;
                  }
                  window.open(`${whatsappLink}`, "_blank");
                }}
                className="p-4 hover:bg-storey-foreground font-semibold"
              >
                <Image
                  src={"/dashboard/whatsApp.svg"}
                  width={21}
                  height={17}
                  alt="Whatsapp"
                />
              </Button>
            </div>
          </div>}
        </div>

        <div className="flex justify-between items-end gap-6 py-main">
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2] uppercase">
              Requested on:
            </span>
            <span className="text-[14px] font-medium text-body leading-normal tracking-[0.04em]">
              {formatOrderDate(report.createdAt)}
            </span>
          </div>
          <Button
            type="button"
            variant={"tag"}
            size={"tag"}
            disabled={resolving}
            onClick={() => onResolve?.(report.id)}
            className="text-brand-primary"
          >
            {resolving && <Spinner />}
            {resolving ? "Resolving..." : "Resolve"}
          </Button>
        </div>
      </div>

      <div className="px-xl py-main flex flex-col gap-6">
        {report.items?.map((item) => {
          const thumbnail =
            item?.product?.thumbnail || item?.product?.images?.[0];
          const amount =
            item?.orderItem?.lineTotal ??
            item?.order?.totalAmount ??
            item?.product?.price ??
            0;

          return (
            <div key={item.id} className="flex items-start gap-main">
              <div className="shrink-0 w-28 h-28 rounded-xl border border-border-main overflow-hidden bg-storey-foreground flex items-center justify-center">
                {thumbnail && thumbnail.startsWith("https://") ? (
                  <Image
                    src={thumbnail}
                    alt={item?.product?.name ?? "Product image"}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-storey-foreground flex items-center justify-center text-[10px] text-body-passive font-mono">
                    IMG
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-main min-w-0">
                <div className="flex flex-col gap-4">
                  <h5 className="text-body">
                    {item?.product?.name ?? "Product name"}
                  </h5>
                  <TableTag
                    small
                    className="table-tag border-border-main bg-tag-queue text-destructive"
                    text="Out of stock"
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <div className="flex border-b border-border-main py-sm gap-main">
                    <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2] uppercase">
                      Qty:
                      <span className="ml-1 text-body font-garantpro font-semibold text-[13px] tracking-[0.05em] normal-case">
                        {item?.quantityAffected ??
                          item?.orderItem?.quantity ??
                          0}
                      </span>
                    </span>
                    <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2] uppercase lg:ml-auto">
                      Size:
                      <span className="ml-1 text-body font-garantpro font-semibold text-[13px] tracking-[0.05em] normal-case">
                        {item?.product?.packSize?.name ?? "—"}
                      </span>
                    </span>
                  </div>

                  <div className="flex py-sm gap-main">
                    <span className="font-mono text-[12px] lg:place-self-center text-body-passive tracking-[0.08em] leading-[1.2] uppercase">
                      Type:
                      <span className="ml-1 text-body font-garantpro font-semibold text-[13px] tracking-[0.05em] normal-case">
                        {item?.product?.packType?.name ?? "—"}
                      </span>
                    </span>
                    <span className="font-mono text-[12px] text-body-passive tracking-[0.08em] leading-[1.2] uppercase lg:ml-auto">
                      Price:
                      <span className="ml-1 text-body font-garantpro font-semibold text-[13px] tracking-[0.05em] normal-case">
                        ₦ {formatCurrency(amount)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutOfStockRequestDetails;
