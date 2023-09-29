"use client";
import { Container, Grid } from "@mui/material";
import { H2 } from "@/components/Typography";
import ShopCard from "@/components/shops/Card";
import { useSelector } from "react-redux";
import { ADMIN_ID } from "@/app/constant";
import BackdropLoading from "@/components/backdrop";
import { Suspense, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUsers } from "@/redux/features/authSlice";
// =============================================

export default function ShopList() {
  const { users, user } = useSelector((state: any) => state.auth);
  const dispatch: any = useAppDispatch()

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
          {users.map((item: any) => {
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
          })}
        </Grid>
      </Container>
    </Suspense>
  );
}
