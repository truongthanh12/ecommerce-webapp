import Link from "next/link";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import LazyImage from "@/components/LazyImage";
import Rating from "@/components/Rating";
import { H1, H2, H4, H6, Span } from "@/components/Typography";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import { calculateDiscount, capitalizeStr, currency } from "@/utils/lib";
import Chip from "@mui/material/Chip";
import { IComments, IProducts } from "@/app/models/Product";
import CartAction from "./CartAction";
import { addDays, format } from "date-fns";
import Card from "../Card";
import voucherCode from "@/app/data/voucher-code";
import { useSelector } from "react-redux";
import { selectCartItemsForUser } from "@/redux/features/cartSlice";

const ContentWrapper = styled(Box)(() => ({
  borderRadius: "8px",
  padding: "0.5rem",
}));

const ProductIntro = ({
  product,
  searchParams,
  comments,
}: {
  product: Partial<IProducts>;
  searchParams: { [key: string]: string | undefined };
  comments: IComments[];
}) => {
  const { price, title, images, shop, stock, sizes, colors, discount, id } =
    product || {};
  const [selectedImage, setSelectedImage] = useState(0);
  const [voucher, setVoucher] = useState(0);

  const { user } = useSelector((state: any) => state.auth);
  const userCartItems = useSelector(selectCartItemsForUser(user.docId));

  const selectedSize = (searchParams?.size || sizes?.[0]) as string;
  const selectedColor = (searchParams?.color || colors?.[0]) as string;

  // Get the current quantity of this item in the cart
  const currentItemInCart = userCartItems
    ? userCartItems?.find(
        (item: any) =>
          item.product.id === id &&
          item.product.size === selectedSize &&
          item.product.color === selectedColor
      )
    : null;

  const productData = useMemo(() => {
    return {
      ...product,
      size: selectedSize,
      color: selectedColor,
      voucherSelected: voucher,
    };
  }, [product, selectedSize, selectedColor, voucher]);
  const currentDate = new Date();

  // Add 3 days to the current date
  const futureDate = addDays(currentDate, 3);

  // Format the current date and future date
  const formattedFutureDay = format(futureDate, "dd");
  const formattedFutureMonth = format(futureDate, "MM");

  // HANDLE SELECT IMAGE
  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  // HANDLE CHANGE CART
  const [openDialog, setOpenDialog] = useState(false);

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleVoucher = (code: number) => {
    setVoucher(code);
  };

  const isInStock = useMemo(() => {
    return Number(stock) > 0;
  }, [stock]);

  const hasVoucher = useMemo(() => {
    return (price || 0) > 150000 ? true : false;
  }, [price]);

  useEffect(() => {
    setSelectedImage(0);
  }, []);

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
                minWidth: 400,
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
                  src={images ? images[selectedImage] : ""}
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
          <H1 mb={1}>{capitalizeStr(title)}</H1>
          <Box mb={1.5}>
            <Box color="inherit">
              {isInStock ? "Stock Available" : "Stock Unavailable"}
            </Box>
          </Box>
          <FlexBox alignItems="center" mb={2}>
            <Box lineHeight="1">Rated:</Box>
            <Box mx={1} lineHeight="1">
              <Rating productId={id || ""} />
            </Box>
            <H6 lineHeight="1">({comments?.length})</H6>
          </FlexBox>

          {sizes && (
            <Box mb={2}>
              <H6 mb={1}>Sizes</H6>
              {(sizes || []).map((size: any) => (
                <Link
                  key={size}
                  href={`?${new URLSearchParams({
                    size,
                    color: selectedColor,
                  })}`}
                >
                  <Chip
                    key={size}
                    label={size}
                    color={selectedSize === size ? "primary" : "default"}
                    sx={{
                      borderRadius: "4px",
                      mr: 1,
                      cursor: "pointer",
                    }}
                  />
                </Link>
              ))}
            </Box>
          )}
          {colors && (
            <Box mb={2}>
              <H6 mb={1}>Colors</H6>
              {(colors || []).map((color: any) => (
                <Link
                  key={color}
                  href={`?${new URLSearchParams({
                    color,
                    size: selectedSize,
                  })}`}
                >
                  <Chip
                    label={color}
                    color={selectedColor === color ? "primary" : "default"}
                    sx={{
                      borderRadius: "4px",
                      mr: 1,
                      cursor: "pointer",
                    }}
                  />
                </Link>
              ))}
            </Box>
          )}

          <FlexBox alignItems="center" py={2.5}>
            {Number(discount) ? (
              <Box>
                <FlexBox>
                  <H2
                    color="primary.main"
                    sx={{ textDecoration: "line-through" }}
                    mr={2}
                    lineHeight="1"
                  >
                    {currency(price)}
                  </H2>
                  <H2 lineHeight="1">
                    {calculateDiscount(price, discount || 0, voucher * 1000)}
                  </H2>
                </FlexBox>
              </Box>
            ) : (
              <Box>
                <H2 color="primary.main" lineHeight="1">
                  {currency(price)}
                </H2>
              </Box>
            )}
            {voucher ? (
              <H4
                p="6px 10px"
                mx={2}
                fontSize={14}
                lineHeight="1"
                borderRadius="3px"
                color="primary.main"
                sx={{ width: "max-content", height: "100%" }}
                bgcolor="primary.light"
              >
                -{voucher}K
              </H4>
            ) : (
              ""
            )}
          </FlexBox>

          <Card sx={{ padding: 1.5, position: "relative" }}>
            <H4 pb={1.5}>
              Shipping
              {shop?.userType && shop?.userType !== "None" && (
                <Span
                  p="6px 10px"
                  mx={2}
                  fontSize={14}
                  lineHeight="1"
                  borderRadius="3px"
                  color="primary.main"
                  sx={{
                    width: "max-content",
                    height: "auto",
                    position: "absolute",
                    top: "8px",
                    right: 0,
                  }}
                  bgcolor="primary.light"
                >
                  Freeship
                  {shop?.userType === "Premium"
                    ? "-20K"
                    : shop?.userType === "Gold"
                    ? "-15K"
                    : "-10K"}
                </Span>
              )}
            </H4>
            <H6 pb={1}>
              Estimated delivery {formattedFutureDay},{" "}
              {Number(formattedFutureDay) + 1} - {formattedFutureMonth}
            </H6>
          </Card>

          {!currentItemInCart &&
          shop?.userType &&
          shop?.userType !== "None" &&
          hasVoucher ? (
            <>
              <Divider sx={{ py: 1 }} />

              <Card sx={{ padding: 1.5 }}>
                <H4 pb={1.5}>Voucher Code</H4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {voucherCode[shop?.userType || ""]?.map((item: any) => {
                    return (
                      <div key={item} onClick={() => handleVoucher(item)}>
                        <H4
                          p="6px 10px"
                          mr={2}
                          fontSize={14}
                          lineHeight="1"
                          borderRadius="3px"
                          color={voucher === item ? "primary.main" : ""}
                          sx={{ cursor: "pointer", width: "max-content" }}
                          bgcolor="primary.light"
                        >
                          {item}K
                        </H4>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          ) : (
            ""
          )}

          <div style={{ marginTop: 24 }}>
            <CartAction product={productData} />
          </div>

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
