"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { Badge, Box, Button, Dialog, Drawer } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Clear, KeyboardArrowDown, PersonOutline } from "@mui/icons-material";
import clsx from "clsx";
import Icon from "@/components/icons";
import { layoutConstant } from "@/utils/constants";
import Auth from "@/components/auth";
import MiniCart from "@/components/MiniCart";
import Category from "@/components/icons/Category";
import { Paragraph } from "@/components/Typography";
import MobileMenu from "@/components/navbar/MobileMenu";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import CategoryMenu from "@/components/categories/CategoryMenu";
import ShoppingBagOutlined from "@/components/icons/ShoppingBagOutlined";
import Image from "next/legacy/image";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { HeaderWrapper, StyledContainer } from "./styles";
import {
  selectCartItemsForUser,
  selectTotalQuantityForUser,
} from "@/redux/features/cartSlice";
import AccountPopover from "../layouts/vendor-dashboard/popovers/AccountPopover";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";

// ==============================================================

type TypeHeader = {
  isfixed?: any;
  className?: string;
  searchInput?: any;
};
const Header: React.FC<TypeHeader> = ({ className, searchInput }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [isfixed, setFixed] = useState(false);
  const params = useParams()

  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  const { user } = useSelector((state: RootState) => state.auth);
  const userCartItems = useSelector(selectCartItemsForUser(user.docId));
  const totalQuantity = useSelector(selectTotalQuantityForUser(user.docId));

  const toggleDialog = () => setDialogOpen(!dialogOpen);
  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);
  const toggleSearchBar = () => {
    setSearchBarOpen(!searchBarOpen);
  };

  useEffect(() => {
    if (!window) return;
    const scrollListener = debounce(() => {
      if (window?.pageYOffset >= layoutConstant.headerHeight) setFixed(true);
      else setFixed(false);
    }, 150);
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  useEffect(() => {
    if (user?.uid) {
      setDialogOpen(false);
    }
  }, [user?.uid]);

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
        <Auth onClosePopup={toggleDialog} />
      </Dialog>

      <Drawer
        open={sidenavOpen}
        anchor="right"
        onClose={toggleSidenav}
        sx={{
          zIndex: 9999,
        }}
      >
        <MiniCart cartList={userCartItems} toggleSidenav={toggleSidenav} />
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
          fixedHeader: isfixed,
          className,
        })}
        isfixed={isfixed ? "fixed" : "false"}
      >
        <StyledContainer>
          <FlexBetween width="100%">
            {/* LEFT CONTENT - NAVIGATION ICON BUTTON */}
            <Box flex={1}>
              <MobileMenu />
            </Box>

            {/* MIDDLE CONTENT - LOGO */}
            <Link href={`/${params.lang}`}>
              <Image
                src="/assets/images/logo2.png"
                alt="logo"
                width={90}
                height={65}
                style={{ marginTop: "12px" }}
              />
            </Link>

            {/* RIGHT CONTENT - Auth, CART, SEARCH BUTTON */}
            <FlexBox justifyContent="end" flex={1}>
              <Box component={IconButton} onClick={toggleSearchBar}>
                <Icon.Search sx={ICON_STYLE} />
              </Box>

              <Box component={IconButton} onClick={toggleDialog}>
                <Icon.User sx={ICON_STYLE} />
              </Box>

              <Box component={IconButton} onClick={toggleSidenav}>
                <Badge badgeContent={totalQuantity} color="primary">
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

          {/* Auth FORM DIALOG AND CART SIDE BAR  */}
          {DIALOG_DRAWER}
        </StyledContainer>
      </HeaderWrapper>
    );
  }
  return (
    <HeaderWrapper
      isfixed={isfixed ? "fixed" : "false"}
      className={clsx({
        fixedHeader: isfixed,
        className,
      })}
    >
      <StyledContainer>
        {/* LEFT CONTENT - LOGO AND CATEGORY */}
        <FlexBox mr={2} minWidth="170px" alignItems="center">
          <Link href={`/${params.lang}`}>
            <Image
              width={205}
              height={50}
              src="/assets/images/logo.png"
              alt="logo"
            />
          </Link>

          {/* SHOW DROP DOWN CATEGORY BUTTON WHEN HEADER FIXED */}
          {isfixed && (
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

        {/* Auth AND CART BUTTON */}
        <FlexBox gap={1.5} alignItems="center">
          {/* <Avatar toggleDialog={toggleDialog} /> */}
          {user?.uid ? (
            <AccountPopover />
          ) : (
            <Box
              component={IconButton}
              p={1.25}
              bgcolor="grey.200"
              onClick={toggleDialog}
            >
              <PersonOutline />
            </Box>
          )}

          <Badge badgeContent={totalQuantity} color="primary">
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

        {/* Auth FORM DIALOG AND CART SIDE BAR  */}
        {DIALOG_DRAWER}
      </StyledContainer>
    </HeaderWrapper>
  );
};
export default React.memo(Header);
