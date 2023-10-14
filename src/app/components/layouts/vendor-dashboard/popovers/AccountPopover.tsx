import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import { H6, Small } from "@/components/Typography";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { auth } from "@/firebase";
import { useParams } from "next/navigation";
import { setMessage } from "@/redux/features/messageSlice";
import Link from "next/link";
import { ADMIN_ID } from "@/app/constant";
import { RootState } from "@/redux/store";
import useCustomRouter from "@/hooks/usePushRouter";

// styled components
const Divider = styled(Box)(({ theme }) => ({
  margin: "0.5rem 0",
  border: `1px dashed ${theme.palette.grey[200]}`,
}));
const StyledBadge = styled(Badge)(({ theme }: { theme: any }) => ({
  cursor: "pointer",
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const AccountPopover = () => {
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: any = useAppDispatch();
  const { displayName, isVendor, photoURL, docId } = user || {};
  const params = useParams();
  const { pushRouter } = useCustomRouter();

  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleLogout = () => {
    dispatch(logout());
    pushRouter("/");
    // sign out function from firebase
    auth
      .signOut()
      .then(() => {
        dispatch(setMessage({ message: "Log out successfully." }));
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <Box>
      <IconButton
        sx={{
          padding: 0,
        }}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "account-menu" : undefined}
      >
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar
            alt={displayName || "Not updated"}
            src={photoURL || "/assets/images/avatars/001-man.svg"}
          />
        </StyledBadge>
      </IconButton>

      <Menu
        open={open}
        id="account-menu"
        anchorEl={(anchorEl as Element) || null}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            boxShadow: 2,
            minWidth: 200,
            borderRadius: "8px",
            overflow: "visible",
            border: "1px solid",
            borderColor: "grey.200",
            "& .MuiMenuItem-root:hover": {
              backgroundColor: "grey.200",
            },
            "&:before": {
              top: 0,
              right: 14,
              zIndex: 0,
              width: 10,
              height: 10,
              content: '""',
              display: "block",
              position: "absolute",
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderColor: "grey.200",
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
            },
          },
        }}
      >
        <Box px={2} pt={1}>
          <H6>{displayName || "Not updated"}</H6>
          <Small color="grey.500">
            {isVendor ? "Seller" : docId === ADMIN_ID ? "Admin" : "User"}
          </Small>
        </Box>

        <Divider />
        {isVendor ? (
          <Link href={`/${params.lang}/dashboard`}>
            <MenuItem>Dashboard</MenuItem>
          </Link>
        ) : (
          <Box>
            <Link href={`/${params.lang}/profile`}>
              <MenuItem>Profile</MenuItem>
            </Link>
            <Link href={`/${params.lang}/orders`}>
              <MenuItem>My Orders</MenuItem>
            </Link>
            <Link href={`/${params.lang}/wish-list`}>
              <MenuItem>My Wishlist</MenuItem>
            </Link>
          </Box>
        )}

        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};
export default React.memo(AccountPopover);
