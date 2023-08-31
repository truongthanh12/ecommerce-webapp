"use client";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Box, Card, TextField, styled } from "@mui/material";
import { H1, H6 } from "@/components/Typography";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { setMessage } from "@/redux/features/messageSlice";
import { loading, loginError } from "@/redux/features/authSlice";

export const ErrorMessage = styled("span")(() => ({
  display: "flex",
  justifyContent: "center",
  color: "red",
  marginBottom: "6px",
}));

const schema = yup.object().shape({
  Email: yup.string().email().required(),
});

type FormValues = {
  Email: string;
};
const ResetPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoading, error } = useSelector((state: any) => state.auth);

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const dispatch = useDispatch();

  const onBlur = useCallback(() => {
    setErrorMessage("");
  }, []);

  const triggerResetEmail = async (value: FormValues) => {
    const { Email } = value;
    dispatch(loading());
    await sendPasswordResetEmail(auth, Email)
      .then(() => {
        dispatch(loginError(""));
        dispatch(setMessage({ message: `Sent to your email: ${Email}` }));
      })
      .catch((err) => {
        dispatch(loginError("Do not existed this email."));
        setErrorMessage("Do not existed this email.");
        throw err;
      });
  };

  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">
      <SEO title="Reset Password" />

      <Card
        sx={{
          padding: 4,
          maxWidth: 600,
          marginTop: 4,
          boxShadow: 1,
        }}
      >
        <H1 fontSize={20} fontWeight={700} mb={4} textAlign="center">
          Reset your password
        </H1>

        <FlexBox justifyContent="space-between" flexWrap="wrap" my={2}>
          <form
            style={{
              width: "100%",
            }}
            onSubmit={handleSubmit(triggerResetEmail)}
          >
            <Controller
              name="Email"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  onBlur={onBlur}
                  fullWidth
                  size="small"
                  type="email"
                  variant="outlined"
                  label="Email"
                  name="Email"
                  placeholder="exmple@mail.com"
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                  autoFocus
                />
              )}
            />

            {isDirty && isValid && errorMessage && (
              <ErrorMessage>{errorMessage}</ErrorMessage>
            )}

            <Box
              sx={{
                mt: 2,
              }}
            >
              <LoadingButton
                fullWidth
                type="submit"
                color="primary"
                variant="contained"
                loading={isLoading && !error.message}
                loadingIndicator="Loading…."
                sx={{
                  height: 44,
                }}
                disabled={!isDirty || !isValid || isLoading}
              >
                Reset
              </LoadingButton>
            </Box>
          </form>

          <FlexRowCenter mt="1.25rem" justifyContent="center" width="100%">
            <Box>Back to</Box>
            <Link href="/" passHref>
              <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
                Home
              </H6>
            </Link>
          </FlexRowCenter>
        </FlexBox>
      </Card>
    </FlexRowCenter>
  );
};
export default React.memo(ResetPassword);
