"use client";
import { Button, Divider, TextField, Typography } from "@mui/material";
import Card from "@/components/Card";
import { FlexBetween } from "@/components/flex-box";
import { currency } from "@/utils/lib";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IVoucher } from "@/models/Voucher";
import { useAppDispatch } from "@/redux/hooks";
import { setMessage } from "@/redux/features/messageSlice";
import { fetchVouchers } from "@/redux/features/voucherSlice";

const schema = yup.object().shape({
  voucher: yup
    .string()
    .min(8, "Must be exactly 8 digits")
    .max(8, "Must be exactly 8 digits"),
});

const CheckoutSummary = ({
  isOnlyInfo = false,
  vouchers,
  foundVoucher,
  getPriceDiscount,
  getTotalPrice,
  getTotalPriceDiscount,
  totalVoucherDeduction,
  userType,
  calcCodeVoucher,
  voucher,
  setVoucher,
}: any) => {
  const dispatch: any = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      voucher: voucher,
    },
  });

  const handleSubmitVoucher = (values: { voucher: string }) => {
    const { voucher } = values;
    const foundVoucher = vouchers.find((v: IVoucher) => v.name === voucher);
    if (getTotalPrice < foundVoucher?.totalBill + 1) {
      dispatch(
        setMessage({
          message: "The total bill is not enough to qualify for the voucher!",
          type: "error",
        })
      );
      return;
    }
    if (foundVoucher) {
      dispatch(
        setMessage({
          message: "Your voucher code applied successfully.",
          type: "success",
        })
      );
      setVoucher(voucher);
    } else {
      dispatch(
        setMessage({
          message: "Not found your voucher code, please check again!",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (foundVoucher) {
      if (getTotalPrice < foundVoucher.totalBill + 1) {
        setVoucher("");
      }
    }
  }, [getTotalPrice, foundVoucher, setVoucher]);

  useEffect(() => {
    dispatch(fetchVouchers());
  }, [dispatch]);

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
        <Typography color="primary">Discount:</Typography>
        <Typography
          color="primary"
          fontSize="18px"
          fontWeight="600"
          lineHeight="1"
        >
          -{currency(getPriceDiscount)}
        </Typography>
      </FlexBetween>

      <FlexBetween mb={3}>
        <Typography color="primary">Discount Voucher:</Typography>
        <Typography
          color="primary"
          fontSize="18px"
          fontWeight="600"
          lineHeight="1"
        >
          -{currency(totalVoucherDeduction)}
        </Typography>
      </FlexBetween>
      {voucher && (
        <FlexBetween mb={3}>
          <Typography color="primary">Code Voucher:</Typography>
          <Typography
            color="primary"
            fontSize="18px"
            fontWeight="600"
            lineHeight="1"
          >
            -{currency(calcCodeVoucher)}
          </Typography>
        </FlexBetween>
      )}
      {userType && (
        <FlexBetween mb={3}>
          <Typography color="primary">Discount Shipping</Typography>
          <Typography
            color="primary"
            fontSize="18px"
            fontWeight="600"
            lineHeight="1"
          >
            -
            {currency(
              userType === "Premium" ? 20 : userType === "Gold" ? 15 : 10
            )}
            K
          </Typography>
        </FlexBetween>
      )}

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

          <Controller
            name="voucher"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                variant="outlined"
                label="Code"
                placeholder="Code...."
                onChange={onChange}
                helperText={!!error ? error.message : ""}
                error={!!error?.message}
                value={value || ""}
              />
            )}
          />

          <Button
            onClick={handleSubmit(handleSubmitVoucher)}
            variant="outlined"
            color="primary"
            fullWidth
            disabled={!isDirty && !isValid}
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
