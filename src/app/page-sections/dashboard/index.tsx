'use client'
import { Box, Grid } from "@mui/material";
import Card from "./Card";
import Section from "./Section";
import WishCard from "./WishCard";
import Analytics from "./Analytics";
import RecentPurchase from "./RecentPurchase";
import StockOutProducts from "./StockOutProducts";
import {
  cardList,
  recentPurchase,
  stockOutProducts,
} from "@/data/dashboard-data";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  return (
    <Box py={4}>
      <Grid container spacing={3}>
        {/* WISHING CARD */}
        <Grid item md={6} xs={12}>
          <WishCard user={user} />
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
  );
};

export default Dashboard;
