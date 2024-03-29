"use client";
import Link from "next/link";
import { Box, Container, Grid, Skeleton } from "@mui/material";
import RankBadge from "@/components/icons/RankBadge";
import DottedStar from "@/components/icons/DottedStar";
import CategorySectionHeader from "@/components/CategorySectionHeader";
import ProductCard from "@/components/products/Card";
import React, { useEffect, useMemo, useState } from "react";
import { IProducts } from "@/models/Product";
import Card from "@/components/Card";
import { IBrand } from "@/models/Brand";
import { calculateAverageRating, formatToSlug } from "@/utils/lib";
import { getProductsWithComments } from "@/redux/features/productSlice";
import isEmpty from "lodash/isEmpty";
import { useParams } from "next/navigation";
import { Ilang } from "@/app/models/Lang";
// ==========================================================
type TypeProps = {
  products: IProducts[];
  brands: IBrand[];
  dictionary: Ilang;
};
const Featured: React.FC<TypeProps> = ({ brands, dictionary }) => {
  const [products, setProducts] = useState<IProducts[]>([]);
  const params = useParams();

  const featuredBrand = useMemo(() => {
    return brands.filter((item) => item.image);
  }, [brands]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsWithComments: any = await getProductsWithComments();
        const productsWithAvgRatings = productsWithComments.map(
          (product: any) => {
            const avgRating = calculateAverageRating(product.comments);
            return { ...product, avgRating };
          }
        );

        const sortedProducts = productsWithAvgRatings.sort(
          (a: any, b: any) => b.avgRating - a.avgRating
        );

        // Get the top 4 products
        const topRatedProducts = sortedProducts.slice(0, 4);
        setProducts(topRatedProducts);
      } catch (error) {
        throw error;
      }
    }

    fetchProducts();
  }, []);

  return (
    <Box mb={7.5}>
      <Container>
        <Grid container spacing={4}>
          {/* TOP RATINGS AREA */}
          <Grid item lg={6} xs={12}>
            <CategorySectionHeader
              icon={<RankBadge />}
              title={dictionary.HOME.topRating}
              seeMoreLink={
                products?.length > 4
                  ? `/sale-page?${new URLSearchParams({
                      type: "top-ratings",
                    })}`
                  : ""
              }
            />

            <Card
              sx={{
                p: 2,
              }}
            >
              <Grid container spacing={4}>
                {!isEmpty(products) ? (
                  products.map((item: IProducts) => (
                    <Grid item md={3} sm={6} xs={6} key={item.id}>
                      <Link
                        href={`/${params.lang}/${params.lang}/product/${formatToSlug(
                          item.slug
                        )}`}
                        passHref
                      >
                        <ProductCard
                          isBasicCard
                          isTopCategory
                          id={item.id}
                          title={item.title}
                          price={item.price}
                          thumbnail={item.thumbnail}
                          images={item.images}
                          reviewCount={0 || item?.comments?.length}
                          stock={item.stock}
                          shop={item.shop}
                        />
                      </Link>
                    </Grid>
                  ))
                ) : (
                  <>
                    <Grid item sm={6} xs={6}>
                      <Skeleton
                        variant="rectangular"
                        width={210}
                        height={118}
                      />
                      <Skeleton sx={{ marginTop: 2 }} width="78%" />
                      <Skeleton width="60%" />
                    </Grid>
                    <Grid item sm={6} xs={6}>
                      <Skeleton
                        variant="rectangular"
                        width={210}
                        height={118}
                      />
                      <Skeleton sx={{ marginTop: 2 }} width="78%" />
                      <Skeleton width="60%" />
                    </Grid>
                  </>
                )}
              </Grid>
            </Card>
          </Grid>

          {/* FEATURED BRANDS AREA */}
          <Grid item md={6} xs={12}>
            <CategorySectionHeader
              icon={<DottedStar />}
              title={dictionary.HOME.featureBrand}
              seeMoreLink={
                brands?.length > 4
                  ? `/sale-page?${new URLSearchParams({
                      type: "featured-brands",
                    })}`
                  : ""
              }
            />

            <Card
              sx={{
                p: 2,
              }}
            >
              <Grid container spacing={4}>
                {featuredBrand.slice(0, 2).map(({ id, name, image }) => (
                  <Grid item sm={6} xs={12} key={id}>
                    <Link
                      href={`/${params.lang}/product/search/products?brand=${name}`}
                      passHref
                    >
                      <ProductCard isFeatured title={name} thumbnail={image} />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default React.memo(Featured);
