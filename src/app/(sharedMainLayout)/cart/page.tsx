"use client"
import Link from "next/link";
import { Button, Card, Divider, Grid, TextField } from "@mui/material";
import SEO from "@/components/SEO";
import { Span } from "@/components/Typography";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import ProductCard from "@/components/products/Card";
import CheckoutNavLayout from "@/components/layouts/CheckoutNavLayout";
import { currency } from "@/utils/lib";

const Cart = () => {
  const cartList: any = [];
  const getTotalPrice = () =>
    cartList.reduce(
      (accum: any, item: any) => accum + item.price * item.qty,
      0
    );
  return (
    <CheckoutNavLayout>
      <SEO title="Cart" />

      <Grid container spacing={3}>
        {/* CART PRODUCT LIST */}
        <Grid item md={8} xs={12}>
          {cartList.map((item: any) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </Grid>

        {/* CHECKOUT FORM */}
        <Grid item md={4} xs={12}>
          <Card
            sx={{
              padding: 3,
            }}
          >
            <FlexBetween mb={2}>
              <Span color="grey.600">Total:</Span>

              <Span fontSize={18} fontWeight={600} lineHeight="1">
                {currency(getTotalPrice())}
              </Span>
            </FlexBetween>

            <Divider
              sx={{
                mb: 2,
              }}
            />

            <FlexBox alignItems="center" columnGap={1} mb={2}>
              <Span fontWeight="600">Additional Comments</Span>

              <Span
                p="6px 10px"
                fontSize={12}
                lineHeight="1"
                borderRadius="3px"
                color="primary.main"
                bgcolor="primary.light"
              >
                Note
              </Span>
            </FlexBox>

            <TextField
              variant="outlined"
              rows={6}
              fullWidth
              multiline
              sx={{
                mb: 2,
              }}
            />

            <Divider
              sx={{
                mb: 2,
              }}
            />

            <TextField
              fullWidth
              size="small"
              label="Voucher"
              variant="outlined"
              placeholder="Voucher"
            />

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                mb: 4,
              }}
            >
              Apply Voucher
            </Button>

            <Divider
              sx={{
                mb: 2,
              }}
            />

            <Span fontWeight={600} mb={2} display="block">
              Shipping Estimates
            </Span>
            <Link href="/checkout" passHref legacyBehavior>
              <Button variant="contained" color="primary" fullWidth>
                Checkout Now
              </Button>
            </Link>
         </Card>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  );
};

export default Cart;
