"use client";
import { ShoppingBag } from "@mui/icons-material";
import TableRow from "@/components/TableRow";
import { H5 } from "@/components/Typography";
import OrderRow from "@/page-sections/orders/OrderRow";
import UserDashboardHeader from "@/components/header/UserDashboardHeader";
import CustomerDashboardNavigation from "@/components/layouts/customer-dashboard/Navigations";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useMemo } from "react";
import { fetchOrders } from "@/redux/features/orderSlice";
import { useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";

// ====================================================

const Orders = () => {
  const dispatch: any = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { orders } = useSelector((state: any) => state.orders);
  const filteredOrders = useMemo(
    () =>
      orders.filter((order: any) =>
        order.cartList.some(
          (cartItem: any) => cartItem.product.shop.id === user.docId
        )
      ),
    [orders]
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <Box py={4}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* TITLE HEADER AREA */}
          <UserDashboardHeader
            title="Orders"
            icon={ShoppingBag}
            navigation={<CustomerDashboardNavigation />}
          />
          <TableRow
            elevation={0}
            sx={{
              padding: "0px 18px",
              background: "none",
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            <H5 color="grey.600" my={0} mx={0.75} textAlign="left">
              Order #
            </H5>

            <H5 color="grey.600" my={0} mx={0.75} textAlign="left">
              Status
            </H5>

            <H5 color="grey.600" my={0} mx={0.75} textAlign="left">
              Date purchased
            </H5>

            <H5 color="grey.600" my={0} mx={0.75} textAlign="left">
              Total
            </H5>

            <H5
              my={0}
              px={2.75}
              color="grey.600"
              flex="0 0 0 !important"
              sx={{
                xs: "none",
                md: "block",
              }}
            />
          </TableRow>

          {filteredOrders.map((order: any) => (
            <OrderRow isSeller order={order} key={order.id} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Orders;
