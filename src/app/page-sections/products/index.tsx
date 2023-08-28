"use client";
import React, { useCallback, useState } from "react";
import { Container, Grid } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductFilterCard from "@/components/products/ProductFilterCard";
import productDatabase from "@/data/product-database";
import ProductsGrid from "@/app/components/products/ProductsGrid";
import ProductsList from "@/app/components/products/ProductsList";
import ProductNavbar from "./Navbar";
import ShopIntro from "@/app/components/shops/ShopIntro";
import shops from "@/app/data/shops";

interface PageProps {
  params: { slug: string };
  type?: "shop" | "product";
}
const ProductsSearch = ({ params, type }: PageProps) => {
  const [view, setView] = useState("grid");
  const shopData = shops[0];
  const { name, address, phone, coverPicture, profilePicture } = shopData || {};
  return (
    <Container
      sx={{
        mt: 4,
        mb: 6,
      }}
    >
      {/* TOP BAR AREA */}
      {type === "shop" ? (
        <ShopIntro
          name={name || ""}
          address={address || ""}
          phone={phone || ""}
          coverPicture={coverPicture || ""}
          profilePicture={profilePicture || ""}
        />
      ) : (
        <ProductNavbar view={view} setView={setView} params={params} />
      )}

      <Grid container spacing={3}>
        {/* PRODUCT FILTER SIDEBAR AREA */}
        <Grid
          item
          md={3}
          sx={{
            display: {
              md: "block",
              xs: "none",
            },
          }}
        >
          <ProductFilterCard />
        </Grid>

        {/* PRODUCT VIEW AREA */}
        <Grid item md={9} xs={12}>
          {view === "grid" ? (
            <ProductsGrid products={productDatabase.slice(95, 104)} />
          ) : (
            <ProductsList products={productDatabase.slice(95, 104)} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
export default React.memo(ProductsSearch);
