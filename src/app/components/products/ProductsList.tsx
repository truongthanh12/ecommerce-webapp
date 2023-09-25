import ProductCard from "@/components/products/Card";
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
            shop={item.shop}
          />
        ))
      ) : (
        <NotFound />
      )}
    </div>
  );
};
export default React.memo(ProductsList);
