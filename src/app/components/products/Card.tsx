import Link from "next/link";
import React, { Fragment, useCallback, useState } from "react";
import { Add, Favorite, Remove, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, styled } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import LazyImage from "@/components/LazyImage";
import Card from "@/components/Card";
import { H3, Span } from "@/components/Typography";
import Rating from "@/components/Rating";
import ProductViewDialog from "@/components/products/ViewDialog";
import { FlexBox } from "@/components/flex-box";
import { calculateDiscount, currency } from "@/utils/lib";

// styled components
const StyledCard = styled(Card)({
  height: "100%",
  margin: "auto",
  display: "flex",
  overflow: "hidden",
  borderRadius: "8px",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 250ms ease-in-out",
  ":hover": {
    "& .hover-box": {
      opacity: 1,
    },
  },
});
const ImageWrapper = styled(Box)(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  display: "inline-block",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));
const StyledChip = styled(Chip)({
  zIndex: 1,
  top: "10px",
  left: "10px",
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: "10px",
  position: "absolute",
});
const HoverIconWrapper = styled(Box)({
  zIndex: 2,
  top: "7px",
  opacity: 0,
  right: "15px",
  display: "flex",
  cursor: "pointer",
  position: "absolute",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
});
const ContentWrapper = styled(Box)({
  padding: "1rem",
  "& .title, & .categories": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

// ========================================================
interface TypeProps {
  id: string | number;
  slug: string;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  hideRating?: boolean;
  hoverEffect?: boolean;
  discount: number;
  showProductSize?: boolean;
  images?: string[];
}
const ProductCard = ({
  id,
  slug,
  title,
  price,
  thumbnail,
  rating = 5,
  hideRating,
  hoverEffect,
  discount = 5,
  showProductSize,
  images,
}: TypeProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const toggleIsFavorite = () => setIsFavorite((fav) => !fav);
  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
  const [qty, setQty] = useState(0);
  const handleCartAmountChange = (type: "add" | "minus") => () => {
    if (type === "add") {
      setQty(qty + 1);
      return;
    }
    if (qty === 0) return;
    setQty(qty - 1);
    //
  };

  return (
    <StyledCard hoverEffect={hoverEffect}>
      <ImageWrapper>
        {!!discount && (
          <StyledChip color="primary" size="small" label={`${discount}% off`} />
        )}

        <HoverIconWrapper className="hover-box">
          <IconButton onClick={toggleDialog}>
            <RemoveRedEye color="disabled" fontSize="small" />
          </IconButton>

          <IconButton onClick={toggleIsFavorite}>
            {isFavorite ? (
              <Favorite color="primary" fontSize="small" />
            ) : (
              <FavoriteBorder fontSize="small" color="disabled" />
            )}
          </IconButton>
        </HoverIconWrapper>

        <Link href={`/product/${slug}`}>
          <LazyImage
            src={thumbnail}
            width={0}
            height={0}
            layout="responsive"
            alt={title}
          />
        </Link>
      </ImageWrapper>

      <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        product={{
          title,
          price,
          id,
          slug,
          images,
        }}
      />

      <ContentWrapper>
        <FlexBox>
          <Box flex="1 1 0" minWidth="0px" mr={1}>
            <Link href={`/product/${slug}`}>
              <H3
                mb={1}
                title={title}
                fontSize="14px"
                fontWeight="600"
                className="title"
                color="text.secondary"
              >
                {title}
              </H3>
            </Link>

            {/* {!hideRating && ( */}
            <Rating value={rating || 0} color="warn" readOnly />
            {/* )} */}

            {showProductSize && (
              <Span color="grey.600" mb={1} display="block">
                {showProductSize}
              </Span>
            )}

            <FlexBox alignItems="center" gap={1} mt={0.5}>
              <Box fontWeight="600" color="primary.main">
                {calculateDiscount(price, discount)}
              </Box>

              {discount && (
                <Box color="grey.600" fontWeight="600">
                  <del>{currency(price)}</del>
                </Box>
              )}
            </FlexBox>
          </Box>

          <FlexBox
            width="30px"
            alignItems="center"
            className="add-cart"
            flexDirection="column-reverse"
            justifyContent={qty ? "space-between" : "flex-start"}
          >
            <Button
              color="primary"
              variant="outlined"
              sx={{
                padding: "3px",
              }}
              onClick={handleCartAmountChange("add")}
            >
              <Add fontSize="small" />
            </Button>

            {qty !== 0 && (
              <Fragment>
                <Box color="text.primary" fontWeight="600">
                  {qty}
                </Box>

                <Button
                  color="primary"
                  variant="outlined"
                  sx={{
                    padding: "3px",
                  }}
                  onClick={handleCartAmountChange("minus")}
                >
                  <Remove fontSize="small" />
                </Button>
              </Fragment>
            )}
          </FlexBox>
        </FlexBox>
      </ContentWrapper>
    </StyledCard>
  );
};
export default React.memo(ProductCard);
