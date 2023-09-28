import React, { Fragment } from "react";
import { Grid } from "@mui/material";
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
          products.map((item, ind:number) => (
            <Grid item lg={4} sm={6} xs={12} key={item.id + ind}>
              <ProductCard
                id={item.id}
                slug={item.slug}
                title={item.title}
                price={item.price}
                thumbnail={item.thumbnail}
                images={item.images}
                discount={item.discount}
                stock={item.stock}
                shop={item.shop}
              />
            </Grid>
          ))
        ) : (
          <NotFound />
        )}
      </Grid>
    </Fragment>
  );
};
export default React.memo(ProductsGrid);
