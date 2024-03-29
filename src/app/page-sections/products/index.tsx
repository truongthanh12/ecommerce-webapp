"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Container, Grid, Stack } from "@mui/material";
import ProductFilterCard from "@/components/products/ProductFilterCard";
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductsList from "@/components/products/ProductsList";
import ProductNavbar from "./Navbar";
import ShopIntro from "@/components/shops/ShopIntro";
import { IShop } from "@/models/Shop";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/productSlice";
import { removeAccents } from "@/utils/lib";
import { IProducts } from "@/models/Product";
import debounce from "lodash/debounce";
import BackdropLoading from "@/components/backdrop";
import CircularWithValueLabel from "@/components/loading/LoadingWithLabel";
import { RootState } from "@/redux/store";
import TablePagination from "@/app/components/data-table/TablePagination";
import useMuiTable from "@/app/hooks/useMuiTable";

interface PageProps {
  type?: "shop" | "product";
  shopData?: Partial<IShop>;
  productsByUser?: Partial<IProducts[]>;
  searchParams: { [key: string]: string | undefined };
}

const ProductsSearch = ({
  type,
  shopData,
  productsByUser,
  searchParams,
}: PageProps) => {
  const { products } = useSelector((state: RootState) => state.products);
  const [view, setView] = useState("grid");
  const [loadingLayout, setLoadingLayout] = useState(true);
  const dispatch: any = useDispatch();
  const [searchItems, setSearchItems] = useState(products);
  const {
    query,
    orderBy,
    minPrice,
    maxPrice,
    brand,
    options,
    color,
    subcategory,
    tag,
  } = searchParams || {};

  const timerRef = useRef<NodeJS.Timeout | undefined>();

  const { rowsPerPage, handleChangePage, filteredList } = useMuiTable({
    listData: searchItems,
    isScrollFunction: true,
  });

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setLoadingLayout(false);
    }, 1200);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ isFetchByUser: true }));
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

        if (tag) {
          filtered = filtered.filter((item: Partial<IProducts>) => {
            const productTags =
              item.tags?.map((tag) => tag.toLowerCase()) || [];
            return productTags.includes(tag.toLowerCase());
          });
        }

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
      productsByUser,
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
    uid
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
          name={displayName || "Name not updated"}
          description={description || "Description not updated"}
          address={address || "Address not updated"}
          phone={phoneNumber || "Phone not updated"}
          coverPicture={pictureCover || ""}
          profilePicture={photoURL || ""}
          uid={uid || ""}
        />
      ) : (
        <ProductNavbar
          productsLength={searchItems?.length}
          view={view}
          setView={setView}
          searchParams={searchParams}
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
              <ProductsGrid products={filteredList} />
            ) : (
              <ProductsList products={filteredList} />
            )}
          </Grid>
        </Suspense>
      </Grid>

      {Math.ceil(searchItems.length / rowsPerPage) > 1 && (
        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(searchItems.length / rowsPerPage)}
          />
        </Stack>
      )}
    </Container>
  );
};
export default React.memo(ProductsSearch);
