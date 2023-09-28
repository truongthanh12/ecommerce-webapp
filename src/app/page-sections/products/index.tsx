"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Container, Grid } from "@mui/material";
import ProductFilterCard from "@/components/products/ProductFilterCard";
import ProductsGrid from "@/app/components/products/ProductsGrid";
import ProductsList from "@/app/components/products/ProductsList";
import ProductNavbar from "./Navbar";
import ShopIntro from "@/app/components/shops/ShopIntro";
import { IShop } from "@/app/models/Shop";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/productSlice";
import { removeAccents } from "@/app/utils/lib";
import { IProducts } from "@/app/models/Product";
import debounce from "lodash/debounce";
import Pagination from "@/app/components/pagination";
import BackdropLoading from "@/components/backdrop";
import CircularWithValueLabel from "@/components/loading/LoadingWithLabel";

interface PageProps {
  type?: "shop" | "product";
  shopData?: Partial<IShop>;
  searchParams: { [key: string]: string | undefined };
  productsByUser?: Partial<IProducts[]>;
}
const ProductsSearch = ({
  type,
  shopData,
  searchParams,
  productsByUser,
}: PageProps) => {
  const [view, setView] = useState("grid");
  const [loadingLayout, setLoadingLayout] = useState(true);
  const { products, totalProducts } = useSelector(
    (state: any) => state.products
  );
  const dispatch: any = useDispatch();
  const [searchItems, setSearchItems] = useState(products);
  const {
    query,
    orderBy,
    minPrice,
    maxPrice,
    brand,
    options,
    ratings,
    color,
    subcategory,
    page,
  } = searchParams || {};
  const timerRef = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setLoadingLayout(false);
    }, 1200);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(
    debounce(() => {
      if (products || productsByUser) {
        let filtered = productsByUser || products;
        if (query) {
          const normalizedQuery = removeAccents(query).toLowerCase();
          filtered = products.filter((item: IProducts) =>
            removeAccents(item.title).toLowerCase().includes(normalizedQuery)
          );
        }

        // Apply brand filtering if brand is provided
        if (brand && brand.length > 0) {
          filtered = filtered.filter((item: Partial<IProducts>) =>
            brand.includes(item.brands || "")
          );
        }

        if (subcategory && subcategory.length > 0) {
          filtered = filtered.filter((item: Partial<IProducts>) =>
            subcategory.includes(
              removeAccents(item.categories?.toLowerCase() || "")
            )
          );
        }

        if (color && color.length > 0) {
          filtered = filtered.filter((item: Partial<IProducts>) =>
            item.colors?.includes(color)
          );
        }

        if (minPrice && maxPrice) {
          filtered = filtered.filter(
            (item: Partial<IProducts>) =>
              (item.price || 0) >= Number(minPrice) &&
              (item.price || 0) <= Number(maxPrice)
          );
        }

        if (options && options.length > 0) {
          if (options.includes("Sale")) {
            filtered = filtered.filter(
              (item: Partial<IProducts>) => item.discount
            );
          }
          if (options.includes("Stock")) {
            filtered = filtered.filter(
              (item: Partial<IProducts>) => Number(item.stock) > 0
            );
          }
        }

        // if (ratings && ratings.length > 0) {
        //   filtered = filtered.filter((item: Partial<IProducts>) => {
        //     const itemRating =
        //       typeof item.rating === "string"
        //         ? parseFloat(item.rating)
        //         : item.rating;
        //     return ratings.includes(itemRating || 0);
        //   });
        // }

        let sortedProducts = [...filtered];

        if (orderBy === "Price High to Low") {
          sortedProducts.sort((a, b) => b.price - a.price);
        } else if (orderBy === "Price Low to High") {
          sortedProducts.sort((a, b) => a.price - b.price);
        }
        setSearchItems(sortedProducts);
      }
    }, 400),
    [
      products,
      query,
      orderBy,
      minPrice,
      maxPrice,
      brand,
      options,
      color,
      subcategory,
    ]
  );

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

  useEffect(() => {
    if (!productsByUser) {
      dispatch(fetchProducts(true, "", Number(page)));
    }
  }, [dispatch, productsByUser, page]);

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
        <ProductNavbar
          productsLength={searchItems?.length}
          searchParams={searchParams}
          view={view}
          setView={setView}
        />
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
          <ProductFilterCard searchParams={searchParams} />
        </Grid>

        {/* PRODUCT VIEW AREA */}
        <Suspense fallback={<BackdropLoading />}>
          <Grid item md={9} xs={12}>
            {loadingLayout ? (
              <CircularWithValueLabel />
            ) : view === "grid" ? (
              <ProductsGrid products={searchItems} />
            ) : (
              <ProductsList products={searchItems} />
            )}
          </Grid>
        </Suspense>
      </Grid>
      <Pagination
        products={products}
        totalProducts={totalProducts}
        startProductNumber={1}
        searchParams={searchParams}
      />
    </Container>
  );
};
export default React.memo(ProductsSearch);
