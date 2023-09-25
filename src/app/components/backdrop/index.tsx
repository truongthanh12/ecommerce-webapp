import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const BackdropLoading = () => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default React.memo(BackdropLoading);
