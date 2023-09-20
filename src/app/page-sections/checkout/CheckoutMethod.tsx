import { Paragraph } from "@/app/components/Typography";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";

const CheckoutMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const handlePaymentMethodChange = ({ target: { name } }: any) => {
    setPaymentMethod(name);
  };

  return (
    <Fragment>
      <Divider
        sx={{
          mt: 3,
          mb: 4,
        }}
      />
      <Typography fontWeight="600" mb={4}>
        Shipping information
      </Typography>

      <FormControlLabel
        name="cod"
        label={<Paragraph fontWeight={600}>Cash On Delivery</Paragraph>}
        onChange={handlePaymentMethodChange}
        control={
          <Radio
            checked={paymentMethod === "cod"}
            color="primary"
            size="small"
          />
        }
      />

      <Divider
        sx={{
          pb: 1.5,
          mb: 2
        }}
      />

      <FormControlLabel
        sx={{
          mb: 3,
        }}
        name="credit-card"
        label={<Paragraph fontWeight={600}>Credit Card</Paragraph>}
        onChange={handlePaymentMethodChange}
        control={
          <Radio
            checked={paymentMethod === "credit-card"}
            color="primary"
            size="small"
          />
        }
      />

      {paymentMethod === "credit-card" && (
        <>
          <Box mb={3}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField fullWidth name="card_no" label="Card Number" />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="exp_date"
                  label="Exp Date"
                  placeholder="MM/YY"
                />
              </Grid>
            </Grid>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            sx={{
              mb: 4,
            }}
          >
            Submit
          </Button>

          <Divider
            sx={{
              mb: 3,
              mx: -4,
            }}
          />
        </>
      )}
    </Fragment>
  );
};

export default React.memo(CheckoutMethod);
