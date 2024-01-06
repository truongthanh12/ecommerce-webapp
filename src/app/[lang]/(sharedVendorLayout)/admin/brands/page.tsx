"use client";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "@/components/dashboard/SearchArea";
import TableHeader from "@/components/data-table/TableHeader";
import TablePagination from "@/components/data-table/TablePagination";
import Scrollbar from "@/components/Scrollbar";
import { H3 } from "@/components/Typography";
import useMuiTable from "@/hooks/useMuiTable";
import BrandRow from "@/page-sections/admin/brands";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBrands } from "@/redux/features/brandSlice";
import { useSearch } from "@/hooks/useSearch";
import isEmpty from "lodash/isEmpty";
import NotFound from "@/components/not-found";
import { IBrand } from "@/models/Brand";
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
    id: "name",
    label: "Name",
    align: "center",
  },
  {
    id: "logo",
    label: "Logo",
    align: "center",
  },
  {
    id: "featured",
    label: "Featured",
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
];

// =============================================================================

export default function BrandList() {
  const { brands } = useSelector((state: RootState) => state.brands);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: any = useDispatch();
  const { onSearchInputChange, filteredData } = useSearch(brands);
  const { pushRouter } = useCustomRouter();

  useEffect(() => {
    dispatch(fetchBrands(false, user.docId));
  }, [dispatch, user.docId]);

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

  const handleButtonClick = () => {
    pushRouter("admin/brands/create");
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Product Brands</H3>

      <SearchArea
        handleSearch={onSearchInputChange}
        buttonText="Add Brand"
        searchPlaceholder="Search Brand..."
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
                numSelected={selected.length}
                rowCount={filteredList.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {!isEmpty(filteredList) ? (
                  filteredList.map((brand: Partial<IBrand>) => (
                    <BrandRow
                      brand={brand}
                      key={brand.id}
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
