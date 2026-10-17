import Cookies from "js-cookie";
import {
  getLoginRoute,
  getRoleFromToken,
  getStoredRole,
  setStoredRole,
} from "@/features/auth/services/helpers";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

const getMock = Cookies.get as jest.Mock;
const setMock = Cookies.set as jest.Mock;

// jwt-decode does not verify signatures, so a fake 3-part token works
const tokenFor = (role: string) =>
  `e30.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.sig`;

describe("getLoginRoute", () => {
  it("maps known roles to their login routes", () => {
    expect(getLoginRoute("SUPER_ADMIN")).toBe("/super-admin/login");
    expect(getLoginRoute("ADMIN")).toBe("/admin/login");
    expect(getLoginRoute("PROCUREMENT_OFFICER")).toBe(
      "/procurement-officer/login",
    );
  });

  it("falls back to the procurement officer login for unknown roles", () => {
    expect(getLoginRoute("")).toBe("/procurement-officer/login");
    expect(getLoginRoute(undefined)).toBe("/procurement-officer/login");
    expect(getLoginRoute(null)).toBe("/procurement-officer/login");
  });
});

describe("getRoleFromToken", () => {
  it("decodes the role from a valid token", () => {
    expect(getRoleFromToken(tokenFor("ADMIN"))).toBe("ADMIN");
    expect(getRoleFromToken(tokenFor("SUPER_ADMIN"))).toBe("SUPER_ADMIN");
  });

  it("returns an empty string for missing or invalid tokens", () => {
    expect(getRoleFromToken(undefined)).toBe("");
    expect(getRoleFromToken("")).toBe("");
    expect(getRoleFromToken("undefined")).toBe("");
    expect(getRoleFromToken("not-a-jwt")).toBe("");
  });
});

describe("getStoredRole", () => {
  beforeEach(() => jest.clearAllMocks());

  it("prefers the persisted role cookie", () => {
    getMock.mockImplementation((name: string) =>
      name === "userRole" ? "SUPER_ADMIN" : undefined,
    );

    expect(getStoredRole()).toBe("SUPER_ADMIN");
  });

  it("falls back to decoding the access token", () => {
    getMock.mockImplementation((name: string) =>
      name === "authToken" ? tokenFor("ADMIN") : undefined,
    );

    expect(getStoredRole()).toBe("ADMIN");
  });

  it("ignores stringified-undefined cookies and returns empty string", () => {
    getMock.mockReturnValue("undefined");

    expect(getStoredRole()).toBe("");
  });
});

describe("setStoredRole", () => {
  beforeEach(() => jest.clearAllMocks());

  it("persists a role", () => {
    setStoredRole("ADMIN");

    expect(setMock).toHaveBeenCalledWith(
      "userRole",
      "ADMIN",
      expect.anything(),
    );
  });

  it("does not overwrite with an empty role", () => {
    setStoredRole("");
    setStoredRole(undefined);
    setStoredRole(null);

    expect(setMock).not.toHaveBeenCalled();
  });
});
