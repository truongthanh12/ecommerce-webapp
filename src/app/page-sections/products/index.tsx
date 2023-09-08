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
import { IShop } from "@/app/models/Shop";
import { useSelector } from "react-redux";

interface PageProps {
  type?: "shop" | "product";
  shopData?: Partial<IShop>;
}
const ProductsSearch = ({ type, shopData }: PageProps) => {
  const [view, setView] = useState("grid");
  const { products } = useSelector((state: any) => state.products);
  const {
    displayName,
    address,
    phoneNumber,
    pictureCover,
    photoURL,
    facebook,
    youtube,
    email,
    description,
  } = shopData || {};

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
          facebook={facebook || ""}
          youtube={youtube || ""}
          email={email || ""}
          name={displayName || ""}
          description={description || ""}
          address={address || ""}
          phone={phoneNumber || ""}
          coverPicture={pictureCover || ""}
          profilePicture={photoURL || ""}
        />
      ) : (
        <ProductNavbar view={view} setView={setView} />
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
            <ProductsGrid products={products} />
          ) : (
            <ProductsList products={products} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
export default React.memo(ProductsSearch);
