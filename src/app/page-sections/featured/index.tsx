import Link from "next/link";
import { Box, Container, Grid } from "@mui/material";
import RankBadge from "@/components/icons/RankBadge";
import DottedStar from "@/components/icons/DottedStar";
import CategorySectionHeader from "@/components/CategorySectionHeader";
import ProductCard from "@/app/components/products/Card";
import React, { useMemo } from "react";
import { IProducts } from "@/app/models/Product";
import Card from "@/app/components/Card";
import { IBrand } from "@/app/models/Brand";
import { formatToSlug } from "@/app/utils/lib";
// ==========================================================
type TypeProps = {
  products: IProducts[];
  brands: IBrand[];
};
const Featured: React.FC<TypeProps> = ({ products, brands }) => {
  const topRatedBrands = useMemo(() => {
    return brands?.filter((item) => item.type === "featured-brands");
  }, [brands]);
  const topRatedList = useMemo(() => {
    return products?.filter((item) => item.type === "top-ratings");
  }, [products]);

  return (
    <Box mb={7.5}>
      <Container>
        <Grid container spacing={4}>
          {/* TOP RATINGS AREA */}
          <Grid item lg={6} xs={12}>
            <CategorySectionHeader
              icon={<RankBadge />}
              title="Top Ratings"
              seeMoreLink="#"
            />

            <Card
              sx={{
                p: 2,
              }}
            >
              <Grid container spacing={4}>
                {topRatedList.map((item) => (
                  <Grid item md={3} sm={6} xs={6} key={item.title}>
                    <Link href={`/product/${formatToSlug(item.slug)}`} passHref>
                      <ProductCard
                        isBasicCard
                        isTopCategory
                        title={item.title}
                        price={item.price}
                        rating={item.rating}
                        thumbnail={item.thumbnail}
                        reviewCount={0 || item?.reviews?.length}
                        stock={item.stock}
                      />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* FEATURED BRANDS AREA */}
          <Grid item md={6} xs={12}>
            <CategorySectionHeader
              icon={<DottedStar />}
              title="Featured Brands"
              seeMoreLink="#"
            />

            <Card
              sx={{
                p: 2,
              }}
            >
              <Grid container spacing={4}>
                {topRatedBrands.map(({ id, name, image, slug }) => (
                  <Grid item sm={6} xs={12} key={id}>
                    <Link
                      href={`/product/search/${formatToSlug(slug)}`}
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
