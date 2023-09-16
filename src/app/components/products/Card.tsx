"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Add, Favorite, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, Grid, IconButton } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import LazyImage from "@/components/LazyImage";
import Card from "@/components/Card";
import { H3, H4, Small, Span } from "@/components/Typography";
import Rating from "@/components/Rating";
import ProductViewDialog from "@/components/products/ViewDialog";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import { calculateDiscount, currency, formatToSlug } from "@/utils/lib";
import HoverBox from "@/components/HoverBox";
import {
  ContentWrapper,
  HoverIconWrapper,
  ImageWrapper,
  StyledCard,
  StyledChip,
  StyledChipCategory,
} from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { addItemToWishlist, fetchWishlistByUserId } from "@/redux/features/wishlistSlice";

// ========================================================
interface TypeProps {
  id?: string;
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
  stock?: string;
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
  stock,
}: Partial<TypeProps>) => {
  const [openModal, setOpenModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch: any = useDispatch();
  const wishlist = useSelector((state: any) => state.wishlist);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(fetchWishlistByUserId(user.docId));
  }, [dispatch, user]);

  const toggleIsFavorite = () => {
    setIsFavorite((fav) => !fav);
    dispatch(
      addItemToWishlist({
        userId: user.docId,
        product: {
          slug,
          title,
          price,
          thumbnail,
          rating,
          discount,
          stock,
          id,
        },
      })
    );
  };
  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);

  const formattedSlug = useMemo(() => formatToSlug(slug), [slug]);
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
          discount,
          stock,
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

            <Link href={`/product/${formattedSlug}`} passHref>
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
                <Link href={`/product/${formattedSlug}`} passHref>
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
                justifyContent={isInShop ? "center" : "flex-start"}
              >
                <Link href={`/product/${formattedSlug}`} passHref>
                  <Button
                    color="primary"
                    variant="outlined"
                    style={{ minWidth: "30px" }}
                    sx={{
                      padding: "3px",
                    }}
                  >
                    <Add fontSize="small" />
                  </Button>
                </Link>
              </FlexBox>
            </FlexBox>
          </ContentWrapper>
        </Grid>
      </Grid>
    </StyledCard>
  );
};
export default React.memo(ProductCard);
