"use client";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "@/components/dashboard/SearchArea";
import TableHeader from "@/components/data-table/TableHeader";
import TablePagination from "@/components/data-table/TablePagination";
import Scrollbar from "@/components/Scrollbar";
import { H3 } from "@/components/Typography";
import useMuiTable from "@/hooks/useMuiTable";
import ProductRow from "@/page-sections/vendor/products";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import Image from "@/components/Image";
import isEmpty from "lodash/isEmpty";
import { fetchProducts } from "@/redux/features/productSlice";

// TABLE HEADING DATA LIST
const tableHeading = [
  {
    id: "name",
    label: "Name",
    align: "center",
  },
  {
    id: "stock",
    label: "Stock",
    align: "center",
  },
  {
    id: "category",
    label: "Category",
    align: "center",
  },
  {
    id: "brand",
    label: "Brand",
    align: "center",
  },
  {
    id: "price",
    label: "Price",
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

export default function ProductList() {
  // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID
  const router = useRouter();
  const { products } = useSelector((state: any) => state.products);
  const dispatch: any = useDispatch();
  const { onSearchInputChange, filteredData } = useSearch(products);

  useEffect(() => {
    dispatch(fetchProducts());
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
    router.push("/vendor/products/create");
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Products</H3>

      <SearchArea
        handleSearch={onSearchInputChange}
        buttonText="Add Product"
        searchPlaceholder="Search Product..."
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
                  filteredList.map((product: any) => (
                    <ProductRow
                    product={product}
                      key={product.id}
                      selected={selected}
                    />
                  ))
                ) : (
                  <Box>
                    <Image
                      src="/assets/images/illustrations/404.svg"
                      sx={{
                        display: "block",
                        width: "100%",
                        marginLeft: "auto",
                        marginRight: "auto",
                        my: 3,
                      }}
                      alt="404-Not-Found"
                    />
                  </Box>
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