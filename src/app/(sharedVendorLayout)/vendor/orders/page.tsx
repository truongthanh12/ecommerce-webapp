"use client";
import { H3, H5 } from "@/components/Typography";
import OrderRow from "@/page-sections/orders/OrderRow";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useMemo } from "react";
import { fetchOrders } from "@/redux/features/orderSlice";
import { useSelector } from "react-redux";
import { Box, Stack, Table, TableBody, TableContainer } from "@mui/material";
import { useSearch } from "@/app/hooks/useSearch";
import useMuiTable from "@/app/hooks/useMuiTable";
import SearchArea from "@/app/components/dashboard/SearchArea";
import TablePagination from "@/app/components/data-table/TablePagination";
import Card from "@/app/components/Card";
import Scrollbar from "@/app/components/Scrollbar";
import TableHeader from "@/app/components/data-table/TableHeader";
import { isEmpty } from "lodash";
import NotFound from "@/app/components/not-found";
import TableRow from "@/app/components/TableRow";

// ====================================================
const tableHeading = [
  {
    id: "order",
    label: "#Order ID",
    align: "center",
  },
  {
    id: "Status",
    label: "Status",
    align: "center",
  },
  {
    id: "date",
    label: "Date purcharse",
    align: "center",
  },
  {
    id: "Total",
    label: "Total",
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
];
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

  const { onSearchInputChange, filteredData } = useSearch(filteredOrders);

  const {
    order,
    orderBy,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: filteredData,
    defaultSort: "name",
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Vouchers</H3>

      <SearchArea
        handleSearch={onSearchInputChange}
        buttonText=""
        searchPlaceholder="Search Order by ID"
        handleBtnClick={""}
      />
      <Card>
        <Scrollbar>
          <TableContainer
            sx={{
              minWidth: 600,
            }}
          >
            <Table>
            <TableRow
            elevation={0}
            sx={{
              padding: "20px 18px",
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
          </TableRow>

              <TableBody>
                {!isEmpty(filteredList) ? (
                  filteredList.map((order: any) => (
                    <OrderRow isSeller order={order} key={order.id} />
                  ))
                ) : (
                  <tr>
                    <td>
                      <NotFound />
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {Math.ceil(filteredData.length / rowsPerPage) > 1 && (
          <Stack alignItems="center" my={4}>
            <TablePagination
              onChange={handleChangePage}
              count={Math.round(filteredData.length / rowsPerPage)}
            />
          </Stack>
        )}
      </Card>
    </Box>
  );
};

export default Orders;
