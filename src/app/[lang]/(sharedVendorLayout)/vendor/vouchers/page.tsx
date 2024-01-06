"use client";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "@/components/dashboard/SearchArea";
import TableHeader from "@/components/data-table/TableHeader";
import TablePagination from "@/components/data-table/TablePagination";
import Scrollbar from "@/components/Scrollbar";
import { H3 } from "@/components/Typography";
import useMuiTable from "@/hooks/useMuiTable";
import VoucherRow from "@/page-sections/vendor/vouchers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import isEmpty from "lodash/isEmpty";
import NotFound from "@/components/not-found";
import {
  fetchVouchers,
  selectVoucherForUser,
} from "@/redux/features/voucherSlice";
import { RootState } from "@/redux/store";
import useCustomRouter from "@/hooks/usePushRouter";

// TABLE HEADING DATA LIST
const tableHeading = [
  {
    id: "id",
    label: "ID",
    align: "center",
  },
  {
    id: "Name",
    label: "Name",
    align: "center",
  },
  {
    id: "Condition",
    label: "Condition",
    align: "center",
  },
  {
    id: "Amount",
    label: "Amount",
    align: "center",
  },
  {
    id: "Discount",
    label: "Discount",
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
];

// =============================================================================
export default function VoucherList() {
  const dispatch: any = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const vouchers: any = useSelector((state: RootState) =>
    selectVoucherForUser(state, user.docId)
  );
  const { pushRouter } = useCustomRouter();

  const { onSearchInputChange, filteredData } = useSearch(vouchers);

  useEffect(() => {
    dispatch(fetchVouchers());
  }, [dispatch]);

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

  const handleButtonClick = () => {
    pushRouter("vendor/vouchers/create");
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Vouchers</H3>

      <SearchArea
        handleSearch={onSearchInputChange}
        buttonText="Add voucher"
        searchPlaceholder="Search voucher..."
        handleBtnClick={handleButtonClick}
      />

      <Card>
        <Scrollbar>
          <TableContainer
            sx={{
              minWidth: 600,
            }}
          >
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={filteredList.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {!isEmpty(filteredList) ? (
                  filteredList.map((voucher: any) => (
                    <VoucherRow voucher={voucher} key={voucher.id} />
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
              count={Math.ceil(filteredData.length / rowsPerPage)}
            />
          </Stack>
        )}
      </Card>
    </Box>
  );
}
