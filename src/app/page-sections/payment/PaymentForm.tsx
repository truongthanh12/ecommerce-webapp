"use client"
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { Box, Button, Divider, Grid, TextField } from "@mui/material";
import useWindowSize from "@/hooks/useWindowSize";
import Card from "@/components/Card";
const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const width = useWindowSize();
  const isMobile = width < 769;

  return (
    <Fragment>
      <Card
        sx={{
          mb: 4,
        }}
      >
        {paymentMethod === "credit-card" && (
          <form>
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
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth name="name" />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField fullWidth name="name" />
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
          </form>
        )}
      </Card>

      <Grid container spacing={7}>
        <Grid item sm={6} xs={12}>
          <Link href="/checkout" passHref>
            <Button variant="outlined" color="primary" type="button" fullWidth>
              Back to checkout details
            </Button>
          </Link>
        </Grid>

        <Grid item sm={6} xs={12}>
          <Link href="/orders" passHref>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Review
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default React.memo(PaymentForm);
