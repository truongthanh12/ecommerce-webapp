"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Add, Favorite, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Tooltip } from "@mui/material";
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
import { RootState } from "@/redux/store";
import {
  addWishlistAsync,
  deleteWishlistAsync,
  getWishlistByUserId,
} from "@/redux/features/authSlice";
import { setMessage } from "@/redux/features/messageSlice";

// ========================================================
interface TypeProps {
  id?: string;
  slug?: string;
  title?: string;
  price?: number;
  thumbnail?: string;
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
  shop?: any;
}
const ProductCard = ({
  id,
  slug,
  title = "",
  price = 0,
  thumbnail = "",
  hoverEffect,
  discount = 0,
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
  shop,
}: Partial<TypeProps>) => {
  const [openModal, setOpenModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch: any = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && user.wishlist) {
      const isItemInWishlist = user.wishlist.some(
        (item: any) => item.products.slug === slug
      );
      setIsFavorite(isItemInWishlist);
    }
  }, [user, slug]);

  const toggleIsFavorite = async () => {
    setIsFavorite((fav) => !fav);

    if (user) {
      if (!isFavorite) {
        await dispatch(
          addWishlistAsync({
            userId: user.docId,
            products: {
              slug,
              title,
              price,
              images,
              thumbnail,
              stock,
              shop,
              discount,
              id,
            },
          })
        );
        dispatch(setMessage({ message: "Add to wishlist successfully!" }));
      } else {
        dispatch(setMessage({ message: "Remove from wishlist successfully!" }));
        const wishlistItem = user.wishlist?.find(
          (item: any) => item.products.slug === slug
        );
        const wishlistId = wishlistItem?.id;
        await dispatch(deleteWishlistAsync({ wishlistId, userId: user.docId }));
        dispatch(getWishlistByUserId(user.docId))
      }
    }
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
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            width: "clamp(170px, 46%, 100px)",
            maxWidth: "max-content",
          }}
        />

        <StyledChipCategory
          label={subtitle}
          size="small"
          sx={{
            right: "0.875rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            width: "clamp(170px, 46%, 100px)",
            maxWidth: "max-content",
          }}
        />

        <HoverBox position="relative" height="120px" borderRadius="8px">
          <LazyImage
            src={thumbnail}
            layout="fill"
            sizes="100%"
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
            sizes="100%"
            layout="fill"
            objectFit="cover"
            alt={title}
            mx="auto"
          />
        </HoverBox>

        {isTopCategory && (
          <FlexRowCenter mb={0.5}>
            <Rating productId={id || ""} />
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
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
          }}
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
          <FlexBox alignItems="center" gap={1} mt={0.5}>
            <Box fontWeight="600" color="primary.main">
              {calculateDiscount(price, Number(discount))}
            </Box>

            {Number(discount) !== 0 ? (
              <Box color="grey.600" fontWeight="600">
                <del>{currency(price)}</del>
              </Box>
            ) : (
              ""
            )}
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
            src={thumbnail}
            sizes="100%"
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
          shop,
        }}
      />
      <Grid item alignItems="center" container spacing={1}>
        <Grid
          sx={{ width: "100%", paddingBottom: isInShop ? 0 : "100%" }}
          item
          sm={isInShop ? 3 : 12}
          xs={12}
        >
          <ImageWrapper inlist={isInShop}>
            {!!Number(discount) && (
              <StyledChip
                color="primary"
                size="small"
                label={`${discount}% off`}
              />
            )}

            <HoverIconWrapper className="hover-box">
              <Tooltip title="Detail" placement="top">
                <IconButton
                  sx={{ backgroundColor: "rgba(15, 52, 96, .35)" }}
                  onClick={toggleDialog}
                >
                  <RemoveRedEye color="disabled" fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={isFavorite ? "Remove wishlist" : "Add wishlist"}>
                <IconButton
                  sx={{ backgroundColor: "rgba(15, 52, 96, .35)" }}
                  onClick={toggleIsFavorite}
                >
                  {isFavorite ? (
                    <Favorite color="primary" fontSize="small" />
                  ) : (
                    <FavoriteBorder fontSize="small" color="disabled" />
                  )}
                </IconButton>
              </Tooltip>
            </HoverIconWrapper>

            <Link href={`/product/${formattedSlug}`} passHref>
              <LazyImage
                src={thumbnail}
                width={0}
                height={0}
                sizes="100%"
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
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "flex",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {title}
                  </H3>
                </Link>

                <Rating productId={id || ""} />

                {showProductSize && (
                  <Span color="grey.600" mb={1} display="block">
                    {showProductSize}
                  </Span>
                )}

                <FlexBox alignItems="center" gap={1} mt={0.5}>
                  <Box fontWeight="600" color="primary.main">
                    {calculateDiscount(price, Number(discount))}
                  </Box>

                  {Number(discount) !== 0 ? (
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
