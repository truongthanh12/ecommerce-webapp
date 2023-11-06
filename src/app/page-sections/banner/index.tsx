import Link from "next/link";
import { Container, Grid } from "@mui/material";
import LazyImage from "@/components/LazyImage";
import React from "react";
import { useParams } from "next/navigation";

const BannerAds = () => {
  const params = useParams();
  return (
    <Container
      sx={{
        mb: "70px",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Link href={`/${params.lang}`} passHref>
            <LazyImage
              width={385}
              height={342}
              alt="banner ads"
              sizes="100%"
              layout="responsive"
              objectFit="contain"
              src="/assets/images/banners/banner-1.png"
            />
          </Link>
        </Grid>

        <Grid item xs={12} md={8}>
          <Link href={`/${params.lang}`} passHref>
            <LazyImage
              width={790}
              height={342}
              sizes="100%"
              alt="banner ads"
              layout="responsive"
              objectFit="contain"
              src="/assets/images/banners/banner-2.png"
            />
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};
export default React.memo(BannerAds);
