"use client";
import { Container, Grid, Pagination } from "@mui/material";
import { H2, Span } from "@/components/Typography";
import ShopCard from "@/components/shops/Card";
import { FlexBetween } from "@/components/flex-box";
import shops from "../../data/shops";
import { useSelector } from "react-redux";
// =============================================

export default function ShopList() {
  const { users } = useSelector((state: any) => state.auth);

  return (
    <Container
      sx={{
        mt: 4,
        mb: 6,
      }}
    >
      <H2 mb={3}>All Shops</H2>

      {/* ALL SHOP LIST AREA */}
      <Grid container spacing={3}>
        {users.map((item: any) => (
          <Grid item lg={4} sm={6} xs={12} key={item.docId}>
            <ShopCard
              name={item.displayName || ""}
              id={item.docId || ""}
              phone={item.phoneNumber || ""}
              address={item.address || ""}
              rating={item.rating || 5}
              coverPicture={item.pictureCover || ""}
              profilePicture={item.photoURL || ""}
            />
          </Grid>
        ))}
      </Grid>

      {/* PAGINTAION AREA */}
      {users.length > 9 && (
        <FlexBetween flexWrap="wrap" mt={4}>
          <Span color="grey.600">Showing 1-9 of {users.length} Shops</Span>
          <Pagination count={shops.length} variant="outlined" color="primary" />
        </FlexBetween>
      )}
    </Container>
  );
}
