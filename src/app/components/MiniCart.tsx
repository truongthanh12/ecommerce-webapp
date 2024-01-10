import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import { Clear, Close } from "@mui/icons-material";
import LazyImage from "@/components/LazyImage";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import { H5, Paragraph, Tiny } from "@/components/Typography";
import CartBag from "@/components/icons/CartBag";
import { currency } from "@/utils/lib";
import React, { FC, useMemo } from "react";
import CartAction from "./products/CartAction";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "@/redux/features/cartSlice";
import { IProducts } from "../models/Product";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";

// =========================================================

type TypeMinicart = {
  toggleSidenav: () => void;
  cartList: any;
};
const MiniCart: FC<TypeMinicart> = ({ toggleSidenav, cartList }) => {
  const { palette } = useTheme();
  const dispatch: any = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const params = useParams()

  const getTotalPrice = useMemo(() => {
    // Calculate the total voucher deduction for the entire cart
    const totalVoucherDeduction = cartList.reduce(
      (accum: number, item: any) => accum + item.product.voucherSelected * 1000,
      0
    );

    return (
      cartList.reduce((accum: number, item: any) => {
        const discountedPrice =
          item.product.price -
          item.product.price * (item.product.discount / 100);

        return accum + discountedPrice * item.quantity;
      }, 0) - totalVoucherDeduction
    ); // Subtract the total voucher deduction from the total price
  }, [cartList]);

  const removeItemFromCart = ({ product }: { product: Partial<IProducts> }) => {
    dispatch(
      removeFromCart({
        product,
        userId: user.docId,
        quantity: 0,
        stock: Number(product.stock),
        size: product.size,
        color: product.color,
      })
    );
  };

  return (
    <Box width={320} maxWidth={380}>
      <Box
        overflow="auto"
        height={`calc(100vh - ${!!cartList.length ? "80px - 3.25rem" : "0px"})`}
      >
        <FlexBetween mx={3} height={74}>
          <FlexBox gap={1} alignItems="center" color="secondary.main">
            <CartBag color="inherit" />

            <Paragraph lineHeight={0} fontWeight={600}>
              {cartList.length} item{cartList.length < 2 ? "" : "s"}
            </Paragraph>
          </FlexBox>

          <IconButton onClick={toggleSidenav}>
            <Clear />
          </IconButton>
        </FlexBetween>

        <Divider />

        {cartList.length < 1 && (
          <FlexBox
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            height="calc(100% - 74px)"
          >
            <LazyImage
              width={90}
              height={100}
              alt="banner"
              src="/assets/images/logos/shopping-bag.svg"
            />
            <Box
              component="p"
              mt={2}
              color="grey.600"
              textAlign="center"
              maxWidth="200px"
            >
              Your shopping bag is empty. Start shopping
            </Box>
          </FlexBox>
        )}

        {cartList.map((item: any, index: number) => {
          const { product } = item || {};
          return (
            <FlexBox
              py={2}
              px={2.5}
              key={product.id + index}
              alignItems="center"
              borderBottom={`1px solid ${palette.divider}`}
            >
              <CartAction isIncludeBtnAdd product={product} />

              <Link href={`/${params.lang}/product/${product.id}`}>
                <Avatar
                  alt={product.title}
                  src={product.thumbnail}
                  sx={{
                    mx: 2,
                    width: 76,
                    height: 76,
                  }}
                />
              </Link>

              <Box
                flex="1"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link href={`/${params.lang}/product/${product.slug}`}>
                  <H5 ellipsis fontSize="14px" className="title">
                    {product.title}
                  </H5>
                </Link>

                <Box>
                  <Tiny>
                    {product.size} - {product.color}
                  </Tiny>
                </Box>

                <Box
                  fontWeight={600}
                  fontSize="14px"
                  color="primary.main"
                  mt={0.5}
                >
                  {currency(
                    item.quantity *
                      Number(
                        item.product.price -
                          item.product.price * (item.product.discount / 100)
                      )
                  )}
                </Box>
              </Box>

              <IconButton
                size="small"
                onClick={() => removeItemFromCart({ product })}
                sx={{
                  marginLeft: 2.5,
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </FlexBox>
          );
        })}
      </Box>

      {cartList.length > 0 && (
        <Box p={2.5}>
          <Link href={`/${params.lang}/checkout`} passHref>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              sx={{
                mb: "0.75rem",
                height: "40px",
              }}
              onClick={toggleSidenav}
            >
              Checkout Now ({currency(getTotalPrice)})
            </Button>
          </Link>

          <Link href={`/${params.lang}/cart`} passHref>
            <Button
              fullWidth
              color="primary"
              variant="outlined"
              sx={{
                height: 40,
              }}
              onClick={toggleSidenav}
            >
              View Cart
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};
export default React.memo(MiniCart);
