import { Grid } from "@mui/material";
import Card from "@/components/Card";
import NewArrival from "@/components/icons/NewArrival";
import CategorySectionCreator from "@/components/CategorySectionCreator";
import { IProducts } from "@/app/models/Product";
import ProductCard from "@/components/products/Card";
import React, { useMemo } from "react";
import Link from "next/link";
// =======================================================
type TypeProps = {
  products: IProducts[];
};
const NewArrivals: React.FC<TypeProps> = ({ products }) => {
  const newArrivalsList = useMemo(() => {
    return products.filter((item) => item.type === "new-arrivals");
  }, [products]);

  return (
    <CategorySectionCreator
      icon={<NewArrival />}
      title="New Arrivals"
      seeMoreLink="#"
    >
      <Card
        sx={{
          p: 2,
        }}
      >
        <Grid container spacing={3}>
          {newArrivalsList.map(({ id, title, price, thumbnail, slug }) => (
            <Grid item lg={2} md={3} sm={4} xs={6} key={id}>
              <Link href={`/product/${slug}`}>
                <ProductCard
                  isBasicCard
                  thumbnail={thumbnail}
                  title={title}
                  price={price}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Card>
    </CategorySectionCreator>
  );
};
export default React.memo(NewArrivals);