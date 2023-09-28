"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Box } from "@mui/material";
import Card from "@/components/Card";
import ProductCard from "@/components/products/Card";
import GiftBox from "@/components/icons/GiftBox";
import useWindowSize from "@/hooks/useWindowSize";
import Carousel from "@/components/carousel/Carousel";
import CategorySectionCreator from "@/components/CategorySectionCreator";
import { IProducts } from "@/app/models/Product";
import { formatToSlug } from "@/app/utils/lib";

// ========================================================
type TypeProps = {
  products: IProducts[];
};
const Discount: React.FC<TypeProps> = ({ products }) => {
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(6);
  useEffect(() => {
    if (width < 370) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(4);
    else setVisibleSlides(6);
  }, [width]);

  const bigDiscountList = useMemo(() => {
    return products.filter((item) => item.type === "big-discount");
  }, [products]);

  return (
    <CategorySectionCreator
      icon={<GiftBox />}
      title="Big Discounts"
      seeMoreLink={`/sale-page?${new URLSearchParams({
        type: "big-discount",
      })}`}
    >
      <Box my="-0.25rem">
        <Carousel visibleSlides={visibleSlides}>
          {bigDiscountList.map(
            ({ id, title, thumbnail, price, discount, slug, stock, shop, images }) => (
              <Box py={0.5} key={id}>
                <Card
                  sx={{
                    p: "1rem",
                  }}
                >
                  <Link href={`/product/${formatToSlug(slug)}`} passHref>
                    <ProductCard
                      isBasicCard
                      title={title}
                      thumbnail={thumbnail}
                      images={images}
                      price={price}
                      discount={discount}
                      stock={stock}
                      shop={shop}
                    />
                  </Link>
                </Card>
              </Box>
            )
          )}
        </Carousel>
      </Box>
    </CategorySectionCreator>
  );
};
export default React.memo(Discount);
