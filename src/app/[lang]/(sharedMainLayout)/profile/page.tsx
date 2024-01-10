"use client";
import Link from "next/link";
import { Person } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import TableRow from "@/components/TableRow";
import { H3, H5, Small } from "@/components/Typography";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import UserDashboardHeader from "@/components/header/UserDashboardHeader";
import CustomerDashboardNavigation from "@/components/layouts/customer-dashboard/Navigations";
import { currency, tryFormatDate } from "@/utils/lib";
import { useSelector } from "react-redux";
import { Fragment, Suspense, useEffect, useMemo } from "react";
import { fetchOrders } from "@/redux/features/orderSlice";
import { useAppDispatch } from "@/redux/hooks";
import { IOrder } from "@/models/Order";
import { INFO_LIST } from "@/data/status";
import BackdropLoading from "@/components/backdrop";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
// ============================================================

export default function Profile() {
  const downMd = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders } = useSelector((state: RootState) => state.orders);
  const dispatch: any = useAppDispatch();
  const params = useParams()

  const ordersAwating = useMemo(
    () => orders.filter((item: IOrder) => item.status === "processing"),
    [orders]
  );
  const ordersCancelled = useMemo(
    () => orders.filter((item: IOrder) => item.status === "cancelled"),
    [orders]
  );
  const ordersDelivered = useMemo(
    () => orders.filter((item: IOrder) => item.status === "delivered"),
    [orders]
  );
  // SECTION TITLE HEADER LINK
  const updatedInfoList = useMemo(() => {
    return INFO_LIST.map((item) => {
      if (item.subtitle.includes("All")) {
        return {
          ...item,
          title: orders.length,
        };
      }
      if (item.subtitle.includes("Awaiting")) {
        return {
          ...item,
          title: ordersAwating.length,
        };
      }
      if (item.subtitle.includes("Delivered")) {
        return {
          ...item,
          title: ordersDelivered.length,
        };
      }
      if (item.subtitle.includes("Cancelled")) {
        return {
          ...item,
          title: ordersCancelled.length,
        };
      }
      return item;
    });
  }, [orders, ordersAwating, ordersDelivered, ordersCancelled]);

  useEffect(() => {
    dispatch(fetchOrders(user.docId));
  }, [dispatch, user.docId]);

  const HEADER_LINK = (
    <Link href={`/${params.lang}/profile/${user.docId}`}>
      <Button
        color="primary"
        sx={{
          px: 4,
          bgcolor: "primary.light",
        }}
      >
        Edit Profile
      </Button>
    </Link>
  );

  if (!user?.uid) {
    return null
  }
  return (
    <Fragment>
      <Suspense fallback={<BackdropLoading />}>
        {/* TITLE HEADER AREA */}
        <UserDashboardHeader
          icon={Person}
          title="My Profile"
          button={HEADER_LINK}
          navigation={<CustomerDashboardNavigation />}
        />

        {/* USER PROFILE INFO */}
        <Box mb={4}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Card
                sx={{
                  display: "flex",
                  p: "14px 32px",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={user.photoURL || "/assets/images/avatars/001-man.svg"}
                  sx={{
                    height: 64,
                    width: 64,
                  }}
                />

                <Box ml={1.5} flex="1 1 0">
                  <FlexBetween flexWrap="wrap">
                    <div>
                      <H5 my="0px">{user.displayName || "No name"}</H5>
                      <FlexBox alignItems="center">
                        <Typography color="grey.600">Balance:</Typography>
                        <Typography ml={0.5} color="primary.main">
                          {currency(user?.wallet || 0)}
                        </Typography>
                      </FlexBox>
                    </div>

                    <Typography color="grey.600" letterSpacing="0.2em">
                      {user.userType && user.userType !== "None"
                        ? user.userType?.toUpperCase() + " USER"
                        : "USER"}
                    </Typography>
                  </FlexBetween>
                </Box>
              </Card>
            </Grid>

            <Grid item md={6} xs={12}>
              <Grid container spacing={4}>
                {updatedInfoList?.map(
                  (item: { title: string; subtitle: string }) => (
                    <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          p: "1rem 1.25rem",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <H3 color="primary.main" my={0} fontWeight={600}>
                          {item.title}
                        </H3>

                        <Small color="grey.600" textAlign="center">
                          {item.subtitle}
                        </Small>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <TableRow
          sx={{
            cursor: "auto",
            p: "0.75rem 1.5rem",
            ...(downMd && {
              alignItems: "start",
              flexDirection: "column",
              justifyContent: "flex-start",
            }),
          }}
        >
          <TableRowItem title="Name" value={user.displayName} />
          <TableRowItem title="Email" value={user.email} />
          <TableRowItem title="Phone" value={user.phoneNumber} />
          {/* <TableRowItem
            title="Birth date"
            value={tryFormatDate(user.birthDate) || ""}
          /> */}
          <TableRowItem title="Address" value={user.address} />
        </TableRow>
      </Suspense>
    </Fragment>
  );
}
const TableRowItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <FlexBox flexDirection="column" p={1}>
      <Small color="grey.600" mb={0.5} textAlign="left">
        {title}
      </Small>
      <span>{value}</span>
    </FlexBox>
  );
};
