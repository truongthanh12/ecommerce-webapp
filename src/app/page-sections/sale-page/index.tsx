"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Box, Chip, Container, Grid, styled } from "@mui/material";
import SEO from "@/components/SEO";
import SaleNavbar from "@/components/navbar/SaleNavbar";
import ProductCard from "@/components/products/Card";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import { H1, H5 } from "@/components/Typography";
import useScroller from "@/hooks/useScroller";
import { IProducts } from "@/app/models/Product";
import { useSelector } from "react-redux";
import { CategoryIcon } from "@/common";
import { useRouter } from "next/navigation";
import { objectToQueryString, removeAccents } from "@/app/utils/lib";
import debounce from "lodash/debounce";
import { RootState } from "@/redux/store";

//  custom styled components
const StyledChip = styled(Chip)(
  ({ selected, theme }: { selected: boolean | number; theme?: any }) => ({
    top: "1rem",
    right: "1rem",
    fontWeight: 600,
    fontSize: "10px",
    padding: "5px 10px",
    position: "absolute",
    color: selected ? "white" : "inherit",
    boxShadow: selected
      ? "0px 8px 20px -5px rgba(255, 103, 128, 0.9)"
      : "inherit",
    backgroundColor: selected
      ? theme.palette.primary.main
      : theme.palette.grey[300],
  })
);
const CategoryWrapper = styled(Box)(
  ({ show, theme }: { show: boolean | number; theme?: any }) => ({
    left: 0,
    zIndex: 99,
    width: "100%",
    position: "fixed",
    top: show ? 0 : -90,
    boxShadow: theme.shadows[2],
    transition: "top 0.3s ease-in-out",
  })
);
const CategoryBoxWrapper = styled(FlexRowCenter)(
  ({ selected, theme }: { selected: boolean | number; theme?: any }) => ({
    flex: "1 1 0",
    height: "175px",
    margin: "0.75rem",
    minWidth: "250px",
    cursor: "pointer",
    borderRadius: "8px",
    position: "relative",
    flexDirection: "column",
    transition: "all 250ms ease-in-out",
    border: `1px solid ${theme.palette.grey[400]}`,
    background: selected ? "white" : "transparent",
    padding: "8px 20px",
    textAlign: "center",
  })
);

interface PageProps {
  searchParams: { [key: string]: string | undefined };
}
export default function SalePage({ searchParams }: PageProps) {
  const { type } = searchParams;

  const categoryRef = useRef(null);
  const router = useRouter();
  const { isFixedHeader } = useScroller(categoryRef);
  const { products } = useSelector((state: RootState) => state.products);
  const { parentCategories } = useSelector((state: RootState) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState(
    parentCategories?.[0]?.title
  );

  const [searchItems, setSearchItems] = useState(products);

  // HANDLE THE CHANGE CATEGORY
  const handleCategoryChange = (cate: string) => () => {
    setSelectedCategory(cate);
    // let updatedQuery = { ...searchParams, category: removeAccents(cate) || "" };
    // if (category) {
    //   router.push(`/sale-page/?${objectToQueryString(updatedQuery)}`);
    // }
  };

  useEffect(() => {
    const debounceFunctioned = debounce(() => {
      setSearchItems(
        products.filter((product: IProducts) => product.type === type)
      );
    }, 400);

    debounceFunctioned();
  }, [type, products]);

  return (
    <Fragment>
      <SEO title="Sale page" />

      <Container
        sx={{
          mt: "2rem",
        }}
      >
        {/* CATEGORY HEADER NAV */}
        <CategoryWrapper show={isFixedHeader ? 1 : 0}>
          <SaleNavbar
            categories={parentCategories}
            selected={selectedCategory}
            onChangeCategory={handleCategoryChange}
          />
        </CategoryWrapper>

        {/* TITLE */}
        <FlexBox mb={4} flexWrap="wrap">
          <H1 color="primary.main" mr={1} lineHeight="1">
            Flash Deals,
          </H1>

          <H1 color="grey.600" lineHeight="1">
            Enjoy Upto 80% discounts
          </H1>
        </FlexBox>

        {/* SELECTED CATEGORY LIST */}
        <Box mb={4} overflow="hidden" ref={categoryRef}>
          <FlexBox m={-1.5} flexWrap="wrap">
            {parentCategories.map((item: any) => {
              const selectedItem = item.title === selectedCategory ? 1 : 0;
              return (
                <CategoryBoxWrapper
                  key={item.title}
                  selected={selectedItem}
                  onClick={handleCategoryChange(item.title)}
                >
                  {item.icon && (
                    <span
                      style={{
                        fontSize: 44,
                        color: selectedItem ? "primary" : "secondary",
                      }}
                    >
                      {CategoryIcon.hasOwnProperty(item.icon)
                        ? CategoryIcon[item.icon]
                        : CategoryIcon["default"]}
                    </span>
                  )}

                  <H5 color={selectedItem ? "primary.main" : "inherit"}>
                    {item.title}
                  </H5>

                  <StyledChip
                    size="small"
                    color="primary"
                    label="Upto 40% off"
                    selected={selectedItem}
                  />
                </CategoryBoxWrapper>
              );
            })}
          </FlexBox>
        </Box>

        {/* PRODUCT LIST AREA */}
        <Grid container spacing={3} minHeight={500}>
          {searchItems.map((item: IProducts) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={item.id}>
              <ProductCard
                id={item.id}
                slug={item.slug}
                title={item.title}
                price={item.price}
                thumbnail={item.thumbnail}
                images={item.images}
                discount={item.discount}
                shop={item.shop}
              />
            </Grid>
          ))}
        </Grid>

        {/* PAGINATION AREA */}
        {/* <FlexBetween flexWrap="wrap" my={8}>
          <Span>{renderProductCount(page, PRODUCT_PER_PAGE, 10)}</Span>
          <Pagination
            page={page}
            color="primary"
            variant="outlined"
            onChange={handlePageChange}
            count={Math.ceil(10 / PRODUCT_PER_PAGE)}
          />
        </FlexBetween> */}
      </Container>
    </Fragment>
  );
}
