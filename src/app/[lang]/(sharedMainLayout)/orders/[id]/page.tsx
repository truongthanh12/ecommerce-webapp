"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Done, ShoppingBag } from "@mui/icons-material";
import { Avatar, Box, Button, Card, Typography, styled } from "@mui/material";
import Delivery from "@/components/icons/Delivery";
import PackageBox from "@/components/icons/PackageBox";
import TruckFilled from "@/components/icons/TruckFilled";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import UserDashboardHeader from "@/components/header/UserDashboardHeader";
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "@/components/layouts/customer-dashboard/Navigations";
import useWindowSize from "@/hooks/useWindowSize";
import { calculateFutureDate, tryFormatDate } from "@/utils/lib";
import { doc, getDoc } from "firebase/firestore";
import db from "@/firebase";
import { IOrder } from "@/models/Order";
import Link from "next/link";
import OrderedProductList from "@/page-sections/orders/OrderedProductList";
import OrderedSummary from "@/page-sections/orders/OrderedSummary";
import { useParams } from "next/navigation";

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
  params: { id: string, lang: string };
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
  const localesParams = useParams();

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
  const stepIconList = [PackageBox, TruckFilled, Delivery];
  const breakpoint = 350;
  const statusIndex = useMemo(() => {
    const orderStatusList = [
      "packed",
      "processing",
      "shipping",
      "delivered",
      "cancelled",
    ];
    if (orderStatus === "cancelled") return 0;
    return orderStatusList.indexOf(orderStatus || "processing");
  }, [orderStatus]);

  // SECTION TITLE HEADER
  const HEADER_BUTTON = (
    <Link href={`/${localesParams.lang}/orders`} passHref>
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

  const deliveredDate = useMemo(
    () =>
      order?.updatedDeliveredAt?.seconds
        ? new Date(order.updatedDeliveredAt.seconds * 1000)
        : null,
    [order?.updatedDeliveredAt?.seconds]
  );
  console.log(order);

  const formatDeliveredDate = useMemo(
    () => (deliveredDate ? calculateFutureDate(deliveredDate, 0) : ""),
    [deliveredDate]
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
      <OrderedProductList
        order={order}
        formattedDate={formattedDate}
        futureDate={formatDeliveredDate}
        params={params}
      />

      {/* SHIPPING AND ORDER SUMMERY */}
      <OrderedSummary order={order} />
    </CustomerDashboardLayout>
  );
};

export default React.memo(OrderDetails);
