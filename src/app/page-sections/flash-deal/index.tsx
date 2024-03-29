"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import Light from "@/components/icons/Light";
import useWindowSize from "@/hooks/useWindowSize";
import Carousel from "@/components/carousel/Carousel";
import ProductCard from "@/components/products/Card";
import CategorySectionCreator from "@/components/CategorySectionCreator";
import { IProducts } from "@/models/Product";
import { Ilang } from "@/app/models/Lang";

// =============================================================

const FlashDeal = ({
  products,
  dictionary,
}: {
  products: IProducts[];
  dictionary: Ilang;
}) => {
  const productsList = useMemo(() => {
    return products?.filter((item) => item.type === "flash-deals").slice(0, 8);
  }, [products]);

  const [visibleSlides, setVisibleSlides] = useState(4);
  const width = useWindowSize();
  useEffect(() => {
    if (width < 500) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);

  return (
    <CategorySectionCreator
      icon={<Light color="primary" />}
      title={dictionary.HOME.flashDeals}
      seeMoreLink={`/sale-page?${new URLSearchParams({
        type: "flash-deals",
      })}`}
      length={productsList.length}
    >
      <Carousel visibleSlides={visibleSlides} spaceBetween={16}>
        {productsList?.map((product) => (
          <Box py={0.5} key={product.id}>
            <ProductCard
              id={product.id}
              slug={product.slug}
              title={product.title}
              price={product.price}
              thumbnail={product.thumbnail || ""}
              discount={product.discount || 0}
              images={product.images}
              stock={product.stock}
              shop={product.shop}
            />
          </Box>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
};
export default React.memo(FlashDeal);
