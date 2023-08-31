import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Popover,
  Typography,
  styled,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { PersonOutline } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { setMessage } from "@/redux/features/messageSlice";

interface AvatarProps {
  toggleDialog: () => void;
}
const StyledAvatar = styled(Avatar)(({ theme }: { theme: any }) => ({
  backgroundColor: `${theme.palette.primary.main}`,
}));
const StyledButton = styled(Avatar)(({ theme }: { theme: any }) => ({
  width: "100%",
  height: "auto",
  backgroundColor: `unset`,
  color: "#333",
  "& .button": {
    width: "100%",
    padding: 0,
    display: "flex",
    justifyContent: "flex-start",
  },
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

const AvatarUser = ({ toggleDialog }: AvatarProps) => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (user.uid) {
    return (
      <>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          onClick={handleClick}
        >
          <StyledAvatar alt="Remy Sharp" src={user.photoURL} />
        </StyledBadge>
        {anchorEl && (
          <Popover
            id={"popover"}
            open={true}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography sx={{ py: 1, px: 2 }}>{user.email}</Typography>
            <StyledButton onClick={handleLogout} sx={{ py: 1, px: 2 }}>
              <Button className="button" title="log out">
                Log out
              </Button>
            </StyledButton>
          </Popover>
        )}
      </>
    );
  }
  return (
    <Box
      component={IconButton}
      p={1.25}
      bgcolor="grey.200"
      onClick={toggleDialog}
    >
      <PersonOutline />
    </Box>
  );
};

export default React.memo(AvatarUser);
