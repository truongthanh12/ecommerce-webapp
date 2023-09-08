import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
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
import { IVariant } from "@/app/models/Variant";
import Chip from "@mui/material/Chip";
import { IProducts } from "@/app/models/Product";
import { AnyAaaaRecord } from "dns";

// ================================================================
type OptionsType = {
  sizes: string;
  colors: string;
};
const ContentWrapper = styled(Box)(() => ({
  borderRadius: "8px",
  padding: "0.5rem",
}));

const ProductIntro = ({ product }: { product: Partial<IProducts> }) => {
  const { price, title, images, shop, brands, stock, sizes, colors } =
    product || {};
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectVariants, setSelectVariants] = useState<OptionsType>({
    sizes: sizes?.[0] || "",
    colors: colors?.[0] || "",
  });

  const productVariants: any = [
    { sizes: sizes, title: "Sizes" },
    { colors: colors, title: "Color" },
  ];

  // HANDLE CHAMGE TYPE AND OPTIONS
  const handleChangeVariant = (variantName: string, value: string) => () => {
    setSelectVariants((state) => ({
      ...state,
      [variantName.toLowerCase()]: value,
    }));
  };

  useEffect(() => {
    setSelectedImage(0);
  }, []);

  // HANDLE SELECT IMAGE
  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  // HANDLE CHANGE CART
  const [qty, setQty] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleCartAmountChange = (type: "add" | "minus") => () => {
    if (!isInStock) return;

    if (type === "add") {
      if (qty < Number(stock)) {
        setQty((qty) => qty + 1);
      }
      return;
    }

    if (qty === 0) return;
    setQty((qty) => qty - 1);
  };

  const isInStock = useMemo(() => {
    return Number(stock) > 0;
  }, [stock]);

  return (
    <Box width="100%">
      <Grid container spacing={3} justifyContent="space-around">
        <Grid item md={6} xs={12} alignItems="center">
          <FlexBox justifyContent="center" mb={6} onClick={toggleDialog}>
            {images && images.length > 0 ? (
              <LazyImage
                alt={title}
                width={350}
                height={350}
                loading="eager"
                style={{ objectFit: "contain" }}
                src={images[selectedImage]}
              />
            ) : (
              <div>No Images Available</div>
            )}
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
                {images && images.length > 0 ? (
                  <LazyImage
                    alt={title}
                    width={0}
                    height={0}
                    layout="responsive"
                    loading="eager"
                    objectFit="cover"
                    src={images[selectedImage]}
                  />
                ) : (
                  <div>No Images Available</div>
                )}
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
            {images?.map((url: string, ind: number) => (
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
                mr={ind === images?.length - 1 ? "auto" : "10px"}
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
            <H6 pl={1}>{brands}</H6>
          </FlexBox>

          <FlexBox alignItems="center" mb={2}>
            <Box lineHeight="1">Rated:</Box>
            <Box mx={1} lineHeight="1">
              <Rating color="warn" fontSize="1.25rem" value={4} readOnly />
            </Box>
            <H6 lineHeight="1">(50)</H6>
          </FlexBox>

          {productVariants.map((variant: any) => (
            <Box key={variant.title} mb={2}>
              <H6 mb={1}>{variant.title}</H6>

              {(variant.sizes || variant.colors || []).map((item: any) => (
                <Chip
                  key={item}
                  label={item}
                  onClick={handleChangeVariant(String(variant), String(item))}
                  color={
                    selectVariants[
                      String(
                        variant
                      ).toLowerCase() as keyof typeof selectVariants
                    ] === String(item)
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
            <H2 color="primary.main" mb={2} lineHeight="1">
              {currency(price)}
            </H2>
            <Box color="inherit">
              {isInStock ? "Stock Available" : "Stock Unavailable"}
            </Box>
          </Box>

          {!qty ? (
            <Button
              color="primary"
              variant="contained"
              onClick={handleCartAmountChange("add")}
              disabled={!isInStock}
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
            <Link href={`/shops/${shop?.id}`} passHref>
              <H6 ml={1}>{shop?.displayName}</H6>
            </Link>
          </FlexBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(ProductIntro);
