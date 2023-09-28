import { Container, Grid } from "@mui/material";
import ProductCard from "@/components/products/Card";
import CategorySectionHeader from "@/components/CategorySectionHeader";
import React, { useMemo } from "react";
import { IProducts } from "@/app/models/Product";
// ====================================================
type TypeProps = {
  products: IProducts[];
};
const MoreProducts: React.FC<TypeProps> = ({ products }) => {
  const moreItems = useMemo(() => {
    return products.filter((item) => item.type === "more-products");
  }, [products]);

  return (
    <Container
      sx={{
        mb: "70px",
      }}
    >
      <CategorySectionHeader title="More For You" seeMoreLink="#" />

      <Grid container spacing={3}>
        {moreItems.slice(0, 12).map((item) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={item.id}>
            <ProductCard
              hoverEffect
              id={item.id}
              slug={item.slug}
              title={item.title}
              price={item.price}
              thumbnail={item.thumbnail}
              discount={item.discount}
              images={item.images}
              stock={item.stock}
              shop={item.shop}
              />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default React.memo(MoreProducts);
