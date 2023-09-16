import { Pagination } from "@mui/material";
import { FlexBetween } from "@/components/flex-box";
import ProductCard from "@/components/products/Card";
import { Span } from "../Typography";
import { IProducts } from "@/app/models/Product";
import React from "react";
import isEmpty from "lodash/isEmpty";
import NotFound from "../not-found";
// ==========================================================

type TypeProps = {
  products: IProducts[];
};
const ProductsList: React.FC<TypeProps> = ({ products }) => {
  return (
    <div>
      {!isEmpty(products) ? (
        products.map((item) => (
          <ProductCard
            isInShop
            id={item.id}
            key={item.id}
            slug={item.slug}
            title={item.title}
            price={item.price}
            discount={item.discount}
            rating={item.rating}
            thumbnail={item.thumbnail}
            stock={item.stock}
          />
        ))
      ) : (
        <NotFound />
      )}

      {products.length > 9 && (
        <FlexBetween flexWrap="wrap" mt={4}>
          <Span color="grey.600">Showing 1-9 of 1.3k Products</Span>
          <Pagination count={10} variant="outlined" color="primary" />
        </FlexBetween>
      )}
    </div>
  );
};
export default React.memo(ProductsList);
