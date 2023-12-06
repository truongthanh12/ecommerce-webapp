"use client";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "@/components/dashboard/SearchArea";
import TableHeader from "@/components/data-table/TableHeader";
import TablePagination from "@/components/data-table/TablePagination";
import Scrollbar from "@/components/Scrollbar";
import { H3 } from "@/components/Typography";
import useMuiTable from "@/hooks/useMuiTable";
import RechargeRow from "@/page-sections/admin/recharge";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import isEmpty from "lodash/isEmpty";
import NotFound from "@/components/not-found";
import { fetchRecharge } from "@/redux/features/rechargeSlice";
import { RootState } from "@/redux/store";
import { ADMIN_ID } from "@/app/constant";

// TABLE HEADING DATA LIST
const tableHeading = [
  {
    id: "id",
    label: "ID-CODE",
    align: "center",
  },
  {
    id: "amount",
    label: "Amount",
    align: "center",
  },
  {
    id: "published",
    label: "Published",
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
];

// =============================================================================

export default function RechargeRequest() {
  const { recharge } = useSelector((state: RootState) => state.recharge);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: any = useDispatch();

  const { onSearchInputChange, filteredData } = useSearch(recharge);

  const isAdmin = useMemo(() => user.docId === ADMIN_ID, [user.docId]);

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchRecharge());
      return;
    }
    dispatch(fetchRecharge(user.docId));
  }, [dispatch, user.docId, isAdmin]);

  const {
    order,
    orderBy,
    selected,
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
      <H3 mb={2}>Recharge requests</H3>

      <SearchArea
        handleSearch={onSearchInputChange}
        searchPlaceholder="Search recharge request..."
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
                numSelected={selected.length}
                rowCount={filteredList.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {!isEmpty(filteredList) ? (
                  filteredList.map((recharge: any) => (
                    <RechargeRow
                      recharge={recharge}
                      key={recharge.id}
                      user={user}
                    />
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
