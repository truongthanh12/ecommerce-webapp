"use client"
import Menu from "@mui/icons-material/Menu";
import { Box, styled, useMediaQuery } from "@mui/material";
import Sidenav from "@/components/Sidenav";
import { H2 } from "@/components/Typography";
import { FlexBox } from "@/components/flex-box";
import React from "react";
const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  marginTop: theme.spacing(-2),
  marginBottom: theme.spacing(3),
  "& .headerHold": {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  [theme.breakpoints.up("md")]: {
    "& .sidenav": {
      display: "none",
    },
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

// ==============================================================

const UserDashboardHeader = ({ title, button, navigation, ...props }: any) => {
  const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down("lg"));

  return (
    <StyledBox>
      <FlexBox mt={2} className="headerHold">
        <FlexBox alignItems="center">
          {props.icon && <props.icon color="primary" />}
          <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
            {title}
          </H2>
        </FlexBox>

        <Box className="sidenav">
          <Sidenav position="left" handle={<Menu fontSize="small" />}>
            {navigation}
          </Sidenav>
        </Box>

        {!isTablet && button}
      </FlexBox>

      {isTablet && !!button && <Box mt={2}>{button}</Box>}
    </StyledBox>
  );
};
export default React.memo(UserDashboardHeader);
