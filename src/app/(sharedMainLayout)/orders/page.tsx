"use client"
import { Pagination } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import TableRow from "@/components/TableRow";
import { H5 } from "@/components/Typography";
import { FlexBox } from "@/components/flex-box";
import OrderRow from "@/page-sections/orders/OrderRow";
import UserDashboardHeader from "@/components/header/UserDashboardHeader";
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "@/components/layouts/customer-dashboard/Navigations";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { fetchOrders } from "@/redux/features/orderSlice";
import { useSelector } from "react-redux";

// ====================================================

const Orders = () => {
  const dispatch: any = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { orders } = useSelector((state: any) => state.orders);
  
  useEffect(() => {
    dispatch(fetchOrders(user.docId));
  }, [dispatch, user.docId]);

  return (
    <CustomerDashboardLayout>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        title="My Orders"
        icon={ShoppingBag}
        navigation={<CustomerDashboardNavigation />}
      />

      {/* ORDER LIST AREA */}
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

      {orders.map((order: any) => (
        <OrderRow order={order} key={order.id} />
      ))}

      <FlexBox justifyContent="center" mt={5}>
        <Pagination
          count={5}
          color="primary"
          variant="outlined"
          // onChange={(data) => console.log(data)}
        />
      </FlexBox>
    </CustomerDashboardLayout>
  );
};

export default Orders;
