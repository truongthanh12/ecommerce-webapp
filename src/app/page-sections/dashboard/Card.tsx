import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Card } from "@mui/material";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import { H3, H6, Paragraph } from "@/components/Typography";
import React from "react";

// ========================================================
interface PaperProps {
  status?: "up" | "down";
  color?: string;
  title: string;
  amount1?: number;
  amount2?: number;
  percentage: number | string;
  amount?: any;
  children?: React.ReactNode;
  isBasicCard?: boolean;
}
const DashboardCard = ({
  status = "up",
  color = "info.main",
  title,
  amount1,
  amount2,
  percentage,
  amount,
  children,
  isBasicCard,
}: PaperProps) => {
  if (isBasicCard) {
    return (
      <Card
        sx={{
          p: 2,
        }}
      >
        <H6 mb={1} color="grey.600">
          {title}
        </H6>
        <H3 mb={0.3}>{amount1}</H3>

        <FlexBetween>
          <Paragraph fontWeight={500} color="grey.500">
            {amount2}
          </Paragraph>

          <FlexBox alignItems="center" color={color}>
            {status === "up" && <ArrowDropUp />}
            {status === "down" && <ArrowDropDown />}
            <Paragraph fontSize={12}>{percentage}</Paragraph>
          </FlexBox>
        </FlexBetween>
      </Card>
    );
  }
  return (
    <Card
      sx={{
        p: 3,
        pr: 1,
        gap: 2,
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
    >
      <Box flexShrink={0} height="inherit">
        <FlexBox
          flexDirection="column"
          justifyContent="space-between"
          height="inherit"
        >
          <H6 color="grey.600">{title}</H6>

          <Box>
            <H3>{amount}</H3>
            <FlexBox mt={0.3} alignItems="center" color="info.main">
              <ArrowDropUp />
              <Paragraph fontSize={12}>{percentage}</Paragraph>
            </FlexBox>
          </Box>
        </FlexBox>
      </Box>

      <Box
        sx={{
          "& > div": {
            minHeight: "0px !important",
          },
        }}
      >
        {children}
      </Box>
    </Card>
  );
};

export default React.memo(DashboardCard);
