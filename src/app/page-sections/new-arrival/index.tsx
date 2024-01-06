import { Grid } from "@mui/material";
import Card from "@/components/Card";
import NewArrival from "@/components/icons/NewArrival";
import CategorySectionCreator from "@/components/CategorySectionCreator";
import { IProducts } from "@/models/Product";
import ProductCard from "@/components/products/Card";
import React, { useMemo } from "react";
import Link from "next/link";
import { formatToSlug } from "@/utils/lib";
import { useParams } from "next/navigation";
import { Ilang } from "@/app/models/Lang";
// =======================================================
type TypeProps = {
  products: IProducts[];
  dictionary: Ilang;
};
const NewArrivals: React.FC<TypeProps> = ({ products, dictionary }) => {
  const params = useParams();
  const newArrivalsList = useMemo(() => {
    return products.filter((item) => item.type === "new-arrivals");
  }, [products]);

  return (
    <CategorySectionCreator
      icon={<NewArrival />}
      title={dictionary.HOME.newArrival}
      seeMoreLink={`/sale-page?${new URLSearchParams({
        type: "new-arrivals",
      })}`}
      length={newArrivalsList.length}
    >
      <Card
        sx={{
          p: 2,
        }}
      >
        <Grid container spacing={3}>
          {newArrivalsList.map(
            ({ id, title, price, thumbnail, slug, stock, discount, shop }) => (
              <Grid item lg={2} md={3} sm={4} xs={6} key={id}>
                <Link href={`/product/${formatToSlug(slug)}`}>
                  <ProductCard
                    isBasicCard
                    thumbnail={thumbnail}
                    title={title}
                    price={price}
                    stock={stock}
                    discount={discount}
                    shop={shop}
                  />
                </Link>
              </Grid>
            )
          )}
        </Grid>
      </Card>
    </CategorySectionCreator>
  );
};
export default React.memo(NewArrivals);
