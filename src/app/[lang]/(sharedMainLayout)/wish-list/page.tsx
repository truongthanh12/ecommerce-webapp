"use client";
import { Grid, Stack } from "@mui/material";
import UserDashboardHeader from "@/components/header/UserDashboardHeader";
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "@/components/layouts/customer-dashboard/Navigations";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import BackdropLoading from "@/components/backdrop";
import { RootState } from "@/redux/store";
import NotFound from "@/app/components/not-found";
import isEmpty from "lodash/isEmpty";
import ProductCard from "@/components/products/Card";
import { IProducts } from "@/app/models/Product";
import Heart from "@/app/components/icons/Heart";
import useMuiTable from "@/app/hooks/useMuiTable";
import TablePagination from "@/app/components/data-table/TablePagination";

// ====================================================

const Wishlist = () => {
  const { wishlist } = useSelector((state: RootState) => state.auth.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    rowsPerPage,
    handleChangePage,
    filteredList
  } = useMuiTable({
    listData: wishlist,
    rowsPerPage: 6
  });

  if (!user?.uid) {
    return null
  }
  return (
    <Suspense fallback={<BackdropLoading />}>
      <Grid container spacing={3}>
        <CustomerDashboardLayout>
          {/* TITLE HEADER AREA */}
          <UserDashboardHeader
            title="My Wishlist"
            icon={Heart}
            navigation={<CustomerDashboardNavigation />}
          />
          <Grid container spacing={3}>
            {!isEmpty(wishlist) ? (
              filteredList.map(
                (
                  { products }: { products: Partial<IProducts> },
                  ind: number
                ) => (
                  <Grid
                    item
                    lg={4}
                    sm={6}
                    xs={12}
                    key={(products.id || "") + ind}
                  >
                    <ProductCard
                      id={products.id}
                      slug={products.slug}
                      title={products.title}
                      price={products.price}
                      discount={products.discount}
                      images={products.images}
                      thumbnail={products.thumbnail}
                      stock={products.stock}
                      shop={products.shop}
                    />
                  </Grid>
                )
              )
            ) : (
              <NotFound />
            )}
          </Grid>

          {Math.ceil(wishlist.length / rowsPerPage) > 1 && (
            <Stack alignItems="center" my={4}>
              <TablePagination
                onChange={handleChangePage}
                count={Math.ceil(wishlist.length / rowsPerPage)}
              />
            </Stack>
          )}
        </CustomerDashboardLayout>
      </Grid>
    </Suspense>
  );
};

export default Wishlist;
