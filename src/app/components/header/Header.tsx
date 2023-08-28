"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { Badge, Box, Button, Dialog, Drawer, styled } from "@mui/material";
import Container from "@mui/material/Container";
import { keyframes, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Clear, KeyboardArrowDown, PersonOutline } from "@mui/icons-material";
import clsx from "clsx";
import Icon from "@/components/icons";
import { layoutConstant } from "@/utils/constants";
import Login from "@/page-sections/sessions/Login";
// import { useAppContext } from "contexts/AppContext";
import MiniCart from "@/components/MiniCart";
import Category from "@/components/icons/Category";
import { Paragraph } from "@/components/Typography";
import MobileMenu from "@/components/navbar/MobileMenu";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import CategoryMenu from "@/components/categories/CategoryMenu";
import ShoppingBagOutlined from "@/components/icons/ShoppingBagOutlined";
import Image from "next/image";
import { debounce } from "lodash";

// styled component
const slideFromTop = keyframes`
from { top: -${layoutConstant.headerHeight}px; }
to { top: 0; }`;

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  zIndex: 3,
  position: "relative",
  height: layoutConstant.headerHeight,
  transition: "height 250ms ease-in-out",
  background: theme.palette.background.paper,
  "&.fixedHeader": {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    background: "white",
    height: layoutConstant.headerHeight,
    boxShadow: theme.shadows[2],
    animation: `${slideFromTop} 250ms ease-in-out`,
    "& .link": {
      color: "inherit",
    },
  },
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight,
  },
}));
const StyledContainer = styled(Container)({
  gap: 2,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

// ==============================================================

type TypeHeader = {
  isFixed?: boolean;
  className?: string;
  searchInput?: any;
};
const Header: React.FC<TypeHeader> = ({ className, searchInput }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));
  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  };
  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);
  const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);

  const [isFixed, setFixed] = useState(false);
  useEffect(() => {
    if (!window) return;
    const scrollListener = debounce(() => {
      if (window?.pageYOffset >= layoutConstant.headerHeight) setFixed(true);
      else setFixed(false);
    }, 150);
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  // LOGIN AND MINICART DRAWER
  const DIALOG_DRAWER = (
    <Fragment>
      <Dialog
        scroll="body"
        open={dialogOpen}
        fullWidth={isMobile}
        onClose={toggleDialog}
        sx={{
          zIndex: 9999,
        }}
      >
        <Login />
      </Dialog>

      <Drawer
        open={sidenavOpen}
        anchor="right"
        onClose={toggleSidenav}
        sx={{
          zIndex: 9999,
        }}
      >
        <MiniCart toggleSidenav={toggleSidenav} />
      </Drawer>
    </Fragment>
  );

  // FOR SMALLER DEVICE
  if (downMd) {
    const ICON_STYLE = {
      color: "grey.600",
      fontSize: 20,
    };
    return (
      <HeaderWrapper
        className={clsx({
          fixedHeader: isFixed,
          className,
        })}
      >
        <StyledContainer>
          <FlexBetween width="100%">
            {/* LEFT CONTENT - NAVIGATION ICON BUTTON */}
            <Box flex={1}>
              <MobileMenu />
            </Box>

            {/* MIDDLE CONTENT - LOGO */}
            <Link href="/">
              <Image
                src="/assets/images/logo2.png"
                alt="logo"
                width={90}
                height={65}
                style={{ marginTop: "12px" }}
              />
            </Link>

            {/* RIGHT CONTENT - LOGIN, CART, SEARCH BUTTON */}
            <FlexBox justifyContent="end" flex={1}>
              <Box component={IconButton} onClick={toggleSearchBar}>
                <Icon.Search sx={ICON_STYLE} />
              </Box>

              <Box component={IconButton} onClick={toggleDialog}>
                <Icon.User sx={ICON_STYLE} />
              </Box>

              <Box component={IconButton} onClick={toggleSidenav}>
                <Badge color="primary">
                  <Icon.CartBag sx={ICON_STYLE} />
                </Badge>
              </Box>
            </FlexBox>
          </FlexBetween>

          {/* SEARCH FORM DRAWER */}
          <Drawer
            open={searchBarOpen}
            anchor="top"
            onClose={toggleSearchBar}
            sx={{
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                width: "auto",
                padding: 2,
                height: "100vh",
              }}
            >
              <FlexBetween mb={1}>
                <Paragraph>Search to Taphoa</Paragraph>

                <IconButton onClick={toggleSearchBar}>
                  <Clear />
                </IconButton>
              </FlexBetween>

              {/* CATEGORY BASED SEARCH FORM */}
              {searchInput}
            </Box>
          </Drawer>

          {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
          {DIALOG_DRAWER}
        </StyledContainer>
      </HeaderWrapper>
    );
  }
  return (
    <HeaderWrapper
      className={clsx({
        fixedHeader: isFixed,
        className,
      })}
    >
      <StyledContainer>
        {/* LEFT CONTENT - LOGO AND CATEGORY */}
        <FlexBox mr={2} minWidth="170px" alignItems="center">
          <Link href="/">
            <Image
              width={205}
              height={50}
              src="/assets/images/logo.png"
              alt="logo"
            />
          </Link>

          {/* SHOW DROP DOWN CATEGORY BUTTON WHEN HEADER FIXED */}
          {isFixed && (
            <CategoryMenu>
              <FlexBox color="grey.600" alignItems="center" ml={2}>
                <Button color="inherit">
                  <Category fontSize="small" color="inherit" />
                  <KeyboardArrowDown fontSize="small" color="inherit" />
                </Button>
              </FlexBox>
            </CategoryMenu>
          )}
        </FlexBox>

        {/* SEARCH FORM */}
        <FlexBox justifyContent="center" flex="1 1 0">
          {searchInput}
        </FlexBox>

        {/* LOGIN AND CART BUTTON */}
        <FlexBox gap={1.5} alignItems="center">
          <Box
            component={IconButton}
            p={1.25}
            bgcolor="grey.200"
            onClick={toggleDialog}
          >
            <PersonOutline />
          </Box>

          <Badge color="primary">
            <Box
              p={1.25}
              bgcolor="grey.200"
              component={IconButton}
              onClick={toggleSidenav}
            >
              <ShoppingBagOutlined />
            </Box>
          </Badge>
        </FlexBox>

        {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
        {DIALOG_DRAWER}
      </StyledContainer>
    </HeaderWrapper>
  );
};
export default React.memo(Header);
