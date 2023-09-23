import Card from "@/app/components/Card";
import { H5, H6, Paragraph } from "@/app/components/Typography";
import { FlexBetween } from "@/app/components/flex-box";
import { IOrder } from "@/app/models/Order";
import { currency } from "@/app/utils/lib";
import { Grid, Typography } from "@mui/material";
import React from "react";

const OrderedSummary = ({ order }: { order: Partial<IOrder> }) => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={6} md={6} xs={12}>
        <Card
          sx={{
            p: "20px 30px",
          }}
        >
          <H5 mt={0} mb={2}>
            Shipping Address
          </H5>

          <Paragraph fontSize={14} my={0}>
            {order?.address}
          </Paragraph>
        </Card>
      </Grid>

      <Grid item lg={6} md={6} xs={12}>
        <Card
          sx={{
            p: "20px 30px",
          }}
        >
          <FlexBetween mb={2}>
            <H6 my="0px">Total</H6>
            <H6 my="0px">{currency(order?.total)}</H6>
          </FlexBetween>

          <Typography fontSize={14}>Cash on Delivery</Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

export default React.memo(OrderedSummary);
