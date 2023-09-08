"use client";
import Link from "next/link";
import React, { Fragment, useCallback, useState } from "react";
import { Add, Favorite, Remove, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, Grid, IconButton } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import LazyImage from "@/components/LazyImage";
import Card from "@/components/Card";
import { H3, H4, Small, Span } from "@/components/Typography";
import Rating from "@/components/Rating";
import ProductViewDialog from "@/components/products/ViewDialog";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import { calculateDiscount, currency } from "@/utils/lib";
import HoverBox from "@/components/HoverBox";
import {
  ContentWrapper,
  HoverIconWrapper,
  ImageWrapper,
  StyledCard,
  StyledChip,
  StyledChipCategory,
} from "./styles";

// ========================================================
interface TypeProps {
  id?: string | number;
  slug?: string;
  title?: string;
  price?: number;
  thumbnail?: string;
  rating?: number;
  hoverEffect?: boolean;
  discount?: number;
  showProductSize?: boolean;
  images?: string[];
  isCategoryCard?: boolean;
  subtitle?: string;
  isBasicCard?: boolean;
  reviewCount?: number;
  isFeatured?: boolean;
  isTopCategory?: boolean;
  sx?: any;
  children?: React.ReactNode;
  isInShop?: boolean;
}
const ProductCard = ({
  id,
  slug,
  title = "",
  price = 0,
  thumbnail = "",
  rating = 5,
  hoverEffect,
  discount = 5,
  showProductSize,
  images,
  isCategoryCard,
  subtitle,
  isBasicCard,
  reviewCount,
  isFeatured,
  isTopCategory,
  isInShop,
}: Partial<TypeProps>) => {
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
  };

  if (isCategoryCard) {
    return (
      <Card
        sx={{
          position: "relative",
        }}
      >
        <StyledChipCategory
          color="secondary"
          label={title}
          size="small"
          sx={{
            left: "0.875rem",
          }}
        />

        <StyledChipCategory
          label={subtitle}
          size="small"
          sx={{
            right: "0.875rem",
          }}
        />

        <HoverBox position="relative" height="120px" borderRadius="8px">
          <LazyImage
            src={thumbnail}
            layout="fill"
            objectFit="cover"
            borderRadius="8px"
            alt={title}
          />
        </HoverBox>
      </Card>
    );
  }
  if (isBasicCard) {
    return (
      <Box>
        <HoverBox
          position="relative"
          height={isTopCategory ? "118px" : "188px"}
          mb={2}
          mx="auto"
          borderRadius="8px"
        >
          <LazyImage
            src={thumbnail}
            width={0}
            height={0}
            layout="fill"
            objectFit="cover"
            alt={title}
            mx="auto"
          />
        </HoverBox>

        {isTopCategory && (
          <FlexRowCenter mb={0.5}>
            <Rating value={rating} color="warn" readOnly />
            <Small fontWeight={600} pl={0.5}>
              ({reviewCount})
            </Small>
          </FlexRowCenter>
        )}

        <H4
          fontSize={14}
          textAlign={isTopCategory ? "center" : "left"}
          mb={0.5}
          title={title}
          ellipsis
        >
          {title}
        </H4>

        {isTopCategory ? (
          <H4
            fontSize={14}
            textAlign={isTopCategory ? "center" : "left"}
            color="primary.main"
          >
            {currency(price)}
          </H4>
        ) : (
          <FlexBox gap={1}>
            {discount && (
              <H4 fontWeight="600" fontSize="14px" color="primary.main">
                {calculateDiscount(price, discount)}
              </H4>
            )}

            <H4 fontWeight="600" fontSize="14px" color="grey.600">
              <del>{currency(price)}</del>
            </H4>
          </FlexBox>
        )}
      </Box>
    );
  }
  if (isFeatured) {
    return (
      <Box>
        <HoverBox position="relative" height="188px" borderRadius="5px" mb={1}>
          <LazyImage
            alt={title}
            width={0}
            src={thumbnail}
            height={0}
            objectFit="cover"
            layout="fill"
          />
        </HoverBox>
        <H4 fontSize={14}>{title}</H4>
      </Box>
    );
  }

  return (
    <StyledCard hoverEffect={hoverEffect}>
      <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        product={{
          title,
          price,
          id,
          slug,
          images,
          thumbnail,
          discount
        }}
      />
      <Grid item alignItems="center" container spacing={1} xs={isInShop}>
        <Grid sx={{ width: "100%" }} item sm={isInShop ? 3 : 12} xs={12}>
          <ImageWrapper>
            {!!discount && (
              <StyledChip
                color="primary"
                size="small"
                label={`${discount}% off`}
              />
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

            <Link href={`/product/${slug}`} passHref>
              <LazyImage
                src={thumbnail}
                width={0}
                height={0}
                layout="responsive"
                alt={title}
              />
            </Link>
          </ImageWrapper>
        </Grid>
        <Grid item sm={isInShop ? 9 : 12} xs={12}>
          <ContentWrapper>
            <FlexBox>
              <Box flex="1 1 0" minWidth="0px" mr={1}>
                <Link href={`/product/${slug}`} passHref>
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
                <Rating value={rating || 0} color="warn" />
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

                  {discount ? (
                    <Box color="grey.600" fontWeight="600">
                      <del>{currency(price)}</del>
                    </Box>
                  ) : (
                    ""
                  )}
                </FlexBox>
              </Box>

              <FlexBox
                width="30px"
                alignItems="center"
                className="add-cart"
                flexDirection="column-reverse"
                justifyContent={
                  qty ? "space-between" : isInShop ? "center" : "flex-start"
                }
              >
                <Button
                  color="primary"
                  variant="outlined"
                  style={{ minWidth: "30px" }}
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
                      style={{ minWidth: "30px" }}
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
        </Grid>
      </Grid>
    </StyledCard>
  );
};
export default React.memo(ProductCard);
