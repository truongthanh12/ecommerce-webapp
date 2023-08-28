"use client";
import React, { useState } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Card, MenuItem, Select, styled, useTheme } from "@mui/material";
import { H5 } from "@/components/Typography";
import { FlexBetween } from "@/components/flex-box";
import { analyticsChartOptions } from "./chartsOptions";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const categories: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// styled component
const StyledSelect = styled(Select)(({ theme }: { theme?: any }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.grey[600],
  "& fieldset": {
    border: "0 !important",
  },
  "& .MuiSelect-select": {
    padding: 0,
    paddingRight: "8px !important",
  },
}));
const Analytics = () => {
  const theme = useTheme();
  const [selectType, setSelectType] = useState("yearly");
  const series = [
    {
      name: "Sales",
      data: [
        15000, 45000, 12000, 50000, 75000, 13000, 30000, 99000, 75000, 90000,
        55000, 15000,
      ],
    },
    {
      name: "Expense",
      data: [
        1500, 48000, 19000, 59000, 25000, 9000, 36000, 9000, 79000, 70000,
        57000, 5000,
      ],
    },
  ];
  const handleChange = (e: any) => {
    setSelectType(e.target.value as string);
  };

  return (
    <Card
      sx={{
        p: 3,
      }}
    >
      <FlexBetween>
        <H5>Analytics</H5>

        <StyledSelect
          value={selectType}
          IconComponent={() => <KeyboardArrowDown />}
          onChange={handleChange}
        >
          <MenuItem value="yearly">Yearly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="Weekily">Weekily</MenuItem>
        </StyledSelect>
      </FlexBetween>

      {typeof window !== "undefined" && (
        <ReactApexChart
          type="bar"
          height={300}
          series={series}
          options={analyticsChartOptions(theme, categories)}
        />
      )}
    </Card>
  );
};
export default React.memo(Analytics);
