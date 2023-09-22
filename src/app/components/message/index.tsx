import { Alert, Slide, Snackbar } from "@mui/material";
import React from "react";

interface MessagProps {
  handleClose?: () => void;
  open: any;
  message: string;
  type: "success" | "error";
}

function TransitionLeft(props: any) {
  return <Slide {...props} direction="left" />;
}
const Message = ({
  handleClose,
  open,
  message,
  type = "success",
}: MessagProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={TransitionLeft}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      sx={{zIndex: '9999'}}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default React.memo(Message);
