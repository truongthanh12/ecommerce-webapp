import React, { useEffect, useState } from "react";
import { Button, Card, Grid, TextField, styled } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "@/redux/features/messageSlice";
import {
  addVoucherAsync,
  updateVoucherAsync,
  voucherDataForm,
} from "@/redux/features/voucherSlice";
import { currency } from "@/utils/lib";
import { RootState } from "@/redux/store";

// ================================================================

export const ErrorMessage = styled("span")(() => ({
  display: "flex",
  justifyContent: "center",
  color: "red",
  marginBottom: "6px",
  width: "100%",
}));
const schema = yup.object().shape({
  Name: yup
    .string()
    .required()
    .min(8, "Must be exactly 8 digits")
    .max(8, "Must be exactly 8 digits"),
  TotalBill: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .required("Required"),
  DiscountPercent: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .min(0)
    .max(100, "Amount should not be greater than 100"),
  DiscountMax: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable(),
  Amount: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .required("Required"),
});

const VoucherForm = ({ id = "", voucher }: { id?: string; voucher?: any }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch: any = useDispatch();
  const { error } = useSelector((state: RootState) => state.vouchers);
  const { status } = useSelector((state: RootState) => state.statusAdmin);
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      Name: voucher?.name || "",
      TotalBill: voucher?.totalBill || "",
      DiscountPercent: voucher?.discountPercent || "",
      DiscountMax: voucher?.discountMax || "",
      Amount: voucher?.amount || "",
    },
  });

  useEffect(() => {
    if (voucher) {
      reset({
        Name: voucher.name,
        TotalBill: voucher.totalBill,
        DiscountPercent: voucher.discountPercent,
        DiscountMax: voucher.discountMax,
        Amount: voucher.amount,
      });
    }
  }, [reset, voucher]);

  const handleVoucherForm = async (value: {
    Name: string;
    TotalBill: any;
    Amount: number;
    DiscountPercent: number;
    DiscountMax: number;
  }) => {
    const { Name, TotalBill, DiscountPercent, Amount, DiscountMax } = value;
    const data = {
      name: Name || voucher?.name,
      totalBill: TotalBill || voucher?.totalBill,
      discountPercent: DiscountPercent || voucher?.discountPercent || 0,
      amount: Amount || voucher?.amount,
      discountMax: DiscountMax || voucher?.discountMax,
    };

    if (status === "create") {
      await dispatch(addVoucherAsync(voucherDataForm(data, user.docId)));
    }
    if (status === "edit") {
      await dispatch(
        updateVoucherAsync({
          updateVoucher: voucherDataForm(data, user.docId),
          id,
        })
      );
    }
    if (error) {
      setErrorMessage("An error occurred! Please try again.");
      dispatch(
        setMessage({
          message: "An error occurred! Please try again.",
          type: "error",
        })
      );
      return;
    }
    reset();
    dispatch(
      setMessage({
        message:
          status === "create"
            ? "Add new voucher successfully!."
            : "Update voucher successfully!.",
        type: "success",
      })
    );
  };

  return (
    <Card
      sx={{
        p: 6,
      }}
    >
      <form onSubmit={handleSubmit(handleVoucherForm)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="Name"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Code"
                  placeholder="Code...."
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                  autoFocus={status === "create"}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="TotalBill"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  label={"Total Bill >=" + currency(value || "")}
                  placeholder="Total Bill >=..."
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="Amount"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Total number of codes."
                  placeholder="Amount..."
                  type="number"
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <>
              <Controller
                name="DiscountPercent"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    label={"Discount " + " " + (value + "(%)" || "")}
                    placeholder="Discount..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                  />
                )}
              />
              <Controller
                name="DiscountMax"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    sx={{ mt: 3 }}
                    fullWidth
                    type="number"
                    variant="outlined"
                    label={"Discount max" + " " + currency(value || "")}
                    placeholder="Discount max..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                  />
                )}
              />
            </>
          </Grid>

          {isDirty && isValid && errorMessage && (
            <ErrorMessage>{errorMessage}</ErrorMessage>
          )}

          <Grid justifyContent="flex-end" container item xs={12}>
            <Button
              disabled={!isDirty || !isValid}
              variant="contained"
              color="info"
              type="submit"
            >
              Save voucher
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default React.memo(VoucherForm);
