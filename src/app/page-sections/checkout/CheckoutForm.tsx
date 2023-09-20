"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
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
import { FlexBox } from "@/app/components/flex-box";
import { Span } from "@/app/components/Typography";
import CheckoutMethod from "./CheckoutMethod";
const CheckoutForm = () => {
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const handleCheckboxChange =
    (values: any, setFieldValue: any) => (e: any, _: any) => {
      const checked = e.currentTarget.checked;
      setSameAsShipping(checked);
      setFieldValue("same_as_shipping", checked);
      setFieldValue("billing_name", checked ? values.shipping_name : "");
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
            <TextField
              size="medium"
              fullWidth
              type="text"
              name="name"
              sx={{
                mb: 3,
              }}
              label="Full Name"
            />
            <TextField
              size="medium"
              fullWidth
              type="text"
              name="phone"
              sx={{
                mb: 3,
              }}
              label="Phone"
            />
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField
              size="medium"
              fullWidth
              type="email"
              sx={{
                mb: 3,
              }}
              name="shipping_email"
              label="Email Address"
            />
            <FormControl sx={{ width: "100%" }}>
              <FormLabel sx={{ color: "black" }} id="radio-buttons-group-label">
                Are you in city?
              </FormLabel>
              <RadioGroup
                aria-labelledby="radio-buttons-group-label"
                defaultValue="yes"
                name="radio-buttons-group"
                sx={{ flexDirection: "row" }}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
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
            <TextField
              variant="outlined"
              rows={6}
              fullWidth
              multiline
              sx={{
                mb: 2,
              }}
            />
          </Grid>
        </Grid>
        <CheckoutMethod />
      </Card>

      <Grid container spacing={6}>
        <Grid item sm={6} xs={12}>
          <Link href="/cart" passHref>
            <Button variant="outlined" color="primary" type="button" fullWidth>
              Back to Cart
            </Button>
          </Link>
        </Grid>

        <Grid item sm={6} xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Proceed to Checkout
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default React.memo(CheckoutForm);
