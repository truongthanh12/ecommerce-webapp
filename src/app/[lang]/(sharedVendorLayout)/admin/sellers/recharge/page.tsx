"use client";
import { Box, Button, Grid, styled } from "@mui/material";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import { H2 } from "@/components/Typography";
import { currency } from "@/utils/lib";
import TextFieldInput from "@/components/TextField";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { updateUserAsync } from "@/redux/features/authSlice";
import { setMessage } from "@/redux/features/messageSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addChargeAsync } from "@/redux/features/rechargeSlice";
import { serverTimestamp } from "firebase/firestore";
import { RootState } from "@/redux/store";

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

  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.recharge);
  const dispatch: any = useAppDispatch();

  const handleSubmitForm = async (values: { wallet: number }) => {
    const { wallet } = values;
    const data = {
      amount: Number(wallet),
      pending: false,
      createdAt: serverTimestamp(),
      userId: user.docId
    };
    const resultAction = await dispatch(addChargeAsync(data));

    if (updateUserAsync.rejected.match(resultAction)) {
      const errorPayload = resultAction.payload;
      dispatch(
        setMessage({
          message: `Error: ${errorPayload}`,
          type: "error",
        })
      );
    } else {
      dispatch(
        setMessage({
          message: "User recharged is processing.",
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
              type="submit"
              disabled={loading || !isDirty && !isValid}
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
