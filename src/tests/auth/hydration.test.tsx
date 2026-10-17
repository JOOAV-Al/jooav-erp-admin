import React from "react";
import { waitFor } from "@testing-library/react";
import Cookies from "js-cookie";
import { renderWithProviders } from "@/tests/test-utils";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import { api } from "@/lib/api/axiosInstance";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

jest.mock("@/lib/api/axiosInstance", () => ({
  api: { get: jest.fn() },
}));

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const getMock = Cookies.get as jest.Mock;
const apiGetMock = api.get as jest.Mock;

const Probe = () => {
  useAuthHydration();
  return <div>probe</div>;
};

describe("useAuthHydration", () => {
  beforeEach(() => jest.clearAllMocks());

  it("stores the user on success without redirecting", async () => {
    apiGetMock.mockResolvedValue({
      data: { data: { id: "1", role: "ADMIN" } },
    });
    getMock.mockImplementation((name: string) =>
      name === "authToken" ? "some-token" : undefined,
    );

    const { store } = renderWithProviders(<Probe />);

    await waitFor(() =>
      expect(store.getState().auth.user).toEqual({ id: "1", role: "ADMIN" }),
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("redirects to the stored role's login when the session is dead", async () => {
    apiGetMock.mockRejectedValue(new Error("401"));
    getMock.mockImplementation((name: string) =>
      name === "userRole" ? "SUPER_ADMIN" : undefined,
    );

    renderWithProviders(<Probe />);

    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/super-admin/login"),
    );
  });

  it("does not throw on garbage cookies and falls back to the default login", async () => {
    apiGetMock.mockRejectedValue(new Error("401"));
    getMock.mockReturnValue("undefined");

    renderWithProviders(<Probe />);

    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/procurement-officer/login"),
    );
  });
});
