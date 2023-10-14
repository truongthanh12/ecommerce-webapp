"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import useWindowSize from "@/hooks/useWindowSize";
import CategoryIcon from "@/components/icons/Category";
import Carousel from "@/components/carousel/Carousel";
import ProductCard from "@/components/products/Card";
import CategorySectionCreator from "@/components/CategorySectionCreator";
import { ICategory } from "@/models/Category";
import { formatToSlug } from "@/utils/lib";
import { useParams } from "next/navigation";

type TypeCategory = { categories: ICategory[] };
const TopCategories: React.FC<TypeCategory> = ({ categories }) => {
  const params = useParams();
  const [visibleSlides, setVisibleSlides] = useState(3);

  const categoriesData = useMemo(
    () => categories.filter((cate) => cate.image),
    [categories]
  );

  const width = useWindowSize();
  useEffect(() => {
    if (width < 650) setVisibleSlides(1);
    else if (width < 950) setVisibleSlides(2);
    else setVisibleSlides(3);
  }, [width]);

  return (
    <CategorySectionCreator
      seeMoreLink={`/sale-page?${new URLSearchParams({
        type: "top-categories",
      })}`}
      title="Top Categories"
      length={categoriesData.length}
      icon={<CategoryIcon color="primary" />}
    >
      <Carousel visibleSlides={visibleSlides}>
        {categoriesData.map((item) => (
          <Link
            href={`/${
              params.lang
            }/product/search/cate?subcategory=${formatToSlug(item.slug)}`}
            key={item.id}
            passHref
          >
            <Card
              sx={{
                p: 2,
              }}
              elevation={0}
            >
              <ProductCard
                isCategoryCard
                title={item.name || ""}
                subtitle={item.description || ""}
                thumbnail={item.image || ""}
                stock={item.stock || ""}
              />
            </Card>
          </Link>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
};

export default React.memo(TopCategories);
