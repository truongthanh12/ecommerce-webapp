import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import { Add, Clear, Close, Remove } from "@mui/icons-material";
import LazyImage from "@/components/LazyImage";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import { H5, Paragraph, Tiny } from "@/components/Typography";
import CartBag from "@/components/icons/CartBag";
import { currency } from "@/utils/lib";
import React, { FC } from "react";

// =========================================================

// =========================================================
type TypeMinicart = {
  toggleSidenav: () => void;
};
const MiniCart: FC<TypeMinicart> = ({ toggleSidenav }) => {
  const { palette } = useTheme();
  const cartList: [] = [];
  const handleCartAmountChange = (amount: number, product: any) => () => {
    // dispatch({
    //   type: "CHANGE_CART_AMOUNT",
    //   payload: {
    //     ...product,
    //     qty: amount
    //   }
    // });
  };
  const getTotalPrice = () => {
    return cartList.reduce(
      (accum: number, item: { price: number; qty: number }) =>
        accum + item.price * item.qty,
      0
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
              {cartList.length} item
            </Paragraph>
          </FlexBox>

          <IconButton onClick={toggleSidenav}>
            <Clear />
          </IconButton>
        </FlexBetween>

        <Divider />

        {cartList.length <= 0 && (
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

        {cartList.map((item: any) => (
          <FlexBox
            py={2}
            px={2.5}
            key={item.id}
            alignItems="center"
            borderBottom={`1px solid ${palette.divider}`}
          >
            <FlexBox alignItems="center" flexDirection="column">
              <Button
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(item.qty + 1, item)}
                sx={{
                  height: "32px",
                  width: "32px",
                  borderRadius: "300px",
                }}
              >
                <Add fontSize="small" />
              </Button>

              <Box fontWeight={600} fontSize="15px" my="3px">
                {item.qty}
              </Box>

              <Button
                color="primary"
                variant="outlined"
                disabled={item.qty === 1}
                onClick={handleCartAmountChange(item.qty - 1, item)}
                sx={{
                  height: "32px",
                  width: "32px",
                  borderRadius: "300px",
                }}
              >
                <Remove fontSize="small" />
              </Button>
            </FlexBox>

            <Link href={`/product/${item.id}`}>
              <Avatar
                alt={item.name}
                src={item.imgUrl}
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
              <Link href={`/product/${item.slug}`}>
                <H5 ellipsis fontSize="14px" className="title">
                  {item.name}
                </H5>
              </Link>

              <Tiny color="grey.600">
                {currency(item.price)} x {item.qty}
              </Tiny>

              <Box
                fontWeight={600}
                fontSize="14px"
                color="primary.main"
                mt={0.5}
              >
                {currency(item.qty * item.price)}
              </Box>
            </Box>

            <IconButton
              size="small"
              onClick={handleCartAmountChange(0, item)}
              sx={{
                marginLeft: 2.5,
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </FlexBox>
        ))}
      </Box>

      {cartList.length > 0 && (
        <Box p={2.5}>
          <Link href="/checkout-alternative" passHref>
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
              Checkout Now ({currency(getTotalPrice())})
            </Button>
          </Link>

          <Link href="/cart" passHref>
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
