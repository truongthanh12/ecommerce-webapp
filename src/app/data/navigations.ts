// import Car from "@/components/icons/Car";
// import Dress from "@/components/icons/Dress";
import { INavigation } from "../models/Navigation";
const navigations: INavigation[] = [
  {
    id: "dress",
    icon: "dress",
    title: "Fashion",
    href: "/fashion",
    menuComponent: "MegaMenu1",
    menuData: {
      categories: [
        {
          title: "Bags",
          href: "/product/search/bags",
        },
      ],
      rightImage: {
        imgUrl: "/assets/images/promotion/offer-1.png",
        href: "/sale-page-1",
      },
    },
  },
  {
    id: "car",
    icon: "car",
    title: "Automotive",
    href: "/product/search/automotive",
    menuComponent: "MegaMenu1",
  },
];
export default navigations;
