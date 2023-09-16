import React, { Fragment } from "react";
import { Grid, Pagination } from "@mui/material";
import { FlexBetween } from "@/components/flex-box";
import { Span } from "@/components/Typography";
import { IProducts } from "@/app/models/Product";
import ProductCard from "@/components/products/Card";
import NotFound from "../not-found";
import isEmpty from "lodash/isEmpty";
// ========================================================

type TypeProps = {
  products: IProducts[];
};
const ProductsGrid: React.FC<TypeProps> = ({ products }) => {
  return (
    <Fragment>
      <Grid container spacing={3}>
        {!isEmpty(products) ? (
          products.map((item) => (
            <Grid item lg={4} sm={6} xs={12} key={item.id}>
              <ProductCard
                id={item.id}
                slug={item.slug}
                title={item.title}
                price={item.price}
                rating={item.rating}
                thumbnail={item.thumbnail}
                discount={item.discount}
                stock={item.stock}
              />
            </Grid>
          ))
        ) : (
          <NotFound />
        )}
      </Grid>

      {products.length > 9 && (
        <FlexBetween flexWrap="wrap" mt={4}>
          <Span color="grey.600">Showing 1-9 of 1.3k Products</Span>
          <Pagination count={10} variant="outlined" color="primary" />
        </FlexBetween>
      )}
    </Fragment>
  );
};
export default React.memo(ProductsGrid);
