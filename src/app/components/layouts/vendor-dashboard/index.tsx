"use client";
import { Box, styled } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setStatus } from "@/redux/features/adminSlice";

// styled components
const BodyWrapper = styled(Box)(
  ({ theme, compact }: { theme?: any; compact: string | number }) => ({
    transition: "margin-left 0.3s",
    marginLeft: compact ? "86px" : "280px",
    [theme.breakpoints.down("lg")]: {
      marginLeft: 0,
    },
  })
);
const InnerWrapper = styled(Box)(({ theme }) => ({
  transition: "all 0.3s",
  [theme.breakpoints.up("lg")]: {
    maxWidth: 1200,
    margin: "auto",
  },
  [theme.breakpoints.down(1550)]: {
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
}));

// ======================================================

const VendorDashboardLayout = ({ children }: React.PropsWithChildren) => {
  const [sidebarCompact, setSidebarCompact] = useState<any>(0);
  const [showMobileSideBar, setShowMobileSideBar] = useState<any>(0);
  const pathname = usePathname();
  const dispatch = useDispatch();

  // handle sidebar toggle for desktop device
  const handleCompactToggle = () =>
    setSidebarCompact((state: any) => (state ? 0 : 1));
  // handle sidebar toggle in mobile device
  const handleMobileDrawerToggle = () =>
    setShowMobileSideBar((state: any) => (state ? 0 : 1));

    useEffect(() => {
    if (pathname.includes("create")) {
      dispatch(setStatus("create"));
      return
    }
    dispatch(setStatus("edit"));
  }, [pathname]);

  return (
    <Fragment>
      <DashboardSidebar
        sidebarCompact={sidebarCompact}
        showMobileSideBar={showMobileSideBar}
        setSidebarCompact={handleCompactToggle}
        setShowMobileSideBar={handleMobileDrawerToggle}
      />

      <BodyWrapper compact={sidebarCompact ? 1 : 0}>
        <DashboardNavbar handleDrawerToggle={handleMobileDrawerToggle} />
        <InnerWrapper>{children}</InnerWrapper>
      </BodyWrapper>
    </Fragment>
  );
};
export default React.memo(VendorDashboardLayout);
