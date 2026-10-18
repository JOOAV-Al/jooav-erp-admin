import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormOrderList from "@/features/orders/components/FormOrderList";
import { Order } from "@/features/orders/types";
import {
  useGetOrderDetails,
  useUpdateOrderItemStatus,
} from "@/features/orders/services/orders.api";
import { useGetWarehouseSettings } from "@/features/settings/services/settings.api";
import { renderWithProviders } from "@/tests/test-utils";

/* ============================
   MOCKS
============================ */

jest.mock("@/features/orders/services/orders.api", () => ({
  useGetOrderDetails: jest.fn(),
  useUpdateOrderItemStatus: jest.fn(),
}));

jest.mock("@/features/settings/services/settings.api", () => ({
  useGetWarehouseSettings: jest.fn(),
}));

const mockGetOrderDetails = useGetOrderDetails as jest.Mock;
const mockUpdateOrderItemStatus = useUpdateOrderItemStatus as jest.Mock;
const mockGetWarehouseSettings = useGetWarehouseSettings as jest.Mock;

const loadedOrder = {
  id: "o1",
  orderNumber: "ORD-0042",
  status: "CONFIRMED",
  createdAt: "2026-10-01T10:00:00.000Z",
  totalAmount: "45000.00",
  procurementOfficerName: "Officer",
  wholesaler: { firstName: "Sultan", lastName: "Stores" },
  deliveryAddress: { address: "1 Market Road", city: "Kano", state: "Kano" },
  items: [
    {
      id: "i1",
      quantity: 20,
      unitPrice: "1000.00",
      lineTotal: "20000.00",
      status: "PENDING",
      product: {
        name: "Semovita",
        thumbnail: null,
        packSize: { name: "50kg" },
        packType: { name: "Bag" },
      },
    },
    {
      id: "i2",
      quantity: 50,
      unitPrice: "500.00",
      lineTotal: "25000.00",
      status: "PENDING",
      product: {
        name: "Peak Milk",
        thumbnail: null,
        packSize: { name: "400g" },
        packType: { name: "Carton" },
      },
    },
  ],
} as unknown as Order;

const warehouseContact = {
  id: "w1",
  name: "Main Warehouse",
  phone: "2348167163339",
};

beforeEach(() => {
  jest.clearAllMocks();

  mockUpdateOrderItemStatus.mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
  });
  mockGetWarehouseSettings.mockReturnValue({
    data: { contacts: [warehouseContact] },
  });
  jest.spyOn(window, "open").mockImplementation(() => null);
});

describe("FormOrderList warehouse sharing", () => {
  it("renders without crashing when no order is selected yet", () => {
    // Drawer mounted with nothing selected: both `order` and `orderNumber`
    // are undefined — this used to crash while computing the share message.
    mockGetOrderDetails.mockReturnValue({
      data: undefined,
      isPending: true,
      refetch: jest.fn(),
    });

    renderWithProviders(<FormOrderList showWhatsAppShare />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("opens WhatsApp with the order items and quantities in the message", async () => {
    mockGetOrderDetails.mockReturnValue({
      data: { data: loadedOrder },
      isPending: false,
      refetch: jest.fn(),
    });

    renderWithProviders(
      <FormOrderList
        order={loadedOrder}
        orderNumber="ORD-0042"
        showWhatsAppShare
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Whatsapp" }));

    expect(window.open).toHaveBeenCalledTimes(1);
    const [url, target] = (window.open as jest.Mock).mock.calls[0];
    expect(target).toBe("_blank");
    expect(url).toContain("https://wa.me/2348167163339?text=");

    const message = decodeURIComponent(url.split("?text=")[1]);
    expect(message).toContain("*Order:* ORD-0042");
    expect(message).toContain("*Customer:* Sultan Stores");
    expect(message).toContain("*Items (2):*");
    expect(message).toContain("1. Semovita — 20 units");
    expect(message).toContain("2. Peak Milk — 50 units");
  });

  it("hides the share card when no warehouse contacts are configured", () => {
    mockGetOrderDetails.mockReturnValue({
      data: { data: loadedOrder },
      isPending: false,
      refetch: jest.fn(),
    });
    mockGetWarehouseSettings.mockReturnValue({ data: { contacts: [] } });

    renderWithProviders(
      <FormOrderList
        order={loadedOrder}
        orderNumber="ORD-0042"
        showWhatsAppShare
      />,
    );

    expect(
      screen.queryByText("Share order with warehouse"),
    ).not.toBeInTheDocument();
  });
});
