"use client"
import Link from "next/link";
import React, { useState } from "react";
import { Button, Checkbox, Grid, TextField, Typography } from "@mui/material";
import Card from "@/components/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import countryList from "@/data/countryList";
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
        }}
      >
        <Typography fontWeight="600" mb={2}>
          Shipping Address
        </Typography>

        <Grid container spacing={6}>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              sx={{
                mb: 2,
              }}
              label="Full Name"
            />
            <TextField
              fullWidth
              sx={{
                mb: 2,
              }}
            />
            <TextField
              fullWidth
              type="number"
              sx={{
                mb: 2,
              }}
              label="Zip Code"
              name="shipping_zip"
            />
            <TextField fullWidth label="Address 1" />
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              type="email"
              sx={{
                mb: 2,
              }}
              name="shipping_email"
              label="Email Address"
            />
            <TextField
              fullWidth
              sx={{
                mb: 2,
              }}
              label="Company"
              name="shipping_company"
            />

            <TextField fullWidth label="Address 2" name="shipping_address2" />
          </Grid>
        </Grid>
      </Card>

      <Card
        sx={{
          mb: 4,
        }}
      >
        <Typography fontWeight="600" mb={2}>
          Billing Address
        </Typography>

        <FormControlLabel
          label="Same as shipping address"
          control={<Checkbox size="small" color="secondary" />}
          sx={{
            zIndex: 1,
            position: "relative",
            mb: sameAsShipping ? "" : "1rem",
          }}
        />

        {!sameAsShipping && (
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                sx={{
                  mb: 2,
                }}
                label="Full Name"
                name="billing_name"
              />
              <TextField
                fullWidth
                sx={{
                  mb: 2,
                }}
                label="Phone Number"
                name="billing_contact"
              />
            </Grid>
          </Grid>
        )}
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
            Proceed to Payment
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
const initialValues = {
  shipping_zip: "",
  shipping_name: "",
  shipping_email: "",
  shipping_contact: "",
  shipping_company: "",
  shipping_address1: "",
  shipping_address2: "",
  shipping_country: countryList[229],
  billing_zip: "",
  billing_name: "",
  billing_email: "",
  billing_contact: "",
  billing_company: "",
  billing_address1: "",
  billing_address2: "",
  billing_country: countryList[229],
};

export default React.memo(CheckoutForm);
