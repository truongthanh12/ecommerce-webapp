"use client";
import { Pagination, Stack } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import TableRow from "@/components/TableRow";
import { H5 } from "@/components/Typography";
import { FlexBox } from "@/components/flex-box";
import OrderRow from "@/page-sections/orders/OrderRow";
import UserDashboardHeader from "@/components/header/UserDashboardHeader";
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "@/components/layouts/customer-dashboard/Navigations";
import { useAppDispatch } from "@/redux/hooks";
import { Suspense, useEffect } from "react";
import { fetchOrders } from "@/redux/features/orderSlice";
import { useSelector } from "react-redux";
import BackdropLoading from "@/components/backdrop";
import { RootState } from "@/redux/store";
import useMuiTable from "@/hooks/useMuiTable";
import TablePagination from "@/components/data-table/TablePagination";
import NotFound from "@/components/not-found";

// ====================================================

const Orders = () => {
  const dispatch: any = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders } = useSelector((state: RootState) => state.orders);

  const { rowsPerPage, handleChangePage, filteredList } = useMuiTable({
    listData: orders,
  });

  useEffect(() => {
    dispatch(fetchOrders(user.docId));
  }, [dispatch, user.docId]);

  // useEffect(() => {
  //   firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
  // .then((idToken) => {
  //   // Send the ID token to your server
  //   console.log("User ID token: ", idToken);
  // })
  // .catch((error) => {
  //   console.error("Error getting user ID token: ", error);
  // });
  // }, [])

  if (!user?.uid) {
    return null
  }

  return (
    <Suspense fallback={<BackdropLoading />}>
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

        {orders.length ? (
          filteredList.map((order: any) => (
            <OrderRow order={order} key={order.id} />
          ))
        ) : (
          <NotFound />
        )}

        {Math.ceil(orders.length / rowsPerPage) > 1 && (
          <Stack alignItems="center" my={4}>
            <TablePagination
              onChange={handleChangePage}
              count={Math.ceil(orders.length / rowsPerPage)}
            />
          </Stack>
        )}
      </CustomerDashboardLayout>
    </Suspense>
  );
};

export default Orders;
