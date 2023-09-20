"use client";
import { Button, Divider, TextField, Typography } from "@mui/material";
import Card from "@/components/Card";
import { FlexBetween } from "@/components/flex-box";
import { currency } from "@/utils/lib";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCartItemsForUser } from "@/redux/features/cartSlice";

const CheckoutSummary = ({ isOnlyInfo = false }: { isOnlyInfo?: boolean }) => {
  const { user } = useSelector((state: any) => state.auth);
  const cartList: any = useSelector(selectCartItemsForUser(user.docId));

  const getTotalPriceDiscount = useMemo(() => {
    return cartList.reduce((accum: number, item: any) => {
      return (
        accum +
        Number(
          item.product.price -
            item.product.price * (item.product.discount / 100)
        ) *
          item.quantity +
        item.product.price * 0.1 +
        30000
      );
    }, 0);
  }, [cartList]);

  const getTotalPrice = useMemo(() => {
    return cartList.reduce((accum: number, item: any) => {
      return accum + item.product.price * item.quantity;
    }, 0);
  }, [cartList]);

  return (
    <Card sx={{ padding: 2.5 }}>
      <FlexBetween mb={2}>
        <Typography color="grey.600">Subtotal:</Typography>
        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          {currency(getTotalPrice)}
        </Typography>
      </FlexBetween>

      <FlexBetween mb={2}>
        <Typography color="grey.600">Shipping:</Typography>
        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          {currency(30000)}
        </Typography>
      </FlexBetween>

      <FlexBetween mb={2}>
        <Typography color="grey.600">Tax:</Typography>
        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          {currency(getTotalPrice * 0.1)}
        </Typography>
      </FlexBetween>

      <FlexBetween mb={3}>
        <Typography color="grey.600">Discount:</Typography>
        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          {currency(
            getTotalPrice -
              (getTotalPriceDiscount - 30000 - getTotalPrice * 0.1)
          )}
        </Typography>
      </FlexBetween>

      <Divider
        sx={{
          mb: "1rem",
        }}
      />

      <Typography
        fontSize="25px"
        fontWeight="600"
        lineHeight="1"
        textAlign="right"
        mb={3}
        color="primary.main"
      >
        {currency(getTotalPriceDiscount)}
      </Typography>
      {isOnlyInfo && (
        <>
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
            }}
          >
            Apply Voucher
          </Button>
        </>
      )}
    </Card>
  );
};
export default React.memo(CheckoutSummary);
