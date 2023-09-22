"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Done, ShoppingBag } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import TableRow from "@/components/TableRow";
import Delivery from "@/components/icons/Delivery";
import PackageBox from "@/components/icons/PackageBox";
import TruckFilled from "@/components/icons/TruckFilled";
import { H5, H6, Paragraph } from "@/components/Typography";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import UserDashboardHeader from "@/components/header/UserDashboardHeader";
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "@/components/layouts/customer-dashboard/Navigations";
import useWindowSize from "@/hooks/useWindowSize";
import {
  calculateFutureDate,
  currency,
  formatToSlug,
  tryFormatDate,
} from "@/utils/lib";
import { doc, getDoc } from "firebase/firestore";
import db from "@/firebase";
import { IOrder } from "@/app/models/Order";
import Link from "next/link";

// styled components
const StyledFlexbox = styled(FlexBetween)(({ theme }) => ({
  flexWrap: "wrap",
  marginTop: "2rem",
  marginBottom: "2rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
  "& .line": {
    height: 4,
    minWidth: 50,
    flex: "1 1 0",
    [theme.breakpoints.down("sm")]: {
      flex: "unset",
      height: 50,
      minWidth: 4,
    },
  },
}));
// =============================================================
interface OrderProps {
  params: { id: string };
}
async function getOrderById(id = "") {
  try {
    const orderDocRef = doc(db, "orders", id);
    const orderDocSnapshot = await getDoc(orderDocRef);

    if (orderDocSnapshot.exists()) {
      const orderData = orderDocSnapshot.data();
      return orderData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
const OrderDetails = ({ params }: OrderProps) => {
  const [order, setOrder] = useState<Partial<IOrder>>({});

  useEffect(() => {
    // Define an async function
    async function fetchData() {
      const getOrder: any = await getOrderById(params.id);
      setOrder(getOrder);
    }

    // Call the async function
    fetchData();
  }, [params.id]);
  const width = useWindowSize();

  const orderStatus = useMemo(() => order.status, [order.status]);
  const orderStatusList = ["shipping", "delivering", "complete"];
  const stepIconList = [PackageBox, TruckFilled, Delivery];
  const breakpoint = 350;
  const statusIndex = orderStatusList.indexOf(orderStatus || "processing");

  // SECTION TITLE HEADER
  const HEADER_BUTTON = (
    <Link href="/orders" passHref>
      <Button
        color="primary"
        sx={{
          bgcolor: "primary.light",
          px: 4,
        }}
      >
        Back
      </Button>
    </Link>
  );

  const formattedDate = useMemo(
    () => (order?.createdAt ? tryFormatDate(order?.createdAt) : ""),
    [order?.createdAt]
  );

  const orderDate = useMemo(
    () =>
      order?.createdAt?.seconds
        ? new Date(order.createdAt.seconds * 1000)
        : null,
    [order?.createdAt?.seconds]
  );

  const futureDate = useMemo(
    () => (orderDate ? calculateFutureDate(orderDate) : ""),
    [orderDate]
  );

  return (
    <CustomerDashboardLayout>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        icon={ShoppingBag}
        title="Order Details"
        navigation={<CustomerDashboardNavigation />}
        button={HEADER_BUTTON}
      />

      {/* ORDER PROGRESS AREA */}
      <Card
        sx={{
          p: "2rem 1.5rem",
          mb: "30px",
        }}
      >
        <StyledFlexbox>
          {stepIconList.map((Icon, ind) => (
            <Fragment key={ind}>
              <Box position="relative">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: ind <= statusIndex ? "primary.main" : "grey.300",
                    color: ind <= statusIndex ? "grey.white" : "primary.main",
                  }}
                >
                  <Icon
                    color="inherit"
                    sx={{
                      fontSize: "32px",
                    }}
                  />
                </Avatar>

                {ind < statusIndex && (
                  <Box position="absolute" right="0" top="0">
                    <Avatar
                      sx={{
                        width: 22,
                        height: 22,
                        bgcolor: "grey.200",
                        color: "success.main",
                      }}
                    >
                      <Done
                        color="inherit"
                        sx={{
                          fontSize: "1rem",
                        }}
                      />
                    </Avatar>
                  </Box>
                )}
              </Box>

              {ind < stepIconList.length - 1 && (
                <Box
                  className="line"
                  bgcolor={ind < statusIndex ? "primary.main" : "grey.300"}
                />
              )}
            </Fragment>
          ))}
        </StyledFlexbox>

        <FlexBox justifyContent={width < breakpoint ? "center" : "flex-end"}>
          <Typography
            p="0.5rem 1rem"
            textAlign="center"
            borderRadius="300px"
            color="primary.main"
            bgcolor="primary.light"
          >
            Estimated Delivery Date <b>{futureDate}</b>
          </Typography>
        </FlexBox>
      </Card>

      {/* ORDERED PRODUCT LIST */}
      <Card
        sx={{
          p: 0,
          mb: "30px",
        }}
      >
        <TableRow
          sx={{
            p: "12px",
            borderRadius: 0,
            boxShadow: "none",
            bgcolor: "grey.200",
          }}
        >
          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize={14} color="grey.600" mr={0.5}>
              Order ID:
            </Typography>

            <Typography fontSize={14}>
              #
              {order?.id?.substring(0, 10) ||
                (Math.random() * 9999997).toFixed(0)}
            </Typography>
          </FlexBox>

          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize={14} color="grey.600" mr={0.5}>
              Placed on:
            </Typography>

            <Typography fontSize={14}>{formattedDate}</Typography>
          </FlexBox>

          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize={14} color="grey.600" mr={0.5}>
              Delivered on:
            </Typography>

            <Typography fontSize={14}>{futureDate}</Typography>
          </FlexBox>
        </TableRow>

        <Box py={1}>
          {order?.cartList?.map((item: any, ind: number) => (
            <FlexBox
              px={2}
              py={1}
              flexWrap="wrap"
              alignItems="center"
              key={ind}
            >
              <FlexBox flex="2 2 260px" m={0.75} alignItems="center">
                <Avatar
                  src={item.product.thumbnail}
                  sx={{
                    height: 64,
                    width: 64,
                  }}
                />
                <Box ml={2.5}>
                  <H6 my="0px">{item.product.name}</H6>

                  <Typography fontSize="14px" color="grey.600">
                    {currency(item.product.price)} x {item.quantity}
                  </Typography>
                </Box>
              </FlexBox>

              <FlexBox flex="1 1 260px" m={0.75} alignItems="center">
                <Typography fontSize="14px" color="grey.600">
                  Product properties: {item.product.color}, {item.product.size}
                </Typography>
              </FlexBox>

              <FlexBox flex="160px" m={0.75} alignItems="center">
                <Link href={`/product/${formatToSlug(item.product.title)}`}>
                  <Button variant="text" color="primary">
                    <Typography fontSize="14px">Write a Review</Typography>
                  </Button>
                </Link>
              </FlexBox>
            </FlexBox>
          ))}
        </Box>
      </Card>

      {/* SHIPPING AND ORDER SUMMERY */}
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
    </CustomerDashboardLayout>
  );
};

export default React.memo(OrderDetails);
