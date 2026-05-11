export function redirectByRole(role: string) {
  switch (role) {
    case "platform_admin":
      return "/platform-admin";

    case "cafe_owner":
    case "branch_manager":
      return "/dashboard";

    case "cashier":
    case "barista":
      return "/dashboard/orders";

    case "customer":
    default:
      return "/customer";
  }
}