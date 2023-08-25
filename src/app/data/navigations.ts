import Car from "@/components/icons/Car";
import Dress from "@/components/icons/Dress";
const navigations = [
  {
    icon: Dress,
    title: "Fashion",
    href: "/fashion",
    menuComponent: "MegaMenu1",
    menuData: {
      categories: [
        {
          title: "Bags",
          href: "/product/search/bags",
          subCategories: [
            {
              title: "Backpack",
              href: "/product/search/backpack",
              imgUrl: "/assets/images/products/categories/backpack.png",
            },
            {
              title: "Crossbody Bags",
              href: "/product/search/Crossbody Bags",
              imgUrl: "/assets/images/products/categories/bag.png",
            },
            {
              title: "Side Bags",
              href: "/product/search/Side Bags",
              imgUrl: "/assets/images/products/categories/mini-bag.png",
            },
            {
              title: "Slides",
              href: "/product/search/Slides",
              imgUrl: "/assets/images/products/categories/belt.png",
            },
          ],
        },
      ],
      rightImage: {
        imgUrl: "/assets/images/promotion/offer-1.png",
        href: "/sale-page-1",
      },
    },
  },
  {
    icon: Car,
    title: "Automotive",
    href: "/product/search/automotive",
    menuComponent: "MegaMenu1",
  },
];
export default navigations;
