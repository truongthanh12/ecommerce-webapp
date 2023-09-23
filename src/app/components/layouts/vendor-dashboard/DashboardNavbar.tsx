import { useRouter } from "next/navigation";
import { Search } from "@mui/icons-material";
import { Box, Button, Typography, styled, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import InputBase from "@mui/material/InputBase";
import Globe from "@/components/icons/Globe";
import Toggle from "@/components/icons/Toggle";
import AccountPopover from "./popovers/AccountPopover";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import NotificationsPopover from "./popovers/NoficationPopover";
import React from "react";
import { useSelector } from "react-redux";
import { Span } from "@/components/Typography";

// custom styled components
const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  zIndex: 11,
  paddingTop: "1rem",
  paddingBottom: "1rem",
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[2],
  color: theme.palette.text.primary,
}));
const StyledToolBar = styled(Toolbar)({
  "@media (min-width: 0px)": {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "auto",
  },
});
const ToggleWrapper = styled(FlexRowCenter)(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  cursor: "pointer",
  borderRadius: "8px",
  backgroundColor: theme.palette.grey[100],
}));
const CustomButton = styled(Button)(({ theme }) => ({
  minHeight: 40,
  flexShrink: 0,
  marginLeft: 16,
  padding: "0 20px",
  borderRadius: "8px",
  backgroundColor: theme.palette.grey[100],
  [theme.breakpoints.down("xs")]: {
    display: "none",
  },
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: 200,
  padding: "5px 10px",
  borderRadius: "8px",
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.grey[100],
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

// ===================================================================

const DashboardNavbar = ({ handleDrawerToggle }: any) => {
  const router = useRouter();
  const downLg = useMediaQuery((theme: any) => theme.breakpoints.down("lg"));
  const { user } = useSelector((state: any) => state.auth);

  return (
    <DashboardNavbarRoot position="sticky">
      <Container maxWidth="xl">
        <StyledToolBar disableGutters>
          {downLg && (
            <ToggleWrapper onClick={handleDrawerToggle}>
              <Toggle />
            </ToggleWrapper>
          )}

          <CustomButton
            onClick={() => router.push("/")}
            startIcon={
              <Globe
                sx={{
                  color: "grey.900",
                }}
              />
            }
          >
            Browse Website
          </CustomButton>

          <Box flexGrow={1} />

          <FlexBox alignItems="center" gap={2}>
            <StyledInputBase
              placeholder="Search anything..."
              startAdornment={
                <Search
                  sx={{
                    color: "grey.500",
                    mr: 1,
                  }}
                />
              }
            />

            <NotificationsPopover />
            {user.userType && user.userType !== "None" && (
              <Typography color="grey.600" letterSpacing="0.2em">
                <Span
                  p="6px 10px"
                  fontSize={12}
                  lineHeight="1"
                  borderRadius="3px"
                  color="primary.main"
                  bgcolor="primary.light"
                >
                  {user.userType !== "None" ? user.userType?.toUpperCase() : ""}
                </Span>
              </Typography>
            )}
            <AccountPopover />
          </FlexBox>
        </StyledToolBar>
      </Container>
    </DashboardNavbarRoot>
  );
};
export default React.memo(DashboardNavbar);
