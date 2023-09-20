"use client";
import Link from "next/link";
import { Button, Card, Divider, Grid, IconButton, styled } from "@mui/material";
import SEO from "@/components/SEO";
import { Span } from "@/components/Typography";
import { FlexBox } from "@/components/flex-box";
import CheckoutNavLayout from "@/components/layouts/CheckoutNavLayout";
import { currency, formatToSlug } from "@/utils/lib";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  selectCartItemsForUser,
} from "@/redux/features/cartSlice";
import Image from "@/app/components/Image";
import { Close } from "@mui/icons-material";
import CartAction from "@/app/components/products/CartAction";
import { IProducts } from "@/app/models/Product";
import { isEmpty } from "lodash";
import NotFound from "@/app/components/not-found";
import CheckoutSummary from "@/page-sections/checkout/CheckoutSummary";
// styled components
const Wrapper = styled(Card)(({ theme }: { theme: any }) => ({
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  position: "relative",
  borderRadius: "10px",
  marginBottom: "1.5rem",
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
  "@media only screen and (max-width: 425px)": {
    flexWrap: "wrap",
    img: {
      height: "auto",
      minWidth: "100%",
    },
  },
}));

const Cart = () => {
  const { user } = useSelector((state: any) => state.auth);
  const cartList: any = useSelector(selectCartItemsForUser(user.docId));
  const dispatch: any = useDispatch();

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
    <CheckoutNavLayout>
      <SEO title="Cart" />
      {!isEmpty(cartList) ? (
        <Grid container spacing={3}>
          {/* CART PRODUCT LIST */}
          <Grid item md={8} xs={12}>
            {cartList.map((item: any) => {
              const { quantity, color, size, product } = item || {};
              const { title, thumbnail, price, id, discount } = product || {};
              return (
                <Wrapper key={id}>
                  <Image
                    alt={title}
                    width={140}
                    height={140}
                    display="block"
                    src={thumbnail}
                  />

                  <IconButton
                    size="small"
                    onClick={() => removeItemFromCart({ product })}
                    sx={{
                      position: "absolute",
                      right: 15,
                      top: 15,
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>

                  <FlexBox p={2} rowGap={2} width="100%" flexDirection="column">
                    <Link href={`/product/${formatToSlug(title)}`}>
                      <Span ellipsis fontWeight="600" fontSize={18}>
                        {title}
                      </Span>
                    </Link>
                    <FlexBox gap={1} flexWrap="wrap" alignItems="center">
                      {size} - {color}
                    </FlexBox>
                    <FlexBox gap={1} flexWrap="wrap" alignItems="center">
                      <Span color="grey.600">
                        {currency(Number(price - price * (discount / 100)))}x{" "}
                        {quantity}
                      </Span>

                      <Span fontWeight={600} color="primary.main">
                        {currency(
                          Number(price - price * (discount / 100)) * quantity
                        )}
                      </Span>
                    </FlexBox>

                    <FlexBox alignItems="center">
                      <CartAction product={product} />
                    </FlexBox>
                  </FlexBox>
                </Wrapper>
              );
            })}
          </Grid>

          {/* CHECKOUT FORM */}
          <Grid item md={4} xs={12}>
            <Card>
              <Divider
                sx={{
                  mb: 2,
                }}
              />

              <CheckoutSummary />

              <Divider
                sx={{
                  mb: 2,
                }}
              />

              <Link href="/checkout" passHref legacyBehavior>
                <Button variant="contained" color="primary" fullWidth>
                  Checkout Now
                </Button>
              </Link>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <NotFound />
      )}
    </CheckoutNavLayout>
  );
};

export default Cart;
