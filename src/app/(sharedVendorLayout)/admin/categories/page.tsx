"use client";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "@/components/dashboard/SearchArea";
import TableHeader from "@/components/data-table/TableHeader";
import TablePagination from "@/components/data-table/TablePagination";
import Scrollbar from "@/components/Scrollbar";
import { H3 } from "@/components/Typography";
import useMuiTable from "@/hooks/useMuiTable";
import CategoryRow from "@/page-sections/admin/categories";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import isEmpty from "lodash/isEmpty";
import { fetchCategories } from "@/redux/features/categorySlice";
import NotFound from "@/app/components/not-found";

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
    id: "parents",
    label: "Parents",
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

export default function CategoriesList() {
  // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID
  const router = useRouter();
  const { categories } = useSelector((state: any) => state.categories);
  const dispatch: any = useDispatch();

  const uniqueArrayCategories: any[] = useMemo(() => {
    return [...new Set(categories)];
  }, [categories]);
  const { onSearchInputChange, filteredData } = useSearch(
    uniqueArrayCategories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

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
    router.push("/admin/categories/create");
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Categories</H3>

      <SearchArea
        handleSearch={onSearchInputChange}
        buttonText="Add category"
        searchPlaceholder="Search category..."
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
                  filteredList.map((category: any) => (
                    <CategoryRow
                      category={category}
                      key={category.id}
                      selected={selected}
                    />
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
