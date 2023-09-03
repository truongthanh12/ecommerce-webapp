import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import useWindowSize from "@/hooks/useWindowSize";
import CategoryIcon from "@/components/icons/Category";
import Carousel from "@/components/carousel/Carousel";
import ProductCard from "@/components/products/Card";
import CategorySectionCreator from "@/components/CategorySectionCreator";
import { ICategory } from "@/app/models/Category";

type TypeCategory = { categories: ICategory[] };
const TopCategories: React.FC<TypeCategory> = ({ categories }) => {
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [isArrow, setArrow] = useState(false);

  const categoriesData = useMemo(() => {
    return categories.filter((item) => item.type === "top-categories");
  }, [categories]);

  const width = useWindowSize();
  useEffect(() => {
    if (width < 650) setVisibleSlides(1);
    else if (width < 950) setVisibleSlides(2);
    else setVisibleSlides(3);
  }, [width]);

  useEffect(() => {
    if (categoriesData.length > visibleSlides) {
      setArrow(true);
    }
  }, [isArrow]);

  return (
    <CategorySectionCreator
      seeMoreLink="#"
      title="Top Categories"
      icon={<CategoryIcon color="primary" />}
    >
      <Carousel visibleSlides={visibleSlides}>
        {categoriesData.map((item) => (
          <Link href={`/product/search/${item.slug}`} key={item.id} passHref>
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
              />
            </Card>
          </Link>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
};

export default React.memo(TopCategories);
