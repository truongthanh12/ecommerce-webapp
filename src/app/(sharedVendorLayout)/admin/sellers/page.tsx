"use client";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "@/components/dashboard/SearchArea";
import TableHeader from "@/components/data-table/TableHeader";
import TablePagination from "@/components/data-table/TablePagination";
import Scrollbar from "@/components/Scrollbar";
import { H3 } from "@/components/Typography";
import useMuiTable from "@/hooks/useMuiTable";
import UserRow from "@/page-sections/admin/users";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import isEmpty from "lodash/isEmpty";
import { fetchUsers } from "@/redux/features/authSlice";
import NotFound from "@/app/components/not-found";

// TABLE HEADING DATA LIST
const tableHeading = [
  {
    id: "name",
    label: "Name",
    align: "center",
  },
  {
    id: "phone",
    label: "Phone",
    align: "center",
  },
  {
    id: "email",
    label: "Email",
    align: "center",
  },
  {
    id: "wallet-balance",
    label: "Wallet Balance",
    align: "center",
  },
  {
    id: "Package",
    label: "Package",
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
];

// =============================================================================

export default function SellerList() {
  const { users } = useSelector((state: any) => state.auth);
  const dispatch: any = useDispatch();

  const uniqueArrayCategories: any[] = useMemo(() => {
    return [...new Set(users)];
  }, [users]);
  const { onSearchInputChange, filteredData } = useSearch(
    uniqueArrayCategories
  );

  useEffect(() => {
    dispatch(fetchUsers({ isVendor: true }));
  }, [dispatch]);

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
      <H3 mb={2}>Sellers</H3>

      <SearchArea
        handleSearch={onSearchInputChange}
        searchPlaceholder="Search seller email..."
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
                  filteredList.map((user: any) => (
                    <UserRow user={user} key={user.uid} selected={selected} />
                  ))
                ) : (
                  <NotFound />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {Math.ceil(filteredList.length / rowsPerPage) > 1 && (
          <Stack alignItems="center" my={4}>
            <TablePagination
              onChange={handleChangePage}
              count={Math.ceil(filteredList.length / rowsPerPage)}
            />
          </Stack>
        )}
      </Card>
    </Box>
  );
}
