import ProductCard from "@/components/products/Card";
import { IProducts } from "@/models/Product";
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
        products.map((item, ind: number) => (
          <ProductCard
            isInShop
            id={item.id}
            key={item.id + ind}
            slug={item.slug}
            title={item.title}
            price={item.price}
            discount={item.discount}
                images={item.images}
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
