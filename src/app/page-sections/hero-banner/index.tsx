import Carousel from "@/components/carousel/Carousel";
import CarouselCard from "@/components/carousel/Card";
import { Box, Container } from "@mui/material";
import React from "react";
import { ICarouselCard } from "@/models/Brand";
// ======================================================

interface TypeProps {
  carouselData: ICarouselCard[];
}
const HeroBanner = ({ carouselData }: TypeProps) => {
  return (
    <Box bgcolor="white" mb={7.5}>
      <Container
        sx={{
          py: 4,
        }}
      >
        <Carousel
          spacing="0px"
          isDots
        >
          {carouselData.map((data, ind) => {
            return <CarouselCard {...data} key={ind} />;
          })}
        </Carousel>
      </Container>
    </Box>
  );
};
export default React.memo(HeroBanner);
