"use client";
import React, { useState } from "react";
import Image from "next/legacy/image";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Box, useMediaQuery } from "@mui/material";
import LayoutDrawer from "../LayoutDrawer";
import Scrollbar from "@/components/Scrollbar";
import { FlexBetween } from "@/components/flex-box";
import { navigations } from "./NavigationList";
import SidebarAccordion from "./SidebarAccordion";
import {
  ListLabel,
  BadgeValue,
  StyledText,
  BulletIcon,
  NavWrapper,
  ExternalLink,
  NavItemButton,
  SidebarWrapper,
  ChevronLeftIcon,
  ListIconWrapper,
} from "./LayoutStyledComponents";
const TOP_HEADER_AREA = 70;

// -----------------------------------------------------------------------------
interface PageProps {
  sidebarCompact: boolean;
  showMobileSideBar: boolean;
  setShowMobileSideBar: () => void;
  setSidebarCompact: () => void;
}
const DashboardSidebar = ({
  sidebarCompact,
  showMobileSideBar,
  setShowMobileSideBar,
  setSidebarCompact,
}: PageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [onHover, setOnHover] = useState(false);
  const downLg = useMediaQuery((theme: any) => theme.breakpoints.down("lg"));

  // side hover when side bar is compacted
  const COMPACT = sidebarCompact && !onHover ? 1 : 0;
  // handle active current page
  const activeRoute = (path: string) => (pathname === path ? 1 : 0);

  // handle navigate to another route and close sidebar drawer in mobile device
  const handleNavigation = (path: string) => {
    router.push(path || "");
    setShowMobileSideBar();
  };
  const renderLevels = (data: any) => {
    return data.map((item: any, index: number) => {
      if (item.type === "label")
        return (
          <ListLabel key={index} compact={COMPACT}>
            {item.label}
          </ListLabel>
        );
      if (item.children) {
        return (
          <SidebarAccordion key={index} item={item} sidebarCompact={COMPACT}>
            {renderLevels(item.children)}
          </SidebarAccordion>
        );
      } else if (item.type === "extLink") {
        return (
          <ExternalLink
            key={index}
            href={item.path}
            rel="noopener noreferrer"
            target="_blank"
          >
            <NavItemButton key={item.name} name="child" active={0}>
              {item.icon ? (
                <ListIconWrapper>
                  <item.icon />
                </ListIconWrapper>
              ) : (
                <span className="item-icon icon-text">{item.iconText}</span>
              )}

              <StyledText compact={COMPACT}>{item.name}</StyledText>

              {/* <Box mx="auto" /> */}

              {item.badge && (
                <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>
              )}
            </NavItemButton>
          </ExternalLink>
        );
      } else {
        return (
          <Box key={index}>
            <NavItemButton
              key={item.name}
              className="navItem"
              active={activeRoute(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              {item?.icon ? (
                <ListIconWrapper>
                  <item.icon />
                </ListIconWrapper>
              ) : (
                <BulletIcon active={activeRoute(item.path)} />
              )}

              <StyledText compact={COMPACT}>{item.name}</StyledText>

              {/* <Box mx="auto" /> */}

              {item.badge && (
                <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>
              )}
            </NavItemButton>
          </Box>
        );
      }
    });
  };
  const content = (
    <Scrollbar
      autohide="hide"
      sx={{
        overflowX: "hidden",
        maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
      }}
    >
      <NavWrapper compact={sidebarCompact}>
        {renderLevels(navigations)}
      </NavWrapper>
    </Scrollbar>
  );
  if (downLg) {
    return (
      <LayoutDrawer
        open={showMobileSideBar ? true : false}
        onClose={setShowMobileSideBar}
      >
        <Box p={2} maxHeight={TOP_HEADER_AREA}>
          <Image
            alt="Logo"
            width={105}
            height={50}
            src="/assets/images/logo.png"
            style={{
              marginLeft: 8,
            }}
          />
        </Box>

        {content}
      </LayoutDrawer>
    );
  }
  return (
    <SidebarWrapper
      compact={sidebarCompact ? 1 : 0}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => sidebarCompact && setOnHover(false)}
    >
      <FlexBetween
        p={2}
        maxHeight={TOP_HEADER_AREA}
        justifyContent={COMPACT ? "center" : "space-between"}
      >
        <Avatar
          src={
            COMPACT
              ? "/assets/images/taphoa.svg"
              : "/assets/images/logo.png"
          }
          sx={{
            borderRadius: 0,
            width: "auto",
            marginLeft: COMPACT ? 0 : 1,
          }}
        />

        <ChevronLeftIcon
          color="disabled"
          compact={COMPACT}
          onClick={setSidebarCompact}
          sidebarcompact={sidebarCompact ? 1 : 0}
        />
      </FlexBetween>

      {content}
    </SidebarWrapper>
  );
};
export default React.memo(DashboardSidebar);
