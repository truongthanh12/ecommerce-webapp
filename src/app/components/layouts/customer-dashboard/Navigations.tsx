"use client";
import { Fragment, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Card, styled, Typography } from "@mui/material";
import { FavoriteBorder, Person } from "@mui/icons-material";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import { FlexBox } from "@/components/flex-box";
import NavLink from "@/components/nav-link/NavLink";
import { useSelector } from "react-redux";
import { fetchOrders } from "@/redux/features/orderSlice";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";

// custom styled components
const MainContainer = styled(Card)(({ theme }) => ({
  paddingBottom: "1.5rem",
  [theme.breakpoints.down("md")]: {
    boxShadow: "none",
    overflowY: "auto",
    height: "calc(100vh - 64px)",
  },
}));
const StyledNavLink = styled(({ children, isCurrentPath, ...rest }: any) => (
  <NavLink {...rest}>{children}</NavLink>
))(({ theme, isCurrentPath }) => ({
  display: "flex",
  alignItems: "center",
  borderLeft: "4px solid",
  paddingLeft: "1.5rem",
  paddingRight: "1.5rem",
  marginBottom: "1.25rem",
  justifyContent: "space-between",
  borderColor: isCurrentPath ? theme.palette.primary.main : "transparent",
  "& .nav-icon": {
    color: isCurrentPath ? theme.palette.primary.main : theme.palette.grey[600],
  },
  "&:hover": {
    borderColor: theme.palette.primary.main,
    "& .nav-icon": {
      color: theme.palette.primary.main,
    },
  },
}));

const LINK_LIST = [
  {
    title: "DASHBOARD",
    list: [
      {
        href: "/profile",
        title: "Profile Info",
        icon: Person,
        count: 3,
      },
      {
        href: "/orders",
        title: "Orders",
        icon: ShoppingBagOutlined,
        count: 5,
      },
      {
        href: "/wish-list",
        title: "Wishlist",
        icon: FavoriteBorder,
        count: 19,
      },
    ],
  },
];

const Navigations = () => {
  const pathname = usePathname();
  const dispatch: any = useAppDispatch();
  const { orders } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchOrders(user.docId));
  }, [dispatch]);

  const updatedLinkList = LINK_LIST.map((section) => {
    if (section.title === "DASHBOARD") {
      section.list = section.list.map((item) => {
        if (item.title === "Orders") {
          return {
            ...item,
            count: orders.length,
          };
        }
        if (item.title === "Wishlist") {
          return {
            ...item,
            count: user.wishlist.length,
          };
        }
        return item;
      });
    }
    return section;
  });

  return (
    <MainContainer>
      {updatedLinkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p="26px 30px 1rem" color="grey.600" fontSize="12px">
            {item.title}
          </Typography>

          {item.list.map((item) => (
            <StyledNavLink
              href={item.href}
              key={item.title}
              isCurrentPath={pathname.includes(item.href)}
            >
              <FlexBox alignItems="center" gap={1}>
                <item.icon
                  color="inherit"
                  fontSize="small"
                  className="nav-icon"
                />
                <span>{item.title}</span>
              </FlexBox>

              <span>{item.count}</span>
            </StyledNavLink>
          ))}
        </Fragment>
      ))}
    </MainContainer>
  );
};

export default Navigations;
