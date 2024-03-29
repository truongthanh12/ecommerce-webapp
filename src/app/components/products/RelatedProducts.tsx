import { Box, Grid } from "@mui/material";
import ProductCard from "@/components/products/Card";
import { H3 } from "@/components/Typography";
import { IProducts } from "@/models/Product";
import React from "react";
// ===================================================
type TypeProps = {
  products: IProducts[];
};
const RelatedProducts: React.FC<TypeProps> = ({ products }) => {
  return (
    <Box mb={7.5}>
      <H3 mb={3}>Realted Products</H3>
      <Grid container spacing={8}>
        {products.map((item, ind) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={item.id + ind}>
            <ProductCard
              id={item.id}
              slug={item.slug}
              title={item.title}
              price={item.price}
              images={item.images}
              thumbnail={item.thumbnail}
              discount={item.discount}
              stock={item.stock}
              shop={item.shop}
              hoverEffect
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default React.memo(RelatedProducts);
