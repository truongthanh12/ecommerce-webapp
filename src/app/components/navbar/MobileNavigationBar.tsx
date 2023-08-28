'use client'
import { Badge } from "@mui/material";
import Home from "@/components/icons/Home";
import User2 from "@/components/icons/User2";
import CategoryOutlined from "@/components/icons/CategoryOutline";
import ShoppingBagOutlined from "@/components/icons/ShoppingBagOutlined";
import { iconStyle, StyledNavLink, Wrapper } from "./styles";
import React from "react";
import useWindowSize from "@/app/hooks/useWindowSize";

const MobileNavigationBar = () => {
  const width = useWindowSize();
  return width <= 900 ? (
    <Wrapper>
      {list.map((item) => (
        <StyledNavLink href={item.href} key={item.title}>
          {item.title === "Cart" ? (
            <Badge color="primary">
              <item.icon fontSize="small" sx={iconStyle} />
            </Badge>
          ) : (
            <item.icon sx={iconStyle} fontSize="small" />
          )}

          {item.title}
        </StyledNavLink>
      ))}
    </Wrapper>
  ) : null;
};

const list = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Category",
    icon: CategoryOutlined,
    href: "/mobile-category-nav",
  },
  {
    title: "Cart",
    icon: ShoppingBagOutlined,
    href: "/cart",
  },
  {
    title: "Account",
    icon: User2,
    href: "/profile",
  },
];

export default React.memo(MobileNavigationBar);
