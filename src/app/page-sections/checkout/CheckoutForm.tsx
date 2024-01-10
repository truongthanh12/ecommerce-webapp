"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@/components/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FlexBox } from "@/components/flex-box";
import { Span } from "@/components/Typography";
import CheckoutMethod from "./CheckoutMethod";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextFieldInput from "@/components/TextField";
import { IUser } from "@/models/User";
import { useAppDispatch } from "@/redux/hooks";
import { setMessage } from "@/redux/features/messageSlice";
import { clearItemsInCart } from "@/redux/features/cartSlice";
import { ICart, IOrder } from "@/models/Order";
import { addOrdersSync } from "@/redux/features/orderSlice";
import { updateProductQuantities } from "@/redux/features/productSlice";
import useCustomRouter from "@/hooks/usePushRouter";
import { formatTimestamp } from "@/app/utils/lib";
import { useParams } from "next/navigation";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  name: yup.string().required("Name is required"),
  note: yup.string().max(255),
  address: yup.string().required().max(126),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone is required"),
  isInCity: yup.string().required("Please select a city"),
});

const CheckoutForm = ({
  user,
  cartList,
  total,
}: {
  total: number;
  cartList: Partial<ICart>[];
  user: IUser;
}) => {
  const dispatch: any = useAppDispatch();
  const { pushRouter } = useCustomRouter();
  const params = useParams()

  const getIdList = useMemo(() => cartList.map((cart: any) => cart.product.id), [cartList])
  const getQuantityList = useMemo(() => cartList.map((cart: any) => cart.quantity), [cartList])

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: user.displayName,
      email: user.email,
      address: user.address,
      phone: "",
      note: "",
      isInCity: "yes",
    },
  });

  const handleSubmitForm = async (values: Partial<IOrder>) => {
    const { name, email, phone, note, isInCity, address } = values || {};

    const order = {
      name,
      address,
      email,
      phone,
      note,
      isInCity,
      userId: user.docId,
      total,
      createdAt: formatTimestamp(),
      status: "processing",
    };

    try {
      const mergedData = {
        ...order,
        cartList,
      };
      dispatch(addOrdersSync(mergedData));
      pushRouter("order-complete");
      dispatch(setMessage({ message: "Your order is successfully!", type: "success" }));
      dispatch(clearItemsInCart(user.docId || ""));
      dispatch(updateProductQuantities(getIdList, getQuantityList))
    } catch (error) {
      dispatch(setMessage({ message: "Your order is fail with " + error, type: "error" }));
    }
  };

  return (
    <form>
      <Card
        sx={{
          mb: 4,
          p: 2,
        }}
      >
        <Typography fontWeight="600" mb={2}>
          Shipping information
        </Typography>

        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <Controller
              name="name"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextFieldInput
                  mb={1.5}
                  fullWidth
                  variant="outlined"
                  label="Name"
                  placeholder="Your Name..."
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                  autoFocus
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextFieldInput
                  mb={1.5}
                  fullWidth
                  variant="outlined"
                  label="Phone"
                  type="number"
                  placeholder="Your Phone..."
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                />
              )}
            />
          </Grid>

          <Grid item sm={6} xs={12}>
            <Controller
              name="email"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextFieldInput
                  mb={3.5}
                  fullWidth
                  variant="outlined"
                  label="Email"
                  placeholder="example@gmail.com"
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                />
              )}
            />
            <FormControl sx={{ width: "100%" }}>
              <FormLabel sx={{ color: "black" }} id="radio-buttons-group-label">
                Do you want delivery inside the city?
              </FormLabel>
              <Controller
                name="isInCity"
                control={control}
                defaultValue="yes"
                render={({ field }) => (
                  <RadioGroup
                    {...field} // Spread field props
                    aria-labelledby="radio-buttons-group-label"
                    name="radio-buttons-group"
                    sx={{ flexDirection: "row" }}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextFieldInput
                  mb={2}
                  fullWidth
                  variant="outlined"
                  label="Address"
                  placeholder="Your address"
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
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
            <Controller
              name="note"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  rows={6}
                  fullWidth
                  multiline
                  variant="outlined"
                  label="Note"
                  placeholder="Note...."
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                />
              )}
            />
          </Grid>
        </Grid>
        <CheckoutMethod />
      </Card>

      <Grid container spacing={6}>
        <Grid item sm={6} xs={12}>
          <Link href={`/${params.lang}/cart`} passHref>
            <Button variant="outlined" color="primary" type="button" fullWidth>
              Back to Cart
            </Button>
          </Link>
        </Grid>

        <Grid item sm={6} xs={12}>
          <Button
            onClick={handleSubmit(handleSubmitForm)}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={!isDirty || !isValid}
          >
            Proceed to Checkout
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default React.memo(CheckoutForm);
