import { Dialog, useMediaQuery } from "@mui/material";
import React from "react";
import Auth from "../auth";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch } from "@/redux/hooks";
import { clearPopup } from "@/redux/features/popupSlice";

const AuthPopup = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const handleClosePopup = () => {
    dispatch(clearPopup())
  }

  return (
    <Dialog
      scroll="body"
      open={true}
      fullWidth={isMobile}
      onClose={handleClosePopup}
      sx={{
        zIndex: 9999,
      }}
    >
      <Auth />
    </Dialog>
  );
};

export default React.memo(AuthPopup);
