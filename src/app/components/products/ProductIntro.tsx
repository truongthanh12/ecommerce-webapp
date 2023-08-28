import Link from "next/link";
import React, { useCallback, useState } from "react";
import { Add, Close, Remove } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import LazyImage from "@/components/LazyImage";
import Rating from "@/components/Rating";
import { H1, H2, H3, H6 } from "@/components/Typography";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import { currency } from "@/utils/lib";
import productVariants from "@/app/data/product-variants";
import { IVariant } from "@/app/models/Variant";
import Chip from "@mui/material/Chip";

// ================================================================
const product = {
  id: "8ac53dd8-6418-454f-bbb5-29f0b26ac5a5",
  slug: "nikecourt-zoom-vapor-cage",
  shop: {
    id: "baa3a02b-42da-40c0-852b-3aa292b70704",
    slug: "anytime-buys",
    user: {
      id: "e0d8be78-c530-4f1a-a2df-d082ba2db274",
      email: "Daisy.McLaughlin80@yahoo.com",
      phone: "1-462-772-4274 x931",
      avatar:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/174.jpg",
      password: "nAGr0Rkf8CLP4Sv",
      dateOfBirth: "1958-06-07T17:14:57.585Z",
      verified: true,
      name: {
        firstName: "Llewellyn",
        lastName: "Schmitt",
      },
    },
    email: "Vida.Simonis@hotmail.com",
    name: "Anytime Buys",
    phone: "(613) 343-9004",
    address: "845 N. Stonybrook Ave. Tonawanda, NY 14210, Denmark",
    verified: false,
    coverPicture: "/assets/images/banners/banner-6.png",
    profilePicture: "/assets/images/faces/propic(5).png",
    socialLinks: {
      facebook: null,
      youtube: null,
      twitter: null,
      instagram: null,
    },
  },
  title: "NikeCourt Zoom Vapor Cage",
  brand: null,
  price: 250,
  size: null,
  colors: [],
  discount: 25,
  thumbnail: "/assets/images/products/flash-1.png",
  images: [
    "/assets/images/products/flash-1.png",
    "/assets/images/products/flash-1.png",
  ],
  categories: [],
  status: null,
  reviews: [],
  for: {
    demo: "market-1",
    type: "flash-deals",
  },
};
type OptionsType = {
  option: string;
  type: string;
};
const ContentWrapper = styled(Box)(() => ({
  borderRadius: "8px",
  padding: "0.5rem",
}));

const ProductIntro = () => {
  const { price, title, images } = product || {};
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectVariants, setSelectVariants] = useState<OptionsType>({
    option: "option 1",
    type: "type 1",
  });

  // HANDLE CHAMGE TYPE AND OPTIONS
  const handleChangeVariant = (variantName: string, value: string) => () => {
    setSelectVariants((state) => ({
      ...state,
      [variantName.toLowerCase()]: value,
    }));
  };

  // HANDLE SELECT IMAGE
  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  // HANDLE CHANGE CART
  const [qty, setQty] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleCartAmountChange = (type: "add" | "minus") => () => {
    if (type === "add") {
      setQty(qty + 1);
      return;
    }
    if (qty === 0) return;
    setQty(qty - 1);
  };

  return (
    <Box width="100%">
      <Grid container spacing={3} justifyContent="space-around">
        <Grid item md={6} xs={12} alignItems="center">
          <FlexBox justifyContent="center" mb={6} onClick={toggleDialog}>
            <LazyImage
              alt={title}
              width={350}
              height={350}
              loading="eager"
              style={{ objectFit: "contain" }}
              src={product.images[selectedImage]}
            />
          </FlexBox>
          <Dialog
            open={openDialog}
            maxWidth={false}
            onClose={toggleDialog}
            sx={{
              zIndex: 1501,
              width: "100%",
              height: "auto",
            }}
          >
            <DialogContent
              sx={{
                maxWidth: 900,
                width: "100%",
              }}
            >
              <ContentWrapper>
                <LazyImage
                  alt={title}
                  width={0}
                  height={0}
                  layout="responsive"
                  loading="eager"
                  objectFit="cover"
                  src={product.images[selectedImage]}
                />
              </ContentWrapper>

              <IconButton
                sx={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                }}
                onClick={toggleDialog}
              >
                <Close fontSize="small" color="secondary" />
              </IconButton>
            </DialogContent>
          </Dialog>

          <FlexBox overflow="auto">
            {images.map((url: string, ind: number) => (
              <FlexRowCenter
                key={ind + url}
                width={64}
                height={64}
                minWidth={64}
                bgcolor="white"
                border="1px solid"
                borderRadius="10px"
                ml={ind === 0 ? "auto" : 0}
                style={{
                  cursor: "pointer",
                }}
                onClick={handleImageClick(ind)}
                mr={ind === images.length - 1 ? "auto" : "10px"}
                borderColor={
                  selectedImage === ind ? "primary.main" : "grey.400"
                }
              >
                <Avatar
                  src={url}
                  variant="square"
                  sx={{
                    height: 40,
                  }}
                />
              </FlexRowCenter>
            ))}
          </FlexBox>
        </Grid>

        <Grid item md={6} xs={12} alignItems="center">
          <H1 mb={1}>{title}</H1>

          <FlexBox alignItems="center" mb={1}>
            <Box>Brand:</Box>
            <H6>Xiaomi</H6>
          </FlexBox>

          <FlexBox alignItems="center" mb={2}>
            <Box lineHeight="1">Rated:</Box>
            <Box mx={1} lineHeight="1">
              <Rating color="warn" fontSize="1.25rem" value={4} readOnly />
            </Box>
            <H6 lineHeight="1">(50)</H6>
          </FlexBox>

          {productVariants.map((variant: IVariant, ind) => (
            <Box key={variant.id} mb={2}>
              <H6 mb={1}>{variant.title}</H6>

              {(variant.values || []).map(({ id, value }) => (
                <Chip
                  key={id}
                  label={value}
                  onClick={handleChangeVariant(
                    String(variant.title),
                    String(value)
                  )}
                  color={
                    selectVariants[
                      String(
                        variant.title
                      ).toLowerCase() as keyof typeof selectVariants
                    ] === String(value)
                      ? "primary"
                      : "default"
                  }
                  sx={{
                    borderRadius: "4px",
                    mr: 1,
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          ))}

          <Box pt={1} mb={3}>
            <H2 color="primary.main" mb={0.5} lineHeight="1">
              {currency(price)}
            </H2>
            <Box color="inherit">Stock Available</Box>
          </Box>

          {!qty ? (
            <Button
              color="primary"
              variant="contained"
              onClick={handleCartAmountChange("add")}
              sx={{
                mb: 4.5,
                px: "1.75rem",
                height: 40,
              }}
            >
              Add to Cart
            </Button>
          ) : (
            <FlexBox alignItems="center" mb={4.5}>
              <Button
                size="small"
                sx={{
                  p: 1,
                }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange("minus")}
              >
                <Remove fontSize="small" />
              </Button>

              <H3 fontWeight="600" mx={2.5}>
                {qty.toString().padStart(2, "0")}
              </H3>

              <Button
                size="small"
                sx={{
                  p: 1,
                }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange("add")}
              >
                <Add fontSize="small" />
              </Button>
            </FlexBox>
          )}

          <FlexBox alignItems="center" mb={2}>
            <Box>Sold By:</Box>
            <Link href="/shops/scarlett-beauty" passHref>
              <H6 ml={1}>Mobile Store</H6>
            </Link>
          </FlexBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(ProductIntro);
