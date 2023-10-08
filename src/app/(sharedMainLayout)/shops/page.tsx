"use client";
import { Container, Grid, Stack } from "@mui/material";
import { H2 } from "@/components/Typography";
import ShopCard from "@/components/shops/Card";
import { useSelector } from "react-redux";
import { ADMIN_ID } from "@/app/constant";
import BackdropLoading from "@/components/backdrop";
import { Suspense, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUsers } from "@/redux/features/authSlice";
import { RootState } from "@/redux/store";
import useMuiTable from "@/app/hooks/useMuiTable";
import TablePagination from "@/app/components/data-table/TablePagination";
import NotFound from "@/app/components/not-found";
// =============================================

export default function ShopList() {
  const { users, user } = useSelector((state: RootState) => state.auth);
  const dispatch: any = useAppDispatch();
  const { rowsPerPage, handleChangePage, filteredList } = useMuiTable({
    listData: users,
    rowsPerPage: 6,
  });
  console.log(filteredList);

  useEffect(() => {
    dispatch(fetchUsers({ isVendor: true }));
  }, [dispatch]);

  return (
    <Suspense fallback={<BackdropLoading />}>
      <Container
        sx={{
          mt: 4,
          mb: 6,
        }}
      >
        <H2 mb={3}>All Shops</H2>

        {/* ALL SHOP LIST AREA */}
        <Grid container spacing={3}>
          {users.length ? (
            filteredList.map((item: any) => {
              if (item.docId !== ADMIN_ID)
                return (
                  <Grid item lg={4} sm={6} xs={12} key={item.docId}>
                    <ShopCard
                      name={item.displayName || "Name not updated"}
                      id={item.docId || ""}
                      phone={item.phoneNumber || "Phone not updated"}
                      address={item.address || "Address not updated"}
                      rating={item.rating || 5}
                      coverPicture={item.pictureCover || ""}
                      profilePicture={item.photoURL || ""}
                      user={user}
                    />
                  </Grid>
                );
            })
          ) : (
            <NotFound />
          )}
        </Grid>

        {Math.ceil(users.length / rowsPerPage) > 1 && (
          <Stack alignItems="center" my={4}>
            <TablePagination
              onChange={handleChangePage}
              count={Math.ceil(users.length / rowsPerPage)}
            />
          </Stack>
        )}
      </Container>
    </Suspense>
  );
}
