import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, styled } from "@mui/material";
import {
  BadgeValue,
  BulletIcon,
  StyledText,
  NavItemButton,
  ListIconWrapper,
  ChevronRightIcon,
} from "./LayoutStyledComponents";

// styled component
const NavExpandRoot = styled(Box)({
  "& .subMenu": {
    padding: 0,
  },
  "& .navItem": {
    background: "transparent",
  },
  "& .expansion-panel": {
    "& .expansion-panel": {
      paddingLeft: 8,
    },
    overflow: "hidden",
    transition: "max-height 0.3s cubic-bezier(0, 0, 0.2, 1)",
  },
});

// ================================================================
interface PageProps {
  item: {
    name: string;
    icon: any;
    iconText: string;
    badge: any;
    children: any;
  };
  children: React.ReactNode;
  sidebarCompact: any;
}
const SidebarAccordion = ({ item, children, sidebarCompact }: PageProps) => {
  const { name, icon, iconText, badge } = item;
  const pathname = usePathname();
  const componentHeight = useRef(0);
  const elementRef = useRef<any>();
  const [collapsed, setCollapsed] = useState(false);
  const [hasActive, setHasActive] = useState(false);
  const handleClick = () => {
    componentHeight.current = 0;
    calcaulateHeight(elementRef.current);
    setCollapsed(!collapsed);
  };
  const calcaulateHeight = useCallback(
    (node: { name: "child"; children: any; scrollHeight: number }) => {
      if (node.name !== "child") {
        for (let child of node.children) {
          calcaulateHeight(child);
        }
      }
      if (node.name === "child") componentHeight.current += node.scrollHeight;
      else componentHeight.current += 44; //here 44 is node height
      return;
    },
    []
  );
  useEffect(() => {
    if (!elementRef) return;
    calcaulateHeight(elementRef.current);

    // OPEN DROPDOWN IF CHILD IS ACTIVE
    for (let child of item.children) {
      if (child.path === pathname) {
        setCollapsed(true);
        setHasActive(true);
      }
    }
    return () => {
      setHasActive(false);
      setCollapsed(false);
    };
  }, [calcaulateHeight, item.children, pathname]);
  return (
    <NavExpandRoot className="subMenu">
      <NavItemButton
        onClick={handleClick}
        active={hasActive ? 1 : 0}
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center">
          {/* //@ts-ignore */}
          {icon && (
            <ListIconWrapper>
              <item.icon />
            </ListIconWrapper>
          )}
          {iconText && <BulletIcon active={hasActive ? 1 : 0} />}
          <StyledText compact={sidebarCompact}>{name}</StyledText>
        </Box>

        {badge && (
          <BadgeValue compact={sidebarCompact} className="itemIcon">
            {badge.value}
          </BadgeValue>
        )}

        <ChevronRightIcon
          color="disabled"
          compact={sidebarCompact}
          className="accordionArrow"
          collapsed={collapsed ? 1 : 0}
        />
      </NavItemButton>

      <div
        ref={elementRef}
        className="expansion-panel"
        style={{
          maxHeight:
            !collapsed || sidebarCompact
              ? "0px"
              : componentHeight.current + "px",
        }}
      >
        {children}
      </div>
    </NavExpandRoot>
  );
};
export default React.memo(SidebarAccordion);
