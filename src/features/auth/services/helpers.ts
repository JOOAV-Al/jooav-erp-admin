import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ROLE_COOKIE = "userRole";

export const getLoginRoute = (role?: string | null): string => {
  if (role === "SUPER_ADMIN") {
    return "/super-admin/login";
  } else if (role === "ADMIN") {
    return "/admin/login";
  } else {
    return "/procurement-officer/login";
  }
};

// Decode a role from a JWT without throwing on expired/invalid tokens.
export const getRoleFromToken = (token?: string | null): string => {
  if (!token || token === "undefined" || token === "null") return "";
  try {
    return jwtDecode<{ role?: string }>(token)?.role ?? "";
  } catch {
    return "";
  }
};

// Persist the role so post-session-expiry redirects still know where to go.
export const setStoredRole = (role?: string | null): void => {
  if (!role) return;
  Cookies.set(ROLE_COOKIE, role, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const getStoredRole = (): string => {
  const stored = Cookies.get(ROLE_COOKIE);
  if (stored && stored !== "undefined" && stored !== "null") return stored;
  return (
    getRoleFromToken(Cookies.get("authToken")) ||
    getRoleFromToken(Cookies.get("refreshToken"))
  );
};
