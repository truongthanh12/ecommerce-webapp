"use client";
import { Box, Button, Grid, styled } from "@mui/material";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import { H2 } from "@/components/Typography";
import { currency } from "@/app/utils/lib";
import TextFieldInput from "@/components/TextField";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { updateUserAsync, updateUserData } from "@/redux/features/authSlice";
import { setMessage } from "@/redux/features/messageSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo } from "react";

const Wrapper = styled("form")(() => ({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  width: "100%",
  marginTop: "20px",
}));

const schema = yup.object().shape({
  wallet: yup.number().required("Wallet is required"),
});
export default function Recharge() {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const { user, isLoading } = useSelector((state: any) => state.auth);
  const dispatch: any = useAppDispatch();

  const handleSubmitForm = async (values: { wallet: number }) => {
    const { wallet } = values;
    const data = { wallet: Number(wallet) };
    const resultAction = await dispatch(
      updateUserAsync({
        updateUser: updateUserData(data, true, user),
        id: user?.docId,
      })
    );

    if (updateUserAsync.rejected.match(resultAction)) {
      const errorPayload = resultAction.payload;
      dispatch(
        setMessage({
          message: `User cannot recharged: ${errorPayload}`,
          type: "error",
        })
      );
    } else {
      dispatch(
        setMessage({
          message: "User recharged successfully",
          type: "success",
        })
      );
    }
  };

  return (
    <Box py={4}>
      <FlexBetween mb={2}>
        <H2>Recharge</H2>
      </FlexBetween>

      <Grid container spacing={2}>
        <Wrapper onSubmit={handleSubmit(handleSubmitForm)}>
          <Controller
            name="wallet"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextFieldInput
                mr={1.5}
                fullWidth
                type="number"
                variant="outlined"
                label={currency(value)}
                value={value}
                onChange={onChange}
                placeholder={currency(4000000)}
                helperText={!!error ? error.message : ""}
                error={!!error?.message}
                autoFocus
              />
            )}
          />

          <FlexBox alignItems="center" gap={2}>
            <Button
              onClick={handleSubmit(handleSubmitForm)}
              disabled={!isDirty && isLoading && !isValid}
              size="medium"
              color="error"
              variant="outlined"
            >
              Submit
            </Button>
          </FlexBox>
        </Wrapper>
      </Grid>
    </Box>
  );
}
