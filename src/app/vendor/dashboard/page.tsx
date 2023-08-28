"use client";
import { Box, Grid } from "@mui/material";
import Card from "@/page-sections/dashboard/Card";
import Section from "@/page-sections/dashboard/Section";
import WishCard from "@/page-sections/dashboard/WishCard";
import Analytics from "@/page-sections/dashboard/Analytics";
import RecentPurchase from "@/page-sections/dashboard/RecentPurchase";
import VendorDashboardLayout from "@/components/layouts/vendor-dashboard";
import StockOutProducts from "@/page-sections/dashboard/StockOutProducts";
import {
  cardList,
  recentPurchase,
  stockOutProducts,
} from "@/data/dashboard-data";
import Head from "next/head";

// =============================================================================
VendorDashboard.getLayout = function getLayout(page: any) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================
interface PapgeProp {
  cardList: any;
  recentPurchase: any;
  stockOutProducts: any;
}
export default function VendorDashboard() {
  return (
    <>
      <Head>
        <title>Dashboard Ecommerce web</title>
      </Head>
      <Box py={4}>
        <Grid container spacing={3}>
          {/* WISHING CARD */}
          <Grid item md={6} xs={12}>
            <WishCard />
          </Grid>

          {/* ALL TRACKING CARDS */}
          <Grid container item md={6} xs={12} spacing={3}>
            {cardList.map((item: any) => (
              <Grid item md={6} sm={6} xs={12} key={item.id}>
                <Card
                  title={item.title}
                  color={item.color}
                  amount1={item.amount1}
                  amount2={item.amount2}
                  percentage={item.percentage}
                  status={item.status === "down" ? "down" : "up"}
                />
              </Grid>
            ))}
          </Grid>

          {/* SALES AREA */}
          <Grid item xs={12}>
            <Section />
          </Grid>

          {/* ANALYTICS AREA */}
          <Grid item xs={12}>
            <Analytics />
          </Grid>

          {/* RECENT PURCHASE AREA */}
          <Grid item md={7} xs={12}>
            <RecentPurchase data={recentPurchase} />
          </Grid>

          {/* STOCK OUT PRODUCTS */}
          <Grid item md={5} xs={12}>
            <StockOutProducts data={stockOutProducts} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
