export const getLoginRoute = (role: string): string => {
  if (role === "SUPER_ADMIN") {
    return "/super-admin/login";
  } else if (role === "ADMIN") {
    return "/admin/login";
  } else {
    return "/procurement-officer/login";
  }
};