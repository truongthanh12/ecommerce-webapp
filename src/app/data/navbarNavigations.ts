import categoriesMegaMenu from "./categoriesMegaMenu";

// MEGAMENU DATA
const megaMenus = [
  [
    {
      title: "Home",
      child: [
        {
          title: "Market 1",
          url: "/market-1",
        },
        {
          title: "Furniture",
          url: "/furniture-shop",
        },
        {
          title: "Grocery-v1",
          url: "/grocery1",
        },
        {
          title: "Grocery-v2",
          url: "/grocery2",
        },
        {
          title: "Grocery-v3",
          url: "/grocery3",
        },
        {
          title: "Health and Beauty",
          url: "/healthbeauty-shop",
        },
        {
          title: "Fashion",
          url: "/fashion-shop-1",
        },
        {
          title: "Gift Store",
          url: "/gift-shop",
        },
        {
          title: "Gadget",
          url: "/gadget-shop",
        },
      ],
    },
  ],
  [
    {
      title: "User Account",
      child: [
        {
          title: "Order List",
          url: "/orders",
        },
        {
          title: "Order Details",
          url: "/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8",
        },
        {
          title: "View Profile",
          url: "/profile",
        },
        {
          title: "Edit Profile",
          url: "/profile/e42e28ea-528f-4bc8-81fb-97f658d67d75",
        },
        {
          title: "Address List",
          url: "/address",
        },
        {
          title: "Add Address",
          url: "/address/d27d0e28-c35e-4085-af1e-f9f1b1bd9c34",
        },
        {
          title: "All tickets",
          url: "/support-tickets",
        },
        {
          title: "Ticket details",
          url: "/support-tickets/when-will-my-product-arrive",
        },
        {
          title: "Wishlist",
          url: "/wish-list",
        },
      ],
    },
  ],
  [
    {
      title: "Vendor Account",
      child: [
        {
          title: "Dashboard",
          url: "/vendor/dashboard",
        },
        {
          title: "Profile",
          url: "/vendor/account-setting",
        },
      ],
    },
    {
      title: "Products",
      child: [
        {
          title: "All products",
          url: "/vendor/products",
        },
        {
          title: "Add/Edit product",
          url: "/vendor/product/create",
        },
      ],
    },
    {
      title: "Orders",
      child: [
        {
          title: "All orders",
          url: "/admin/orders",
        },
        {
          title: "Order details",
          url: "/admin/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8",
        },
      ],
    },
  ],
  [
    {
      title: "Sale Page",
      child: [
        {
          title: "Sales Version 1",
          url: "/sale-page-1",
        },
        {
          title: "Sales Version 2",
          url: "/sale-page-2",
        },
      ],
    },
    {
      title: "Shop",
      child: [
        {
          title: "Search product",
          url: "/product/search/mobile phone",
        },
        {
          title: "Single product",
          url: "/product/lord-2019",
        },
        {
          title: "Cart",
          url: "/cart",
        },
        {
          title: "Checkout",
          url: "/checkout",
        },
        {
          title: "Order confirmation",
          url: "/order-complete",
        },
      ],
    },
  ],
];

// MAIN NAVIGATION DATA
const navbarNavigations = [
  {
    title: "Home",
    url: "/",
    megaMenu: false,
    megaMenuWithSub: false,
  },
  {
    title: "Shops",
    url: "/shops",
    megaMenu: false,
    megaMenuWithSub: false,
  },
  {
    title: "Products",
    url: "/product/search/products",
    megaMenu: false,
    megaMenuWithSub: false,
  },
  // {
  //   megaMenu: false,
  //   megaMenuWithSub: false,
  //   title: "User Account",
  //   child: [
  //     {
  //       title: "Profile",
  //       url: "/profile",
  //     },
  //     {
  //       title: "Orders",
  //       url: "/orders",
  //     },
  //     {
  //       title: "Wishlist",
  //       url: "/wish-list",
  //     },
  //   ],
  // },
  // {
  //   megaMenu: false,
  //   megaMenuWithSub: false,
  //   title: "Vendor Account",
  //   child: [
  //     {
  //       title: "Dashboard",
  //       url: "/vendor/dashboard",
  //     },
  //     {
  //       title: "Products",
  //       url: "/vendor/products",
  //     },
  //     {
  //       title: "Orders",
  //       url: "/vendor/orders",
  //     },
  //     {
  //       title: "Profile",
  //       url: "/vendor/account-setting",
  //     },
  //   ],
  // },
];
export default navbarNavigations;
