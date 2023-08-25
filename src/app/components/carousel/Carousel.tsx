import React, { Children } from "react";
import { StyledSlider, StyledCarouselProvider } from "./styles";
import { Navigation, Pagination, A11y } from "swiper/modules";

// ===================================================================
interface TypeCarouselProps {
  sx?: any;
  step?: number;
  spacing?: string;
  children?: React.ReactNode;
  isDots?: boolean;
  isArrow?: boolean;
  infinite?: boolean;
  visibleSlides?: number;
  spaceBetween?: number;
}
const CarouselSlider = ({
  sx = {},
  children,
  infinite,
  visibleSlides = 1,
  isArrow = true,
  isDots,
  spaceBetween,
}: TypeCarouselProps) => {
  return (
    <StyledCarouselProvider
      sx={sx}
      modules={[Navigation, Pagination, A11y]}
      navigation={isArrow}
      pagination={isDots ? { clickable: true } : false}
      slidesPerView={visibleSlides}
      loop={infinite}
      spaceBetween={spaceBetween}
    >
      {Children.map(children, (child, ind) => (
        <StyledSlider>
          <div key={ind}>{child}</div>
        </StyledSlider>
      ))}
    </StyledCarouselProvider>
  );
};

export default React.memo(CarouselSlider);
