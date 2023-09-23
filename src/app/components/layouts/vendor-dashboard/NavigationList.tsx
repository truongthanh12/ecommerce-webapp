import duotone from "@/components/icons/duotone";
export const navigations = [
  {
    type: "label",
    label: "Admin",
  },
  {
    name: "Dashboard",
    icon: duotone.Dashboard,
    path: "/vendor/dashboard",
  },
  {
    name: "Categories",
    icon: duotone.Accounts,
    children: [
      {
        name: "Category List",
        path: "/admin/categories",
      },
      {
        name: "Create Category",
        path: "/admin/categories/create",
      },
    ],
  },
  {
    name: "Brands",
    icon: duotone.Apps,
    children: [
      {
        name: "Brand List",
        path: "/admin/brands",
      },
      {
        name: "Create Brand",
        path: "/admin/brands/create",
      },
    ],
  },
  {
    name: "Banners",
    icon: duotone.Session,
    children: [
      {
        name: "Banner List",
        path: "/admin/banners",
      },
      {
        name: "Create Banner",
        path: "/admin/banners/create",
      },
    ],
  },
  {
    name: "Customers",
    icon: duotone.Customers,
    path: "/admin/customers",
  },
  {
    name: "Sellers",
    icon: duotone.Seller,
    children: [
      {
        name: "Seller List",
        path: "/admin/sellers",
      },
      {
        name: "Package",
        path: "/admin/sellers/package",
      },
      {
        name: "Recharge",
        path: "/admin/sellers/recharge",
      },
      {
        name: "Recharge Requests",
        path: "/admin/sellers/recharge-requests",
      }
    ],
  },
  {
    type: "label",
    label: "Vendor",
  },
  {
    name: "Products",
    icon: duotone.Products,
    children: [
      {
        name: "Product List",
        path: "/vendor/products",
      },
      {
        name: "Create Product",
        path: "/vendor/products/create",
      },
    ],
  },
  {
    name: "Orders",
    icon: duotone.Order,
    children: [
      {
        name: "Order List",
        path: "/vendor/orders",
      },
      {
        name: "Order Details",
        path: "/vendor/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8",
      },
    ],
  },
  {
    name: "Reviews",
    icon: duotone.ElementHub,
    path: "/vendor/reviews",
  },
  {
    name: "Vouchers",
    icon: duotone.Products,
    children: [
      {
        name: "Voucher List",
        path: "/vendor/vouchers",
      },
      {
        name: "Create Voucher",
        path: "/vendor/vouchers/create",
      },
    ],
  },
  {
    name: "Support Tickets",
    icon: duotone.ElementHub,
    path: "/vendor/support-tickets",
  },
  {
    name: "Account Setting",
    icon: duotone.AccountSetting,
    path: "/vendor/account-setting",
  },
  {
    name: "Logout",
    icon: duotone.Session,
    path: "/",
  },
];
