"use client";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "@/components/dashboard/SearchArea";
import TableHeader from "@/components/data-table/TableHeader";
import TablePagination from "@/components/data-table/TablePagination";
import Scrollbar from "@/components/Scrollbar";
import { H3 } from "@/components/Typography";
import useMuiTable from "@/hooks/useMuiTable";
import BannerRow from "@/page-sections/admin/banners";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import isEmpty from "lodash/isEmpty";
import { fetchBanners } from "@/redux/features/bannerSlice";
import NotFound from "@/app/components/not-found";

// TABLE HEADING DATA LIST
const tableHeading = [
  {
    id: "id",
    label: "ID",
    align: "center",
  },
  {
    id: "title",
    label: "Title",
    align: "center",
  },
  {
    id: "logo",
    label: "Logo",
    align: "center",
  },
  {
    id: "description",
    label: "Description",
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

export default function BannerList() {
  // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID
  const router = useRouter();
  const { banners } = useSelector((state: any) => state.banners);
  const dispatch: any = useDispatch();

  const uniqueArrayBanners: any[] = useMemo(() => {
    return [...new Set(banners)];
  }, [banners]);
  const { onSearchInputChange, filteredData } = useSearch(uniqueArrayBanners);
  
  useEffect(() => {
    dispatch(fetchBanners());
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
    router.push("/admin/banners/create");
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Banners</H3>

      <SearchArea
        handleSearch={onSearchInputChange}
        buttonText="Add banner"
        searchPlaceholder="Search banner..."
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
                  filteredList.map((banner: any) => (
                    <BannerRow
                      banner={banner}
                      key={banner.id}
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
