"use client";
import Link from "next/link";
import { format, isValid, parseISO } from "date-fns";
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
import { currency } from "@/utils/lib";
import { useSelector } from "react-redux";
import { Fragment } from "react";
// ============================================================

export default function Profile() {
  const downMd = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const { user } = useSelector((state: any) => state.auth);
  // SECTION TITLE HEADER LINK

  const HEADER_LINK = (
    <Link href={`/profile/${user.docId}`}>
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
  const formatDate = (dateString: string) => {
    // Check if the date string is valid
    if (!dateString || !isValid(parseISO(dateString))) {
      return "Invalid Date";
    }

    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const infoList = [
    {
      title: "16",
      subtitle: "All Orders",
    },
    {
      title: "02",
      subtitle: "Awaiting Payments",
    },
    {
      title: "00",
      subtitle: "Awaiting Shipment",
    },
    {
      title: "01",
      subtitle: "Awaiting Delivery",
    },
  ];
  return (
    <Fragment>
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
                src={user.photoURL}
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
                        {currency(500)}
                      </Typography>
                    </FlexBox>
                  </div>

                  <Typography color="grey.600" letterSpacing="0.2em">
                    {user.userType !== "None" ? user.userType.toUpperCase() + " USER" : ""}
                  </Typography>
                </FlexBetween>
              </Box>
            </Card>
          </Grid>

          <Grid item md={6} xs={12}>
            <Grid container spacing={4}>
              {infoList.map((item) => (
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
              ))}
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
        <TableRowItem
          title="Birth date"
          value={formatDate(user.birthDate) || ""}
        />
        <TableRowItem title="Address" value={user.address} />
      </TableRow>
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
