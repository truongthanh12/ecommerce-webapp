"use client";
import { styled } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

// StyledCarouselProvider and StyledSlider component props type
interface TypeProps {
  theme?: any;
  showArrowOnHover?: boolean;
  isDots?: boolean;
  dot_margin_top?: string;
  spacing?: any;
  dotColor?: string;
  dot_active?: string;
}
// common styles for arrow back and next button
const commonArrowBtnStyle = ({
  theme,
  isDots,
  dot_margin_top,
  showArrowOnHover,
}: TypeProps) => ({
  width: 40,
  border: 0,
  height: 40,
  borderRadius: "50%",
  alignItems: "center",
  position: "absolute",
  justifyContent: "center",
  transform: "translateY(-50%)",
  display: showArrowOnHover ? "none" : "flex",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
  background: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  top: `calc(50% - ${isDots ? dot_margin_top : "0px"})`,
  "&:disabled": {
    background: theme.palette.text.disabled,
    color: theme.palette.secondary.main,
    cursor: "not-allowed",
  },
  "&:hover:not(:disabled)": {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  // [theme.breakpoints.down("xs")]: {
  //   display: "block !important",
  // },
});

// styled components
const StyledCarouselProvider = styled(Swiper)(
  ({ theme, showArrowOnHover, isDots, dot_margin_top }: TypeProps) => ({
    "& .swiper-button-prev": {
      ...commonArrowBtnStyle({
        theme,
        isDots,
        showArrowOnHover,
        dot_margin_top,
      }),
      "&:after": {
        fontSize: "16px",
      },
    },
    "& .swiper-button-next": {
      ...commonArrowBtnStyle({
        theme,
        isDots,
        showArrowOnHover,
        dot_margin_top,
      }),
      "&:after": {
        fontSize: "16px",
      },
    },
    "& .swiper-pagination-bullet": {
      width: 16,
      height: 16,
      borderRadius: 300,
      margin: "0.25rem",
      cursor: "pointer",
      position: "relative",
      border: `1px solid ${theme.palette.secondary.main}`,
      background: "transparent",
      "&:after": {
        width: 9,
        height: 9,
        top: "50%",
        left: "50%",
        content: '" "',
        borderRadius: 300,
        position: "absolute",
        background: theme.palette.secondary.main,
        transform: "translate(-50%, -50%)",
      },
    },
  })
);
const StyledSlider = styled(SwiperSlide)(({ spacing }: TypeProps) => ({
  marginLeft: `calc(-1 * ${spacing || "0px"} / 2)`,
  marginRight: `calc(-1 * ${spacing || "0px"} / 2)`,
}));
const carouselStyled = {
  overflow: "hidden",
  ":hover": {
    "& .carousel__back-button, & .carousel__next-button": { opacity: 1 },
  },
  "& .carousel__back-button, & .carousel__next-button": {
    width: 30,
    opacity: 1,
    color: "white",
    borderRadius: 0,
    transition: "0.3s",
    backgroundColor: "dark.main",
    ":hover:not(:disabled)": {
      color: "white",
      backgroundColor: "dark.main",
    },
  },
  "& .carousel__back-button": {
    left: 0,
    boxShadow: "-4px 0 7px -5px rgb(0 0 0 / 20%)",
  },
  "& .carousel__next-button": {
    right: 0,
    boxShadow: "4px 0 7px -5px rgb(0 0 0 / 20%)",
  },
  "& .carousel__back-button:disabled": { left: -100, transition: "0.3s" },
  "& .carousel__next-button:disabled": { right: -100, transition: "0.3s" },
  "& .carousel__next-button:disabled, & .carousel__back-button:disabled": {
    opacity: 0.6,
  },
};
export {
  StyledSlider,
  carouselStyled,
  commonArrowBtnStyle,
  StyledCarouselProvider,
};
